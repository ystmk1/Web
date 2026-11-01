import matter from 'gray-matter'
import { isAdmin, unauthorized } from '@/lib/auth'
import { data, getNote } from '@/lib/data'
import { createFile, fileExists } from '@/lib/github'
import { todaySeoul } from '@/lib/prompt'
import { USAGE_MARK, USAGE_MARK_LEGACY } from '@/lib/usage'

export const dynamic = 'force-dynamic'

const BAD = /[\\/:*?"<>|#^\[\]]/g
const clean = (s: string) => s.replace(BAD, ' ').replace(/\s+/g, ' ').trim().slice(0, 80)
const unwrap = (v: unknown) => String(v ?? '').replace(/^\[\[|\]\]$/g, '').split('|')[0].trim()
const fail = (error: string, status = 400) => Response.json({ error }, { status })

function dateOf(v: unknown) {
  const s = v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? '')
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : todaySeoul()
}

/** 이름이나 별칭으로 이미 있는 노트 */
function existing(name: string) {
  return data.aliasIndex[name.normalize('NFC').toLowerCase()] ?? null
}

// /api/admin/ask 가 스트림 맨 끝에 붙이는 사용량 표시. 클라이언트가 떼어내지만,
// 한 번 끝에 안 지워진 채 저장된 적이 있어서(엣지망에서 NUL 바이트가 사라진 사고)
// 커밋 직전에도 한 번 더 지운다. 마커가 없어도, 그 모양(USAGE{"model":...})만
// 남아 있어도 지운다.
function stripUsageTail(s: string) {
  for (const mark of [USAGE_MARK, USAGE_MARK_LEGACY]) {
    const i = s.indexOf(mark)
    if (i >= 0) return s.slice(0, i).trimEnd()
  }
  return s.replace(/\s*USAGE\{"model":[\s\S]*$/, '').trimEnd()
}

/**
 * 확인한 노트를 레포에 새 파일로 커밋한다. 기존 노트는 건드리지 않는다.
 * - 개념 노트 → 개념/<카테고리>/<개념 이름>.md
 * - 질문 노트 → 질문/<날짜> <제목>.md
 */
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  const body = await req.json().catch(() => ({}))
  // 모델이 코드 펜스로 감쌌으면 벗긴다
  const markdown = stripUsageTail(
    String(body.markdown ?? '')
      .trim()
      .replace(/^```[a-z]*\n([\s\S]*?)\n```$/i, '$1')
      .trim(),
  )

  let parsed
  try {
    parsed = matter(markdown)
  } catch {
    return fail('프론트매터를 읽을 수 없어요.')
  }
  const type = parsed.data.type
  const title = clean(/^#\s+(.+)$/m.exec(parsed.content)?.[1] ?? '')
  if (!title) return fail('제목(# 줄)이 없어요.')

  try {
    if (type === '개념') {
      const category = unwrap(parsed.data.category)
      const hub = data.categories.find((c) => c.name === category) ? getNote(category) : null
      if (!hub) return fail(`카테고리 '${category}'가 없어요. 있는 카테고리: ${data.categories.map((c) => c.name).join(', ')}`)
      const same = existing(title)
      if (same) return fail(`'${same}' 노트가 이미 있어요. 질문 노트로 다시 만들어 주세요.`, 409)
      const aliases = (Array.isArray(parsed.data.aliases) ? parsed.data.aliases : []).map(String)
      const taken = aliases.filter((a) => existing(a)).map((a) => `${a} → ${existing(a)}`)
      if (taken.length) return fail(`다른 노트가 이미 쓰는 별칭이 있어요: ${taken.join(', ')}. 초안에서 그 별칭을 지워 주세요.`, 409)
      const path = `${hub.folder}/${title}.md`
      if (await fileExists(path)) return fail(`${path} 파일이 이미 있어요.`, 409)
      const res = await createFile(path, markdown + '\n', `개념 노트 추가: ${title}`)
      return Response.json({ ok: true, kind: '개념', path, name: title, ...res })
    }

    if (type === '질문') {
      const date = dateOf(parsed.data.created)
      let name = `${date} ${title}`
      for (let i = 2; getNote(name) || (await fileExists(`질문/${name}.md`)); i++) {
        if (i > 20) throw new Error('같은 이름의 노트가 너무 많아요.')
        name = `${date} ${title} ${i}`
      }
      const path = `질문/${name}.md`
      const res = await createFile(path, markdown + '\n', `질문 노트 추가: ${title}`)
      return Response.json({ ok: true, kind: '질문', path, name, ...res })
    }

    return fail('프론트매터 type이 개념이나 질문이 아니에요.')
  } catch (e) {
    return fail(e instanceof Error ? e.message : String(e), 500)
  }
}
