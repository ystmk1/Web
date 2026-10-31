// 노트 폴더(레포 루트)를 읽어서 site/generated/notes.json 을 만든다.
// 노트(.md)는 읽기만 하고 절대 고치지 않는다.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import { slug as slugify } from 'github-slugger'

const here = path.dirname(fileURLToPath(import.meta.url))
const SITE = path.resolve(here, '..')
const ROOT = process.env.NOTES_ROOT ? path.resolve(process.env.NOTES_ROOT) : path.resolve(SITE, '..')
const OUT = path.join(SITE, 'generated', 'notes.json')

// 사이트에 보여주지 않는 폴더 (맨 앞 경로 기준)
const HIDDEN_DIRS = new Set(['site', '_템플릿', '예시', 'node_modules'])
// 레포 맨 위의 이런 파일은 노트가 아니라서 숨긴다
const HIDDEN_ROOT_FILES = new Set(['README.md', 'CLAUDE.md', 'AGENTS.md'])

function walk(dir, rel = '') {
  const out = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue
    const r = rel ? `${rel}/${ent.name}` : ent.name
    if (ent.isDirectory()) {
      if (!rel && HIDDEN_DIRS.has(ent.name)) continue
      out.push(...walk(path.join(dir, ent.name), r))
    } else if (ent.name.endsWith('.md')) {
      if (!rel && HIDDEN_ROOT_FILES.has(ent.name)) continue
      out.push(r)
    }
  }
  return out
}

const norm = (s) => String(s).normalize('NFC').trim()
const key = (s) => norm(s).toLowerCase()

// 프론트매터 값에서 [[ ]] 를 벗긴다
function unwrap(v) {
  const m = /^\[\[([^\]]+)\]\]$/.exec(norm(v))
  return m ? m[1].split('|')[0].trim() : norm(v)
}
const asList = (v) => (v == null || v === '' ? [] : Array.isArray(v) ? v : [v]).map((x) => norm(x)).filter(Boolean)
const asDate = (v) => {
  if (!v) return null
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return norm(v)
}

