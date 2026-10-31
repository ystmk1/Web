import Link from 'next/link'
import { notFound } from 'next/navigation'
import NoteList from '@/components/NoteList'
import { data, decodeParam } from '@/lib/data'

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(data.tags).map((tag) => ({ tag }))
}

type Props = { params: Promise<{ tag: string }> }

export async function generateMetadata({ params }: Props) {
  return { title: `#${decodeParam((await params).tag)}` }
}

export default async function TagPage({ params }: Props) {
  const tag = decodeParam((await params).tag)
  const names = data.tags[tag]
  if (!names) notFound()
  return (
    <article className="note">
      <div className="crumbs">
        <Link href="/tags">태그</Link>
      </div>
      <h1>#{tag}</h1>
      <NoteList names={names} />
    </article>
  )
}
