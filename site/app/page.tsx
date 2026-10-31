import Link from 'next/link'
import NoteList from '@/components/NoteList'
import { data, getNote, href } from '@/lib/data'

function intro(markdown: string) {
  // 홈 노트에서 제목 바로 아래 첫 문단만 가져온다
  const lines = markdown.split('\n')
  const start = lines.findIndex((l) => l.startsWith('# '))
  const para: string[] = []
  for (const l of lines.slice(start + 1)) {
    if (l.startsWith('#')) break
    if (l.trim()) para.push(l.trim())
    else if (para.length) break
  }
  return para.join(' ').replace(/\[\[([^\]|]+)(?:\\?\|([^\]]+))?\]\]/g, (_a, t, l) => l || t)
}

export default function Landing() {
  const home = data.home ? getNote(data.home) : null
  const conceptCount = data.notes.filter((n) => n.type === '개념').length

  return (
    <article className="note">
      <h1>Web Workshop 위키</h1>
      {home && <p>{intro(home.markdown)}</p>}
      <p className="muted">
        개념 {conceptCount}개 · 질문 {data.questions.length}개 · 카테고리 {data.categories.length}개
      </p>
      <p>
        {home && (
          <>
            <Link href={href(home.name)}>홈 노트에서 시작하기</Link> ·{' '}
          </>
        )}
        <Link href="/all">전체 목록</Link> · <Link href="/recent">최근 추가</Link> · <Link href="/tags">태그</Link>
      </p>

      <h2>개념 카테고리</h2>
      <ul className="list">
        {data.categories.map((c) => (
          <li key={c.name}>
            <Link href={href(c.name)}>{c.name}</Link> <span className="muted">({c.notes.length})</span>
          </li>
        ))}
      </ul>

      <h2>최근 추가</h2>
      <NoteList names={data.recent.slice(0, 8)} showDate />
      <p>
        <Link href="/recent">더 보기</Link>
      </p>
    </article>
  )
}
