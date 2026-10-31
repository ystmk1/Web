import Link from 'next/link'
import { getNote, href, type Note } from '@/lib/data'

/** 노트 이름 목록을 '제목: 한 줄 요약' 형태로 보여준다 */
export default function NoteList({ names, showDate = false }: { names: (string | Note)[]; showDate?: boolean }) {
  const notes = names.map((n) => (typeof n === 'string' ? getNote(n) : n)).filter(Boolean) as Note[]
  if (!notes.length) return <p className="muted">없음</p>
  return (
    <ul className="list">
      {notes.map((n) => (
        <li key={n.name}>
          {showDate && n.created && <span className="muted">{n.created} </span>}
          <Link href={href(n.name)}>{n.title}</Link>
          {n.summary && <span className="muted">: {n.summary}</span>}
        </li>
      ))}
    </ul>
  )
}
