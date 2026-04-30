import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'

export async function GET() {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const where = auth.role === 'RESEARCHER' ? { userId: auth.userId } : {}
  const records = await prisma.experimentRecord2.findMany({
    where,
    orderBy: { seq: 'asc' },
    include: { user: { select: { name: true } } },
  })
  return NextResponse.json(records)
}

export async function POST(req: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()

    const maxSeq = await prisma.experimentRecord2.aggregate({ _max: { seq: true } })
    const seq = (maxSeq._max.seq ?? 0) + 1

    const record = await prisma.experimentRecord2.create({
      data: { ...data, seq, userId: auth.userId },
    })
    return NextResponse.json(record, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}
