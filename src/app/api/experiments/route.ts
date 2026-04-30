import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const where = auth.role === 'RESEARCHER' ? { userId: auth.userId } : {}
  const experiments = await prisma.experiment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, title: true, board: true, status: true, createdAt: true,
      user: { select: { name: true } },
      _count: { select: { records: true, tests: true } },
    },
  })
  return NextResponse.json(experiments)
}

export async function POST(req: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { title, purpose, summary, equipment, board, process, records, materialIds, status } = await req.json()

    const experiment = await prisma.experiment.create({
      data: {
        title, purpose, summary, equipment, board,
        process: records?.map((r: any) => `${r.step}: ${r.temp}℃, ${r.duration}min, ${r.method}`).join(' → ') || '',
        status: status || 'draft',
        userId: auth.userId,
        materials: materialIds?.length ? {
          create: materialIds.map((id: number) => ({ materialId: id })),
        } : undefined,
      },
    })
    return NextResponse.json(experiment, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}
