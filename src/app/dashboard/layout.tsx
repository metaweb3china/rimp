import { redirect } from 'next/navigation'
import { getAuth } from '@/lib/auth'
import Sidebar from './Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = await getAuth()
  if (!auth) redirect('/login')

  return (
    <div className="min-h-screen flex">
      <Sidebar auth={auth} />
      <main className="flex-1 ml-64 p-8 bg-slate-50 min-h-screen">
        {children}
      </main>
    </div>
  )
}
