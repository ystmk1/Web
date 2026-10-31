import { Suspense } from 'react'
import SearchClient from '@/components/SearchClient'

export const metadata = { title: '검색' }

export default function SearchPage() {
  return (
    <article className="note">
      <h1>검색</h1>
      <Suspense fallback={<p className="muted">불러오는 중…</p>}>
        <SearchClient />
      </Suspense>
    </article>
  )
}
