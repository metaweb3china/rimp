import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hash,
      name: '系统管理员',
      role: 'ADMIN',
    },
  })

  console.log('Seed completed: admin/admin123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
