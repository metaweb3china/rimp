import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'
import Link from 'next/link'

export default async function DashboardPage() {
  const auth = await getAuth()
  if (!auth) return null

  const where = auth.role === 'RESEARCHER' ? { userId: auth.userId } : {}
  const [experimentCount, materialCount, recentExperiments] = await Promise.all([
    prisma.experiment.count({ where }),
    prisma.material.count({ where: { active: true } }),
    prisma.experiment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { name: true } } },
    }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">总览</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">🧪</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{experimentCount}</div>
              <div className="text-sm text-slate-500">实验记录</div>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">🧴</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{materialCount}</div>
              <div className="text-sm text-slate-500">原材料</div>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">📋</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{recentExperiments.length}</div>
              <div className="text-sm text-slate-500">近期实验</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">最近实验记录</h2>
          <Link href="/experiments" className="text-sm text-blue-600 hover:text-blue-700">查看全部 →</Link>
        </div>
        {recentExperiments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <div className="text-4xl mb-3">🧪</div>
            <p>暂无实验记录</p>
            <Link href="/experiments/new" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
              创建第一条实验记录
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentExperiments.map(exp => (
              <Link key={exp.id} href={`/experiments/${exp.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                <div>
                  <div className="font-medium text-slate-900">{exp.title}</div>
                  <div className="text-sm text-slate-400 mt-0.5">
                    {exp.user?.name} · {new Date(exp.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  exp.status === 'completed' ? 'bg-green-100 text-green-700' :
                  exp.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {exp.status === 'completed' ? '已完成' : exp.status === 'draft' ? '草稿' : exp.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
