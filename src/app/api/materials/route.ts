import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const materials = await prisma.material.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
  return NextResponse.json(materials)
}

export async function POST(req: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, unit, specs, remark } = await req.json()
    if (!name) return NextResponse.json({ error: '名称必填' }, { status: 400 })

    const material = await prisma.material.create({
      data: { name, unit: unit || 'g/L', specs, remark },
    })
    return NextResponse.json(material, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}
