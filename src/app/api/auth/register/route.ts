import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const auth = await getAuth()
  if (!auth || auth.role === 'RESEARCHER') {
    return NextResponse.json({ error: '无权限' }, { status: 403 })
  }

  try {
    const { username, password, name, role } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ error: '用户名和密码必填' }, { status: 400 })
    }

    const exist = await prisma.user.findUnique({ where: { username } })
    if (exist) {
      return NextResponse.json({ error: '用户名已存在' }, { status: 400 })
    }

    if (role === 'LEAD' && auth.role !== 'ADMIN') {
      return NextResponse.json({ error: '无权限创建组长账号' }, { status: 403 })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { username, password: hash, name, role: role || 'RESEARCHER', createdBy: auth.userId },
    })
    return NextResponse.json({ id: user.id, username: user.username, name: user.name, role: user.role }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}
