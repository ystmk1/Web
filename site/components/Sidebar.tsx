'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { SidebarData } from '@/lib/data'

const href = (name: string) => `/w/${encodeURIComponent(name)}`

function currentName(pathname: string) {
  if (!pathname.startsWith('/w/')) return null
  try {
    return decodeURIComponent(pathname.slice(3)).normalize('NFC')
  } catch {
    return pathname.slice(3)
  }
}

export default function Sidebar({ data }: { data: SidebarData }) {
  const pathname = usePathname()
  const current = currentName(pathname)
  const isQuestion = !!current && (current === data.questionHub || data.questions.some((q) => q.name === current))

  return (
    <nav className="sidebar" aria-label="사이트 목차">
      <p className="site-title">
        <Link href="/">Web Workshop 위키</Link>
      </p>

      <form action="/search" className="side-search" role="search">
        <input type="search" name="q" placeholder="검색" aria-label="노트 검색" />
      </form>

      <ul className="side-links">
        {data.home && (
          <li>
            <Link href={href(data.home)}>홈 노트</Link>
          </li>
        )}
        <li>
          <Link href="/all">전체 목록</Link>
        </li>
        <li>
          <Link href="/recent">최근 추가</Link>
        </li>
        <li>
          <Link href="/tags">태그</Link>
        </li>
      </ul>

      <p className="side-heading">개념</p>
      {data.categories.map((c) => {
        const open = current === c.name || c.notes.some((n) => n.name === current)
        return (
          <details key={c.name} open={open}>
            <summary>
              <Link href={href(c.name)} aria-current={current === c.name ? 'page' : undefined}>
                {c.name}
              </Link>{' '}
              <small>({c.notes.length})</small>
            </summary>
            {c.notes.length > 0 ? (
              <ul>
                {c.notes.map((n) => (
                  <li key={n.name}>
                    <Link href={href(n.name)} aria-current={current === n.name ? 'page' : undefined}>
                      {n.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">아직 노트 없음</p>
            )}
          </details>
        )
      })}

      <p className="side-heading">질문</p>
      <details open={isQuestion}>
        <summary>
          {data.questionHub ? <Link href={href(data.questionHub)}>질문 목록</Link> : '질문 목록'}{' '}
          <small>({data.questions.length})</small>
        </summary>
        <ul>
          {data.questions.map((q) => (
            <li key={q.name}>
              <Link href={href(q.name)} aria-current={current === q.name ? 'page' : undefined}>
                {q.title}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  )
}
