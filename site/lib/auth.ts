import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const COOKIE = 'ww_admin'
const DAYS = 30

function secret() {
  const s = process.env.ADMIN_SECRET
  if (!s || s.length < 16) throw new Error('ADMIN_SECRET 환경 변수가 없거나 너무 짧아요 (16자 이상).')
  return s
}

const sign = (v: string) => createHmac('sha256', secret()).update(v).digest('base64url')

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

export function checkPassword(input: unknown) {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw || typeof input !== 'string') return false
  return safeEqual(sign(input), sign(pw))
}

export function makeToken() {
  const exp = String(Date.now() + DAYS * 864e5)
  return { value: `${exp}.${sign(exp)}`, maxAge: DAYS * 86400 }
}

export async function isAdmin() {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SECRET) return false
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return false
  const [exp, sig] = token.split('.')
  if (!exp || !sig || Number(exp) < Date.now()) return false
  return safeEqual(sig, sign(exp))
}

export const unauthorized = () => Response.json({ error: '로그인이 필요해요.' }, { status: 401 })
