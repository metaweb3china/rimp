import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ error: '请输入用户名和密码' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user || !user.active) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 })
    }

    const token = signToken({ userId: user.id, username: user.username, role: user.role })
    const res = NextResponse.json({
      user: { id: user.id, username: user.username, name: user.name, role: user.role },
    })
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600,
      path: '/',
    })
    return res
  } catch (err) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