// 1. 파일 읽기
const files = walk(ROOT)
const notes = []
for (const rel of files) {
  const raw = fs.readFileSync(path.join(ROOT, rel), 'utf8')
  const { data, content } = matter(raw)
  const name = norm(path.basename(rel, '.md'))
  const parts = rel.split('/')
  notes.push({
    name,
    path: rel,
    folder: parts.slice(0, -1).join('/'),
    type: data.type ? norm(data.type) : null,
    category: data.category ? unwrap(data.category) : null,
    aliases: asList(data.aliases),
    tags: asList(data.tags).map((t) => t.replace(/^#/, '')),
    created: asDate(data.created),
    updated: asDate(data.updated),
    concepts: asList(data.concepts).map(unwrap),
    content,
  })
}

// 2. 이름·별칭으로 찾는 표
const byKey = new Map()
for (const n of notes) byKey.set(key(n.name), n.name)
const aliasConflicts = []
for (const n of notes) {
  for (const a of n.aliases) {
    const k = key(a)
    if (byKey.has(k) && byKey.get(k) !== n.name) {
      aliasConflicts.push(`${a}: ${byKey.get(k)} / ${n.name}`)
      continue
    }
    byKey.set(k, n.name)
  }
}
const resolve = (target) => byKey.get(key(target)) ?? null

// 3. 마크다운 → HTML (위키링크 변환 포함)
const WIKILINK = /\[\[([^\[\]\n]+?)\]\]/g
const missing = new Map() // 이름 → 가리키는 노트 목록

// 위키링크를 일반 마크다운 링크로 바꾼다. 코드 블록과 인라인 코드 안은 건드리지 않는다.
// 없는 노트(레포 밖 노트)는 링크 없이 일반 글자로 둔다.
const TOKEN = /(`+)[^`]*?\1|\[\[([^\[\]\n]+?)\]\]/g
function convertWikilinks(md, ctx) {
  let fence = null
  return md
    .split('\n')
    .map((line) => {
      const f = /^\s*(```+|~~~+)/.exec(line)
      if (f) {
        if (!fence) fence = f[1][0]
        else if (f[1][0] === fence) fence = null
        return line
      }
      if (fence) return line
      return line.replace(TOKEN, (all, ticks, inner) => {
        if (ticks) return all
        // 표 안의 \| 이스케이프와 일반 | 를 모두 처리
        const [targetPart, ...labelParts] = inner.split(/\\?\|/)
        const label = labelParts.length ? labelParts.join(' ').trim() : null
        const [target, heading] = targetPart.split('#').map((s) => s?.trim())
        const resolved = target ? resolve(target) : ctx.self
        const text = (label || (target ? target + (heading ? ` > ${heading}` : '') : heading)).replace(/([\[\]])/g, '\\$1')
        if (resolved) {
          ctx.links.add(resolved)
          return `[${text}](/w/${encodeURIComponent(resolved)}${heading ? '#' + encodeURIComponent(slugify(heading)) : ''})`
        }
        if (!missing.has(target)) missing.set(target, new Set())
        missing.get(target).add(ctx.self)
        return text
      })
    })
    .join('\n')
}

function rehypeWikilinkClasses() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return
      const href = String(node.properties?.href || '')
      if (href.startsWith('/w/')) {
        node.properties.className = ['wikilink']
      }
    })
  }
}

function render(note) {
  const ctx = { self: note.name, links: new Set() }
  const md = convertWikilinks(note.content, ctx)
  const html = String(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeWikilinkClasses)
      .use(rehypeStringify)
      .processSync(md),
  )
  // 평문, 제목, 한 줄 정의
  const tree = unified().use(remarkParse).use(remarkGfm).parse(note.content)
  const h1 = tree.children.find((c) => c.type === 'heading' && c.depth === 1)
  const bq = tree.children.find((c) => c.type === 'blockquote')
  const strip = (s) => s.replace(WIKILINK, (_a, inner) => inner.split(/\\?\|/).pop()).replace(/\s+/g, ' ').trim()
  return {
    html,
    links: [...ctx.links].filter((l) => l !== note.name),
    title: h1 ? strip(toString(h1)) : note.name,
    summary: bq ? strip(toString(bq)).slice(0, 160) : '',
    text: strip(toString(tree)),
  }
}

for (const n of notes) Object.assign(n, render(n))

// 프론트매터 링크(category, concepts)도 옵시디언처럼 연결로 센다
for (const n of notes) {
  const fm = [n.category, ...n.concepts].filter(Boolean).map(resolve).filter(Boolean)
  n.links = [...new Set([...n.links, ...fm])].filter((l) => l !== n.name)
}

// 4. 백링크
const backlinks = {}
for (const n of notes) backlinks[n.name] = []
for (const n of notes) for (const l of n.links) backlinks[l]?.push(n.name)

// 5. 카테고리와 순서
const byName = Object.fromEntries(notes.map((n) => [n.name, n]))
const home = notes.find((n) => n.type === '홈')
const linkOrder = (n) => (n ? n.links : [])
const categoryNames = notes.filter((n) => n.type === '카테고리').map((n) => n.name)
const catOrder = [
  ...linkOrder(home).filter((l) => categoryNames.includes(l)),
  ...categoryNames.filter((c) => !linkOrder(home).includes(c)).sort((a, b) => a.localeCompare(b, 'ko')),
]
const categories = catOrder.map((cat) => {
  const hub = byName[cat]
  const members = notes.filter((n) => n.name !== cat && n.folder === hub.folder).map((n) => n.name)
  const ordered = [
    ...linkOrder(hub).filter((l) => members.includes(l)),
    ...members.filter((m) => !linkOrder(hub).includes(m)).sort((a, b) => a.localeCompare(b, 'ko')),
  ]
  return { name: cat, summary: hub.text.replace(hub.title, '').trim().slice(0, 80), notes: ordered }
})

// 6. 질문 목록과 최근 추가 순서
const qHub = notes.find((n) => n.type === '허브' && n.folder === '질문')
const qHubOrder = linkOrder(qHub)
const homeOrder = linkOrder(home)
const rank = (arr, name) => {
  const i = arr.indexOf(name)
  return i < 0 ? 9999 : i
}
const byRecent = (a, b) =>
  (b.created || '').localeCompare(a.created || '') ||
  (b.updated || '').localeCompare(a.updated || '') ||
  rank(homeOrder, a.name) - rank(homeOrder, b.name) ||
  rank(qHubOrder, a.name) - rank(qHubOrder, b.name) ||
  a.name.localeCompare(b.name, 'ko')
const questions = notes.filter((n) => n.type === '질문').sort(byRecent).map((n) => n.name)
const recent = notes
  .filter((n) => n.type === '개념' || n.type === '질문')
  .sort(byRecent)
  .map((n) => n.name)

// 7. 태그
const tags = {}
for (const n of notes) for (const t of n.tags) (tags[t] ||= []).push(n.name)

const result = {
  generatedAt: new Date().toISOString(),
  home: home?.name ?? null,
  questionHub: qHub?.name ?? null,
  notes: notes.map(({ content, ...rest }) => ({ ...rest, markdown: content })),
  backlinks,
  categories,
  questions,
  recent,
  tags,
  aliasIndex: Object.fromEntries(byKey),
  missing: Object.fromEntries([...missing].map(([k, v]) => [k, [...v]])),
}
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify(result))
console.log(
  `[index] 노트 ${notes.length}개, 카테고리 ${categories.length}개, 질문 ${questions.length}개, 링크 없는 노트 이름 ${missing.size}종` +
    (aliasConflicts.length ? `\n[index] 별칭 충돌: ${aliasConflicts.join(', ')}` : ''),
)
