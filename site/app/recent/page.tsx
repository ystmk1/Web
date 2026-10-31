import NoteList from '@/components/NoteList'
import { data, getNote } from '@/lib/data'

export const metadata = { title: '최근 추가' }

export default function RecentPage() {
  const groups = new Map<string, string[]>()
  for (const name of data.recent) {
    const d = getNote(name)?.created ?? '날짜 없음'
    if (!groups.has(d)) groups.set(d, [])
    groups.get(d)!.push(name)
  }
  return (
    <article className="note">
      <h1>최근 추가</h1>
      <p className="muted">개념·질문 노트를 만든 날(created) 기준 최신순.</p>
      {[...groups].map(([date, names]) => (
        <section key={date}>
          <h2>{date}</h2>
          <NoteList names={names} />
        </section>
      ))}
    </article>
  )
}
