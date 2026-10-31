'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Pick = { text: string; note: string; x: number; y: number }
type Phase = 'idle' | 'generating' | 'ready' | 'saving' | 'saved' | 'error'

/** 노트 본문에서 글자를 드래그하면 질문 노트 초안을 만들고, 확인 후 레포에 커밋한다 (개발자 전용). */
export default function AdminTools() {
  const [pick, setPick] = useState<Pick | null>(null)
  const [open, setOpen] = useState<Pick | null>(null)
  const [question, setQuestion] = useState('')
  const [draft, setDraft] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [message, setMessage] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  // 드래그(선택)가 끝나면 버튼을 띄운다
  useEffect(() => {
    function onUp() {
      setTimeout(() => {
        const sel = window.getSelection()
        const text = sel?.toString().trim() ?? ''
        if (!sel || !text || sel.rangeCount === 0 || text.length > 500) return setPick(null)
        const node = sel.anchorNode instanceof Element ? sel.anchorNode : sel.anchorNode?.parentElement
        const article = node?.closest<HTMLElement>('.note[data-note]')
        if (!article) return setPick(null)
        const rect = sel.getRangeAt(0).getBoundingClientRect()
        setPick({ text, note: article.dataset.note!, x: rect.left + rect.width / 2, y: rect.bottom })
      }, 0)
    }
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchend', onUp)
    return () => {
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('touchend', onUp)
    }
  }, [])

  const generate = useCallback(async (target: Pick, extra: string) => {
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setDraft('')
    setMessage('')
    setPhase('generating')
    try {
      const r = await fetch('/api/admin/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selection: target.text, note: target.note, question: extra }),
        signal: ac.signal,
      })
      if (!r.ok || !r.body) {
        const j = await r.json().catch(() => ({}))
        throw new Error(j.error ?? `요청 실패 (${r.status})`)
      }
      const reader = r.body.getReader()
      const dec = new TextDecoder()
      let acc = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acc += dec.decode(value, { stream: true })
        setDraft(acc)
      }
      if (acc.includes('[생성 중 오류:')) throw new Error('생성이 중간에 끊겼어요. 다시 만들어 주세요.')
      setPhase('ready')
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      setPhase('error')
      setMessage((e as Error).message)
    }
  }, [])

  async function save() {
    setPhase('saving')
    setMessage('')
    try {
      const r = await fetch('/api/admin/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: draft }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error ?? `저장 실패 (${r.status})`)
      setPhase('saved')
      setMessage(
        `저장했어요: ${j.path}\n옵시디언에서 Sync를 눌러 받아오세요. 사이트에는 Vercel 재배포가 끝나면(1~2분) 보여요.`,
      )
    } catch (e) {
      setPhase('ready')
      setMessage((e as Error).message)
    }
  }

  function close() {
    abortRef.current?.abort()
    setOpen(null)
    setPhase('idle')
    setDraft('')
    setQuestion('')
    setMessage('')
  }

  return (
    <>
      {pick && !open && (
        <button
          className="admin-pick"
          style={{ left: pick.x, top: pick.y + 8 }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setOpen(pick)
            setPick(null)
          }}
        >
          질문 노트 만들기
        </button>
      )}

      {open && (
        <aside className="admin-panel" aria-label="질문 노트 만들기">
          <p>
            <b>질문 노트 만들기</b> <small>(개발자 전용)</small>{' '}
            <button onClick={close} style={{ float: 'right' }}>
              닫기
            </button>
          </p>
          <p className="muted">
            노트: {open.note}
            <br />
            드래그한 글자: <mark>{open.text}</mark>
          </p>
          <label>
            추가로 묻고 싶은 것 (선택)
            <textarea rows={2} value={question} onChange={(e) => setQuestion(e.target.value)} />
          </label>
          <p>
            <button onClick={() => generate(open, question)} disabled={phase === 'generating' || phase === 'saving'}>
              {draft ? '다시 만들기' : '초안 만들기'}
            </button>{' '}
            {phase === 'generating' && <span className="muted">Claude가 쓰는 중…</span>}
          </p>
          {(draft || phase === 'generating') && (
            <label>
              초안 (고칠 수 있어요)
              <textarea
                rows={18}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                readOnly={phase === 'generating'}
                spellCheck={false}
              />
            </label>
          )}
          {(phase === 'ready' || phase === 'saving') && (
            <p>
              <button onClick={save} disabled={phase === 'saving'}>
                {phase === 'saving' ? '저장 중…' : '레포 질문/ 폴더에 저장'}
              </button>
            </p>
          )}
          {message && <p className={phase === 'saved' ? 'admin-ok' : 'admin-err'}>{message}</p>}
        </aside>
      )}
    </>
  )
}
