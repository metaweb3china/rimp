import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import UserManager from './UserManager'

export default async function AdminPage() {
  const auth = await getAuth()
  if (!auth || auth.role === 'RESEARCHER') redirect('/dashboard')

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, username: true, name: true, role: true, active: true, createdAt: true, createdBy: true },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">用户管理</h1>
      <UserManager users={users} currentRole={auth.role} />
    </div>
  )
}
