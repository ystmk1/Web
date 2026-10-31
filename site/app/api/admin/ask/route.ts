import Anthropic from '@anthropic-ai/sdk'
import { isAdmin, unauthorized } from '@/lib/auth'
import { buildPrompt } from '@/lib/prompt'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/** 드래그한 글자로 질문 노트 초안을 만든다. 글자가 생기는 대로 흘려보낸다. 저장은 하지 않는다. */
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: 'ANTHROPIC_API_KEY가 없어요.' }, { status: 500 })

  const body = await req.json().catch(() => ({}))
  const selection = String(body.selection ?? '').slice(0, 2000)
  const note = String(body.note ?? '').slice(0, 200)
  const question = body.question ? String(body.question).slice(0, 2000) : undefined
  if (!selection.trim()) return Response.json({ error: '드래그한 글자가 없어요.' }, { status: 400 })

  const { system, user } = buildPrompt({ selection, note, question })
  const client = new Anthropic()
  const stream = client.messages.stream({
    model: process.env.CLAUDE_MODEL || 'claude-opus-5-5',
    max_tokens: 8000,
    system,
    messages: [{ role: 'user', content: user }],
  })

  // 첫 글자가 나올 때까지 기다린다. 그 전에 실패하면(키 오류 등) 초안 대신 오류로 돌려준다.
  const it = stream[Symbol.asyncIterator]()
  const textOf = (ev: { type: string; delta?: { type: string; text?: string } }) =>
    ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta' ? (ev.delta.text ?? '') : ''
  let first = ''
  try {
    for (;;) {
      const r = await it.next()
      if (r.done) break
      first = textOf(r.value as never)
      if (first) break
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return Response.json({ error: `Claude API 오류: ${msg.slice(0, 300)}` }, { status: 502 })
  }

  const encoder = new TextEncoder()
  const out = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(first))
      try {
        for (;;) {
          const r = await it.next()
          if (r.done) break
          const t = textOf(r.value as never)
          if (t) controller.enqueue(encoder.encode(t))
        }
      } catch (e) {
        controller.enqueue(encoder.encode(`\n\n[생성 중 오류: ${e instanceof Error ? e.message : String(e)}]`))
      } finally {
        controller.close()
      }
    },
    cancel() {
      stream.abort()
    },
  })
  return new Response(out, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })
}
