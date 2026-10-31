'use client'

import { useEffect, useState } from 'react'

// 어디에도 링크하지 않는 개발자 로그인 화면
export default function AdminPage() {
  const [admin, setAdmin] = useState<boolean | null>(null)
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    fetch('/api/admin/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setAdmin(!!d.admin))
      .catch(() => setAdmin(false))
  }, [])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    })
    if (r.ok) location.href = '/'
    else setErr((await r.json().catch(() => ({}))).error ?? '로그인 실패')
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    location.reload()
  }

  return (
    <article className="note">
      <h1>관리</h1>
      {admin === null && <p className="muted">확인 중…</p>}
      {admin === true && (
        <>
          <p>로그인되어 있어요. 노트 본문에서 글자를 드래그하면 &apos;질문 노트 만들기&apos; 버튼이 나와요.</p>
          <button onClick={logout}>로그아웃</button>
        </>
      )}
      {admin === false && (
        <form onSubmit={login}>
          <p>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
            />{' '}
            <button type="submit">로그인</button>
          </p>
          {err && <p className="admin-err">{err}</p>}
        </form>
      )}
    </article>
  )
}
