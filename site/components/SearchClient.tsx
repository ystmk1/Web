'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type Item = {
  name: string
  title: string
  type: string | null
  aliases: string[]
  tags: string[]
  summary: string
  text: string
}

const low = (s: string) => s.normalize('NFC').toLowerCase()

function score(item: Item, q: string) {
  const t = low(item.title)
  const n = low(item.name)
  let s = 0
  if (t === q || n === q) s += 100
  else if (t.includes(q) || n.includes(q)) s += 50
  for (const a of item.aliases) {
    const al = low(a)
    if (al === q) s += 80
    else if (al.includes(q)) s += 30
  }
  if (item.tags.some((tag) => low(tag).includes(q))) s += 15
  const body = low(item.text)
  let i = body.indexOf(q)
  let hits = 0
  while (i >= 0 && hits < 10) {
    hits++
    i = body.indexOf(q, i + q.length)
  }
  s += hits * 3
  if (item.type === '개념') s += 1
  return s
}

function snippet(text: string, q: string) {
  const i = low(text).indexOf(q)
  if (i < 0) return null
  const from = Math.max(0, i - 40)
  return (
    <>
      {from > 0 && '…'}
      {text.slice(from, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length, i + q.length + 60)}…
    </>
  )
}

export default function SearchClient() {
  const params = useSearchParams()
  const router = useRouter()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [items, setItems] = useState<Item[] | null>(null)

  useEffect(() => {
    fetch('/search-index.json')
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]))
  }, [])

  useEffect(() => setQ(params.get('q') ?? ''), [params])

  const query = low(q.trim())
  const results = useMemo(() => {
    if (!items || !query) return []
    return items
      .map((it) => ({ it, s: score(it, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || a.it.title.localeCompare(b.it.title, 'ko'))
      .slice(0, 50)
  }, [items, query])

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          router.replace(`/search?q=${encodeURIComponent(q)}`)
        }}
      >
        <input
          type="search"
          value={q}
          autoFocus
          onChange={(e) => setQ(e.target.value)}
          placeholder="개념 이름, 다른 이름(예: JS, 404), 본문 내용"
          style={{ width: '100%', padding: '6px 8px', font: 'inherit' }}
        />
      </form>
      {!items && <p className="muted">불러오는 중…</p>}
      {items && query && <p className="muted">결과 {results.length}개</p>}
      <ul className="list">
        {results.map(({ it }) => {
          const alias = it.aliases.find((a) => low(a).includes(query))
          const snip = snippet(it.text, query)
          return (
            <li key={it.name}>
              <Link href={`/w/${encodeURIComponent(it.name)}`}>{it.title}</Link>{' '}
              <span className="muted">
                [{it.type ?? '노트'}]{alias && !low(it.title).includes(query) ? ` 다른 이름: ${alias}` : ''}
              </span>
              <br />
              <span className="muted">{snip ?? it.summary}</span>
            </li>
          )
        })}
      </ul>
    </>
  )
}
