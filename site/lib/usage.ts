// 서버와 화면이 같이 쓰는 사용량 표시·요금 계산 (server-only 아님)

/** 스트림 끝에 붙이는 사용량 표시. 화면에서는 떼어낸다. */
export const USAGE_MARK = '\u0000USAGE'

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
