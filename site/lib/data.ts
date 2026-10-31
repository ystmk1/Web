import 'server-only'
import raw from '@/generated/notes.json'

export type Note = {
  name: string
  path: string
  folder: string
  type: string | null
  category: string | null
  aliases: string[]
  tags: string[]
  created: string | null
  updated: string | null
  concepts: string[]
  html: string
  links: string[]
  title: string
  summary: string
  text: string
  markdown: string
}

export type Category = { name: string; summary: string; notes: string[] }

type Data = {
  generatedAt: string
  home: string | null
  questionHub: string | null
  notes: Note[]
  backlinks: Record<string, string[]>
  categories: Category[]
  questions: string[]
  recent: string[]
  tags: Record<string, string[]>
  aliasIndex: Record<string, string>
  missing: Record<string, string[]>
}

export const data = raw as unknown as Data

const byName = new Map(data.notes.map((n) => [n.name, n]))

export const getNote = (name: string) => byName.get(name)
export const allNotes = () => data.notes

export const href = (name: string) => `/w/${encodeURIComponent(name)}`

/** 주소창에서 온 이름은 인코딩된 채로 올 때가 있어서 한 번 풀어준다 */
export function decodeParam(v: string) {
  try {
    return decodeURIComponent(v).normalize('NFC')
  } catch {
    return v.normalize('NFC')
  }
}

/** 이 개념을 concepts 속성에 넣은 질문 노트 (노트를 안 고쳐도 새 질문이 바로 연결된다) */
export function questionsAbout(name: string) {
  return data.questions.filter((q) => byName.get(q)?.concepts.includes(name))
}

export function backlinksOf(name: string) {
  return (data.backlinks[name] ?? []).map((n) => byName.get(n)!).filter(Boolean)
}

export function categoryOf(note: Note) {
  if (note.type === '카테고리') return note.name
  return note.category ?? data.categories.find((c) => c.notes.includes(note.name))?.name ?? null
}

export const TYPE_LABEL: Record<string, string> = {
  홈: '홈',
  카테고리: '카테고리',
  허브: '목록',
  개념: '개념',
  질문: '질문',
}

/** 사이드바에 넘길 가벼운 데이터 */
export function sidebarData() {
  return {
    home: data.home,
    questionHub: data.questionHub,
    categories: data.categories.map((c) => ({
      name: c.name,
      notes: c.notes.map((n) => ({ name: n, title: byName.get(n)?.title ?? n })),
    })),
    questions: data.questions.map((q) => ({ name: q, title: byName.get(q)?.title ?? q })),
  }
}
export type SidebarData = ReturnType<typeof sidebarData>
