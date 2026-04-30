import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'
import Link from 'next/link'

export default async function MaterialsPage() {
  const auth = await getAuth()
  if (!auth) return null

  const materials = await prisma.material.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">原材料库</h1>
        <Link href="/materials/new" className="btn-primary">+ 添加原材料</Link>
      </div>

      <div className="card overflow-hidden">
        {materials.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <div className="text-5xl mb-4">🧴</div>
            <p className="text-lg mb-2">原材料库为空</p>
            <Link href="/materials/new" className="text-blue-600 hover:text-blue-700">添加第一种原材料</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-sm text-slate-500">
                <th className="px-6 py-3 font-medium">原材料名称</th>
                <th className="px-6 py-3 font-medium">单位</th>
                <th className="px-6 py-3 font-medium">规格</th>
                <th className="px-6 py-3 font-medium">备注</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {materials.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{m.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{m.unit}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{m.specs || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{m.remark || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
