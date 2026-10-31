import Link from 'next/link'
import { data } from '@/lib/data'

export const metadata = { title: '태그' }

export default function TagsPage() {
  const tags = Object.entries(data.tags).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'ko'))
  return (
    <article className="note">
      <h1>태그</h1>
      <ul className="list">
        {tags.map(([t, names]) => (
          <li key={t}>
            <Link href={`/tags/${encodeURIComponent(t)}`}>#{t}</Link> <span className="muted">({names.length})</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
