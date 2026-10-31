import Anthropic from '@anthropic-ai/sdk'
import { isAdmin, unauthorized } from '@/lib/auth'
import { data } from '@/lib/data'
import { buildPrompt, type NoteKind } from '@/lib/prompt'
import { USAGE_MARK, type Tier } from '@/lib/usage'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/** 패널에서 고르는 모델. 기본은 가장 싼 Haiku. */
const MODELS: Record<Tier, string> = {
  haiku: 'claude-haiku-5-5',
  sonnet: 'claude-sonnet-5-5',
  opus: 'claude-opus-5-5',
}

// 노트 한 개는 보통 1,500~3,000 토큰이다. 넉넉히 두되 폭주는 막는다.
const MAX_TOKENS = 4000

/**
 * 드래그한 글자로 개념 노트나 질문 노트 초안을 만든다. 글자가 생기는 대로 흘려보낸다. 저장은 하지 않는다.
 * 비용 줄이기: 싼 모델 기본, 프롬프트 캐시, thinking 끔, 출력 길이 제한, 뻔히 실패할 요청은 API 호출 전에 거절.
 */
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: 'ANTHROPIC_API_KEY가 없어요.' }, { status: 500 })

  const body = await req.json().catch(() => ({}))
  const selection = String(body.selection ?? '').slice(0, 2000)
  const note = String(body.note ?? '').slice(0, 200)
  const question = body.question ? String(body.question).slice(0, 2000) : undefined
  const kind = (['auto', '개념', '질문'].includes(body.kind) ? body.kind : 'auto') as NoteKind
  const tier: Tier = typeof body.model === 'string' && body.model in MODELS ? (body.model as Tier) : 'haiku'
  if (!selection.trim()) return Response.json({ error: '드래그한 글자가 없어요.' }, { status: 400 })

  // 개념 노트를 골랐는데 그 이름의 노트가 이미 있으면, 돈 쓰기 전에 알려준다
  const same = data.aliasIndex[selection.trim().normalize('NFC').toLowerCase()]
  if (kind === '개념' && same && !question?.trim()) {
    return Response.json(
      { error: `'${same}' 노트가 이미 있어요. 질문 노트로 만들거나 '추가로 묻고 싶은 것'을 적어 주세요.` },
      { status: 409 },
    )
  }

  const { system, stable, dynamic } = buildPrompt({ selection, note, question, kind })
  const client = new Anthropic()
  const params = {
    model: MODELS[tier],
    max_tokens: MAX_TOKENS,
    // 규칙과 노트 목록·예시는 매번 같아서 캐시한다 (5분 안에 다시 쓰면 입력 비용이 크게 준다)
    system: [{ type: 'text' as const, text: system, cache_control: { type: 'ephemeral' as const } }],
    messages: [
      {
        role: 'user' as const,
        content: [
          { type: 'text' as const, text: stable, cache_control: { type: 'ephemeral' as const } },
          { type: 'text' as const, text: dynamic },
        ],
      },
    ],
  }

  // thinking은 끈다. 혹시 모델이 이 설정을 받지 않으면 설정 없이 한 번 더 시도한다.
  async function open(withThinkingOff: boolean) {
    const stream = client.messages.stream(withThinkingOff ? { ...params, thinking: { type: 'disabled' } } : params)
    const it = stream[Symbol.asyncIterator]()
    let first = ''
    for (;;) {
      const r = await it.next()
      if (r.done) break
      const ev = r.value
      if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') {
        first = ev.delta.text
        if (first) break
      }
    }
    return { stream, it, first }
  }

  let opened
  try {
    opened = await open(true)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (/thinking/i.test(msg)) {
      try {
        opened = await open(false)
      } catch (e2) {
        return Response.json({ error: `Claude API 오류: ${String(e2 instanceof Error ? e2.message : e2).slice(0, 300)}` }, { status: 502 })
      }
    } else {
      return Response.json({ error: `Claude API 오류: ${msg.slice(0, 300)}` }, { status: 502 })
    }
  }
  const { stream, it, first } = opened

  const encoder = new TextEncoder()
  const out = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(first))
      try {
        for (;;) {
          const r = await it.next()
          if (r.done) break
          const ev = r.value
          if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta' && ev.delta.text) {
            controller.enqueue(encoder.encode(ev.delta.text))
          }
        }
        const final = await stream.finalMessage()
        const u = final.usage
        const usage = {
          model: final.model,
          tier,
          input: u.input_tokens,
          cacheWrite: u.cache_creation_input_tokens ?? 0,
          cacheRead: u.cache_read_input_tokens ?? 0,
          output: u.output_tokens,
          cut: final.stop_reason === 'max_tokens',
        }
        console.log('[ask] usage', JSON.stringify(usage))
        controller.enqueue(encoder.encode(`${USAGE_MARK}${JSON.stringify(usage)}`))
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
