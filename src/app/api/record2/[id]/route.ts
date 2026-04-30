import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  try {
    const data = await req.json()
    const record = await prisma.experimentRecord2.update({
      where: { id: parseInt(id) },
      data,
    })
    return NextResponse.json(record)
  } catch {
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  try {
    await prisma.experimentRecord2.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
