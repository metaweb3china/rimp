import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'
import Link from 'next/link'

export default async function Record2Page() {
  const auth = await getAuth()
  if (!auth) return null

  const where = auth.role === 'RESEARCHER' ? { userId: auth.userId } : {}
  const records = await prisma.experimentRecord2.findMany({
    where, orderBy: { seq: 'asc' },
    include: { user: { select: { name: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">实验记录2</h1>
          <p className="text-sm text-slate-500 mt-1">试验方案及结果记录表</p>
        </div>
        <Link href="/experiments/record2/new" className="btn-primary">+ 新增记录</Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[1200px] text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500">
              <th className="px-3 py-2 font-medium border-r border-slate-200 w-10" rowSpan={2}>序号</th>
              <th className="px-3 py-2 font-medium border-r border-slate-200" colSpan={7}>试验方案</th>
              <th className="px-3 py-2 font-medium border-r border-slate-200" colSpan={5}>前处理效果</th>
              <th className="px-3 py-2 font-medium" colSpan={14}>测试项目及检测结果</th>
            </tr>
            <tr className="bg-slate-50 text-xs text-slate-500">
              <th className="px-2 py-2 font-medium border-r">脱脂</th>
              <th className="px-2 py-2 font-medium border-r">酸洗</th>
              <th className="px-2 py-2 font-medium border-r">中性除锈</th>
              <th className="px-2 py-2 font-medium border-r">表调</th>
              <th className="px-2 py-2 font-medium border-r">磷化</th>
              <th className="px-2 py-2 font-medium border-r">钝化</th>
              <th className="px-2 py-2 font-medium border-r">电泳</th>
              <th className="px-2 py-2 font-medium border-r">脱脂</th>
              <th className="px-2 py-2 font-medium border-r">酸洗</th>
              <th className="px-2 py-2 font-medium border-r">表调</th>
              <th className="px-2 py-2 font-medium border-r">磷化</th>
              <th className="px-2 py-2 font-medium border-r">钝化</th>
              <th className="px-2 py-2 font-medium border-r">膜重(g/m²)</th>
              <th className="px-2 py-2 font-medium border-r" colSpan={2}>XRF</th>
              <th className="px-2 py-2 font-medium border-r">晶像</th>
              <th className="px-2 py-2 font-medium border-r">P比</th>
              <th className="px-2 py-2 font-medium border-r">电泳后外观</th>
              <th className="px-2 py-2 font-medium border-r">漆膜厚度</th>
              <th className="px-2 py-2 font-medium border-r">抗冲击</th>
              <th className="px-2 py-2 font-medium border-r">450h外观</th>
              <th className="px-2 py-2 font-medium border-r">720h外观</th>
              <th className="px-2 py-2 font-medium border-r">1000h外观</th>
              <th className="px-2 py-2 font-medium border-r">腐蚀外观</th>
              <th className="px-2 py-2 font-medium border-r">腐蚀宽度</th>
              <th className="px-2 py-2 font-medium">1000h附着力</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map(r => (
              <tr key={r.id} className="hover:bg-slate-50 text-xs text-slate-600">
                <td className="px-3 py-2 text-center font-medium text-slate-900 border-r">{r.seq}</td>
                <td className="px-2 py-2 border-r">{r.degreasing || '-'}</td>
                <td className="px-2 py-2 border-r">{r.pickling || '-'}</td>
                <td className="px-2 py-2 border-r">{r.derusting || '-'}</td>
                <td className="px-2 py-2 border-r">{r.conditioning || '-'}</td>
                <td className="px-2 py-2 border-r">{r.phosphating || '-'}</td>
                <td className="px-2 py-2 border-r">{r.passivation || '-'}</td>
                <td className="px-2 py-2 border-r">{r.electrophoresis || '-'}</td>
                <td className="px-2 py-2 border-r">{r.preDegreasing || '-'}</td>
                <td className="px-2 py-2 border-r">{r.prePickling || '-'}</td>
                <td className="px-2 py-2 border-r">{r.preConditioning || '-'}</td>
                <td className="px-2 py-2 border-r">{r.prePhosphating || '-'}</td>
                <td className="px-2 py-2 border-r">{r.prePassivation || '-'}</td>
                <td className="px-2 py-2 border-r">{r.filmWeight || '-'}</td>
                <td className="px-2 py-2 border-r text-[10px]">Zr/Si:{r.xrfZrSi || '-'}</td>
                <td className="px-2 py-2 border-r text-[10px]">合金:{r.xrfAlloy || '-'}</td>
                <td className="px-2 py-2 border-r">{r.crystalImage ? '📷' : '-'}</td>
                <td className="px-2 py-2 border-r">{r.pRatio || '-'}</td>
                <td className="px-2 py-2 border-r">{r.paintAppearance || '-'}</td>
                <td className="px-2 py-2 border-r">{r.paintThickness || '-'}</td>
                <td className="px-2 py-2 border-r">{r.impactImage ? '📷' : '-'}</td>
                <td className="px-2 py-2 border-r">{r.saltSpray450h ? '📷' : '-'}</td>
                <td className="px-2 py-2 border-r">{r.saltSpray720h ? '📷' : '-'}</td>
                <td className="px-2 py-2 border-r">{r.saltSpray1000h ? '📷' : '-'}</td>
                <td className="px-2 py-2 border-r">{r.corrosionImage ? '📷' : '-'}</td>
                <td className="px-2 py-2 border-r">{r.corrosionWidth || '-'}</td>
                <td className="px-2 py-2">{r.adhesion1000h ? '📷' : '-'}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={27} className="px-6 py-16 text-center text-slate-400">
                  <div className="text-3xl mb-2">📋</div>
                  <p>暂无记录</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
