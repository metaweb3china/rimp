'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const roleLabels: Record<string, string> = {
  ADMIN: '管理员', LEAD: '研发组长', RESEARCHER: '研发员',
}

export default function Sidebar({ auth }: { auth: { userId: number; username: string; role: string } }) {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { href: '/dashboard', label: '总览', icon: '📊' },
    { href: '/experiments', label: '实验记录', icon: '🧪' },
    { href: '/materials', label: '原材料库', icon: '🧴' },
  ]
  if (auth.role !== 'RESEARCHER') {
    links.push({ href: '/admin', label: '用户管理', icon: '👥' })
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white flex flex-col z-50">
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-lg">🔬</div>
          <div>
            <div className="text-sm font-semibold">电子实验记录本</div>
            <div className="text-xs text-slate-400">材料保护</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-sm text-blue-400 font-semibold">
            {auth.username[0].toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-medium">{auth.username}</div>
            <div className="text-xs text-slate-400">{roleLabels[auth.role]}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(link => (
          <Link key={link.href} href={link.href}
            className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}>
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button onClick={handleLogout} className="sidebar-link w-full text-slate-400 hover:text-red-400">
          <span>🚪</span>
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  )
}
