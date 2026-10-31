import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import NoteList from '@/components/NoteList'
import {
  allNotes,
  backlinksOf,
  categoryOf,
  data,
  decodeParam,
  getNote,
  href,
  questionsAbout,
  TYPE_LABEL,
  type Note,
} from '@/lib/data'

export const dynamicParams = false

export function generateStaticParams() {
  return allNotes().map((n) => ({ name: n.name }))
}

type Props = { params: Promise<{ name: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = getNote(decodeParam((await params).name))
  return note ? { title: note.title, description: note.summary || undefined } : {}
}

function NameLink({ name }: { name: string }) {
  return getNote(name) ? (
    <Link href={href(name)}>{getNote(name)!.title}</Link>
  ) : (
    <>{name}</>
  )
}

const GROUPS: [string, (n: Note) => boolean][] = [
  ['개념', (n) => n.type === '개념'],
  ['질문', (n) => n.type === '질문'],
  ['목록·카테고리', (n) => n.type !== '개념' && n.type !== '질문'],
]

export default async function NotePage({ params }: Props) {
  const name = decodeParam((await params).name)
  const note = getNote(name)
  if (!note) notFound()

  const category = categoryOf(note)
  const backlinks = backlinksOf(note.name)
  const newQuestions = note.type === '개념' ? questionsAbout(note.name).filter((q) => !note.links.includes(q)) : []

  return (
    <>
      <div className="crumbs">
        <Link href="/">위키</Link>
        {category && category !== note.name && (
          <>
            {' > '}
            <Link href={href(category)}>{category}</Link>
          </>
        )}
        {note.type === '질문' && data.questionHub && (
          <>
            {' > '}
            <Link href={href(data.questionHub)}>질문 목록</Link>
          </>
        )}
      </div>

      <div className="meta">
        {note.type && <span>{TYPE_LABEL[note.type] ?? note.type}</span>}
        {note.created && <span>만든 날 {note.created}</span>}
        {note.updated && note.updated !== note.created && <span>고친 날 {note.updated}</span>}
        {note.aliases.length > 0 && <span>다른 이름: {note.aliases.join(', ')}</span>}
        {note.concepts.length > 0 && (
          <span>
            다루는 개념:{' '}
            {note.concepts.map((c, i) => (
              <span key={c}>
                {i > 0 && ', '}
                <NameLink name={c} />
              </span>
            ))}
          </span>
        )}
        {note.tags.length > 0 && (
          <span>
            태그:{' '}
            {note.tags.map((t) => (
              <Link key={t} className="tag" href={`/tags/${encodeURIComponent(t)}`}>
                #{t}
              </Link>
            ))}
          </span>
        )}
      </div>

      <article className="note" data-note={note.name} dangerouslySetInnerHTML={{ __html: note.html }} />

      {newQuestions.length > 0 && (
        <section className="section">
          <h2>새로 연결된 질문</h2>
          <p className="muted">이 개념을 다루지만 본문 &apos;나온 질문&apos;에는 아직 없는 질문 노트예요.</p>
          <NoteList names={newQuestions} />
        </section>
      )}

      <section className="section">
        <h2>이 노트를 가리키는 노트 ({backlinks.length})</h2>
        {backlinks.length === 0 && <p className="muted">없음</p>}
        {GROUPS.map(([label, test]) => {
          const items = backlinks.filter(test)
          return items.length ? (
            <div key={label}>
              <h3 className="muted">{label}</h3>
              <NoteList names={items} />
            </div>
          ) : null
        })}
      </section>
    </>
  )
}
