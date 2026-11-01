// 서버와 화면이 같이 쓰는 사용량 표시·요금 계산 (server-only 아님)

/**
 * 스트림 끝에 붙이는 사용량 표시. 화면에서는 떼어내고 커밋 전에도 한 번 더 지운다.
 * NUL(\u0000)로 시작하는 값을 썼다가, 중간 어딘가(엣지망·압축 등)에서 NUL 바이트가
 * 사라져 표시가 노트 본문에 그대로 남는 사고가 있었다. 사람이 쓸 일이 없는, NUL이
 * 아닌 유니코드 사용 영역(Private Use Area) 문자로 감싼 값으로 바꿨다.
 */
export const USAGE_MARK = '\uE000WW_USAGE\uE000'
/** 옛 NUL 버전 표시. 이미 나간 글자로 생성 중인 요청이 있을 수 있어 당분간 같이 지운다. */
export const USAGE_MARK_LEGACY = '\u0000USAGE'

export type Tier = 'haiku' | 'sonnet' | 'opus'

export const TIER_LABEL: Record<Tier, string> = {
  haiku: '저렴 (Haiku)',
  sonnet: '보통 (Sonnet)',
  opus: '고급 (Opus)',
}

/** 100만 토큰당 달러. 입력, 출력, 캐시 쓰기(5분), 캐시 읽기. 2026-10 기준 공식 가격표 */
const PRICE: Record<Tier, { in: number; out: number; write: number; read: number }> = {
  haiku: { in: 0.1, out: 0.5, write: 0.125, read: 0.01 },
  sonnet: { in: 2, out: 10, write: 2.5, read: 0.1 },
  opus: { in: 4, out: 20, write: 5, read: 0.2 },
}

export type Usage = {
  model: string
  tier: Tier
  input: number
  cacheWrite: number
  cacheRead: number
  output: number
  cut: boolean
}

export function costUSD(u: Usage) {
  const p = PRICE[u.tier] ?? PRICE.opus
  return (u.input * p.in + u.cacheWrite * p.write + u.cacheRead * p.read + u.output * p.out) / 1e6
}
