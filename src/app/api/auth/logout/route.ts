import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  const res = NextResponse.json({ ok: true })
  res.cookies.set('token', '', { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 0, path: '/' })
  return res
}
