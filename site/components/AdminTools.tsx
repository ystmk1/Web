'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { costUSD, TIER_LABEL, USAGE_MARK, type Tier, type Usage } from '@/lib/usage'

type Pick = { text: string; note: string; x: number; y: number }
type Phase = 'idle' | 'generating' | 'ready' | 'saving' | 'saved' | 'error'
type Kind = 'auto' | '개념' | '질문'

/** 초안 프론트매터를 보고 어디에 저장될지 미리 보여준다 */
function target(draft: string) {
  const fm = /^---\n([\s\S]*?)\n---/.exec(draft.trim())?.[1] ?? ''
  const type = /^type:\s*(\S+)/m.exec(fm)?.[1]
  const title = (/^#\s+(.+)$/m.exec(draft)?.[1] ?? '').trim()
  if (type === '개념') {
    const cat = /^category:\s*"?\[\[([^\]|]+)/m.exec(fm)?.[1] ?? '?'
    return { type, path: `개념/${cat}/${title || '?'}.md` }
  }
  if (type === '질문') {
    const date = /^created:\s*(\S+)/m.exec(fm)?.[1] ?? '날짜'
    return { type, path: `질문/${date} ${title || '?'}.md` }
  }
  return null
}

/** 노트 본문에서 글자를 드래그하면 개념·질문 노트 초안을 만들고, 확인 후 레포에 커밋한다 (개발자 전용). */
export default function AdminTools() {
  const [pick, setPick] = useState<Pick | null>(null)
  const [open, setOpen] = useState<Pick | null>(null)
  const [question, setQuestion] = useState('')
  const [kind, setKind] = useState<Kind>('auto')
  const [tier, setTier] = useState<Tier>('haiku')
  const [usage, setUsage] = useState<Usage | null>(null)
  const [total, setTotal] = useState(0)

  // 고른 모델은 이 브라우저에 기억한다
  useEffect(() => {
    try {
      const t = localStorage.getItem('ww-model') as Tier | null
      if (t && t in TIER_LABEL) setTier(t)
    } catch {}
  }, [])
  const pickTier = (t: Tier) => {
    setTier(t)
    try {
      localStorage.setItem('ww-model', t)
    } catch {}
  }
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

  const generate = useCallback(async (picked: Pick, extra: string, k: Kind, model: Tier) => {
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setDraft('')
    setMessage('')
    setUsage(null)
    setPhase('generating')
    try {
      const r = await fetch('/api/admin/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selection: picked.text, note: picked.note, question: extra, kind: k, model }),
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
        setDraft(acc.split(USAGE_MARK)[0])
      }
      const [text, meta] = acc.split(USAGE_MARK)
      setDraft(text)
      if (meta) {
        try {
          const u = JSON.parse(meta) as Usage
          setUsage(u)
          setTotal((t) => t + costUSD(u))
        } catch {}
      }
      if (text.includes('[생성 중 오류:')) throw new Error('생성이 중간에 끊겼어요. 다시 만들어 주세요.')
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
        `${j.kind} 노트로 저장했어요: ${j.path}\n옵시디언에서 Sync를 눌러 받아오세요. 사이트에는 Vercel 재배포가 끝나면(1~2분) 보여요.`,
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
    setKind('auto')
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
          노트 만들기
        </button>
      )}

      {open && (
        <aside className="admin-panel" aria-label="노트 만들기">
          <p>
            <b>노트 만들기</b> <small>(개발자 전용)</small>{' '}
            <button onClick={close} style={{ float: 'right' }}>
              닫기
            </button>
          </p>
          <p className="muted">
            노트: {open.note}
            <br />
            드래그한 글자: <mark>{open.text}</mark>
          </p>
          <p className="admin-kind">
            종류:{' '}
            {(['auto', '개념', '질문'] as Kind[]).map((k) => (
              <label key={k}>
                <input type="radio" name="kind" checked={kind === k} onChange={() => setKind(k)} />{' '}
                {k === 'auto' ? '자동 (개념이면 개념 노트)' : `${k} 노트`}
              </label>
            ))}
          </p>
          <p className="admin-kind">
            모델:{' '}
            {(Object.keys(TIER_LABEL) as Tier[]).map((t) => (
              <label key={t}>
                <input type="radio" name="tier" checked={tier === t} onChange={() => pickTier(t)} /> {TIER_LABEL[t]}
              </label>
            ))}
          </p>
          <label>
            추가로 묻고 싶은 것 (선택)
            <textarea rows={2} value={question} onChange={(e) => setQuestion(e.target.value)} />
          </label>
          <p>
            <button onClick={() => generate(open, question, kind, tier)} disabled={phase === 'generating' || phase === 'saving'}>
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
          {usage && (
            <p className="muted" style={{ fontSize: 12 }}>
              {usage.model} · 입력 {usage.input + usage.cacheWrite + usage.cacheRead} 토큰 (캐시 읽음 {usage.cacheRead}) · 출력{' '}
              {usage.output} 토큰 · 약 ${costUSD(usage).toFixed(4)}
              {total > costUSD(usage) && ` · 이번 접속 합계 약 $${total.toFixed(4)}`}
              {usage.cut && <span className="admin-err"> · 길이 제한에 걸려 끝이 잘렸어요</span>}
            </p>
          )}
          {(phase === 'ready' || phase === 'saving') && (
            <p>
              {target(draft) ? (
                <>
                  <span className="muted">
                    {target(draft)!.type} 노트 → {target(draft)!.path}
                  </span>
                  <br />
                </>
              ) : (
                <span className="admin-err">프론트매터 type을 읽을 수 없어요.</span>
              )}
              <button onClick={save} disabled={phase === 'saving' || !target(draft)}>
                {phase === 'saving' ? '저장 중…' : '레포에 저장'}
              </button>
            </p>
          )}
          {message && <p className={phase === 'saved' ? 'admin-ok' : 'admin-err'}>{message}</p>}
        </aside>
      )}
    </>
  )
}
