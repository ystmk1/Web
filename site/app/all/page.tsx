import Link from 'next/link'
import NoteList from '@/components/NoteList'
import { data, href } from '@/lib/data'

export const metadata = { title: '전체 목록' }

export default function AllPage() {
  const others = data.notes.filter((n) => n.type === '홈' || (n.type === '허브' && n.folder !== '질문'))
  return (
    <article className="note">
      <h1>전체 목록</h1>
      <p className="muted">카테고리별 개념 노트와 질문 노트 전체. 개념은 카테고리 허브에 적힌 읽는 순서대로예요.</p>
      {data.categories.map((c) => (
        <section key={c.name}>
          <h2>
            <Link href={href(c.name)}>{c.name}</Link> <small className="muted">({c.notes.length})</small>
          </h2>
          <NoteList names={c.notes} />
        </section>
      ))}
      <h2>
        {data.questionHub ? <Link href={href(data.questionHub)}>질문</Link> : '질문'}{' '}
        <small className="muted">({data.questions.length})</small>
      </h2>
      <NoteList names={data.questions} showDate />
      {others.length > 0 && (
        <>
          <h2>기타</h2>
          <NoteList names={others} />
        </>
      )}
    </article>
  )
}
