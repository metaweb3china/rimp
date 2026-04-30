import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ExperimentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth()
  const { id } = await params
  if (!auth) return null

  const experiment = await prisma.experiment.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: { select: { name: true } },
      materials: { include: { material: true } },
      records: { orderBy: { createdAt: 'desc' }, take: 1 },
      tests: true,
      images: true,
    },
  })
  if (!experiment || (auth.role === 'RESEARCHER' && experiment.userId !== auth.userId)) notFound()

  return (
    <div className="max-w-4xl">
      <Link href="/experiments" className="text-sm text-slate-500 hover:text-slate-700 mb-4 inline-block">← 返回实验列表</Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{experiment.title}</h1>

      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">基本信息</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-400">板材：</span>{experiment.board || '-'}</div>
            <div><span className="text-slate-400">设备：</span>{experiment.equipment || '-'}</div>
            <div><span className="text-slate-400">创建人：</span>{experiment.user?.name}</div>
            <div><span className="text-slate-400">日期：</span>{new Date(experiment.createdAt).toLocaleDateString('zh-CN')}</div>
            <div className="col-span-2"><span className="text-slate-400">实验目的：</span>{experiment.purpose || '-'}</div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">工艺流程</h2>
          <pre className="text-sm text-slate-600 whitespace-pre-wrap">{experiment.process || '未填写'}</pre>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">实验材料</h2>
          {experiment.materials.length === 0 ? (
            <p className="text-sm text-slate-400">未选择材料</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {experiment.materials.map(m => (
                <span key={m.id} className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">{m.material.name}</span>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">实验小结</h2>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{experiment.summary || '暂无'}</p>
        </div>
      </div>
    </div>
  )
}
