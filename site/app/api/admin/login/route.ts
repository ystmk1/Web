import { cookies } from 'next/headers'
import { checkPassword, COOKIE, makeToken } from '@/lib/auth'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  if (!checkPassword(body.password)) {
    await new Promise((r) => setTimeout(r, 800)) // 무작위 대입을 느리게
    return Response.json({ error: '비밀번호가 맞지 않아요.' }, { status: 401 })
  }
  const { value, maxAge } = makeToken()
  ;(await cookies()).set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge,
  })
  return Response.json({ ok: true })
}

export async function DELETE() {
  ;(await cookies()).delete(COOKIE)
  return Response.json({ ok: true })
}
