import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'
import Link from 'next/link'

export default async function ExperimentsPage() {
  const auth = await getAuth()
  if (!auth) return null

  const where = auth.role === 'RESEARCHER' ? { userId: auth.userId } : {}
  const experiments = await prisma.experiment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">实验记录</h1>
        <Link href="/experiments/new" className="btn-primary">+ 新建实验</Link>
      </div>

      <div className="card overflow-hidden">
        {experiments.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <div className="text-5xl mb-4">🔬</div>
            <p className="text-lg mb-2">暂无实验记录</p>
            <Link href="/experiments/new" className="text-blue-600 hover:text-blue-700">创建第一条实验记录</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-sm text-slate-500">
                <th className="px-6 py-3 font-medium">实验主题</th>
                <th className="px-6 py-3 font-medium">板材</th>
                <th className="px-6 py-3 font-medium">创建人</th>
                <th className="px-6 py-3 font-medium">状态</th>
                <th className="px-6 py-3 font-medium">日期</th>
                <th className="px-6 py-3 font-medium w-20">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {experiments.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/experiments/${exp.id}`} className="font-medium text-slate-900 hover:text-blue-600">
                      {exp.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{exp.board || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{exp.user?.name}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      exp.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{exp.status === 'completed' ? '已完成' : '草稿'}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(exp.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/experiments/${exp.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700">查看</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
