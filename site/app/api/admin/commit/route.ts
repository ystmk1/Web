import matter from 'gray-matter'
import { isAdmin, unauthorized } from '@/lib/auth'
import { getNote } from '@/lib/data'
import { createFile, fileExists } from '@/lib/github'
import { todaySeoul } from '@/lib/prompt'

export const dynamic = 'force-dynamic'

const BAD = /[\\/:*?"<>|#^\[\]]/g

/** 확인한 질문 노트를 레포의 질문/ 폴더에 새 파일로 커밋한다. 기존 노트는 건드리지 않는다. */
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  const body = await req.json().catch(() => ({}))
  let markdown = String(body.markdown ?? '').trim()
  // 모델이 코드 펜스로 감쌌으면 벗긴다
  markdown = markdown.replace(/^```[a-z]*\n([\s\S]*?)\n```$/i, '$1').trim()

  let parsed
  try {
    parsed = matter(markdown)
  } catch {
    return Response.json({ error: '프론트매터를 읽을 수 없어요.' }, { status: 400 })
  }
  if (parsed.data.type !== '질문') return Response.json({ error: '프론트매터 type이 질문이 아니에요.' }, { status: 400 })
  const h1 = /^#\s+(.+)$/m.exec(parsed.content)?.[1]
  const title = String(body.title || h1 || '')
    .replace(BAD, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
  if (!title) return Response.json({ error: '제목(# 줄)이 없어요.' }, { status: 400 })

  const c = parsed.data.created
  const created = c instanceof Date ? c.toISOString().slice(0, 10) : String(c ?? '')
  const date = /^\d{4}-\d{2}-\d{2}$/.test(created) ? created : todaySeoul()
  try {
    let name = `${date} ${title}`
    for (let i = 2; getNote(name) || (await fileExists(`질문/${name}.md`)); i++) {
      if (i > 20) throw new Error('같은 이름의 노트가 너무 많아요.')
      name = `${date} ${title} ${i}`
    }
    const path = `질문/${name}.md`
    const res = await createFile(path, markdown + '\n', `질문 노트 추가: ${title}`)
    return Response.json({ ok: true, path, name, ...res })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
