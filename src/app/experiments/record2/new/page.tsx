'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewRecord2Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    degreasing: '', pickling: '', derusting: '', conditioning: '',
    phosphating: '', passivation: '', electrophoresis: '',
    preDegreasing: '', prePickling: '', preConditioning: '',
    prePhosphating: '', prePassivation: '',
    filmWeight: '', xrfZrSi: '', xrfAlloy: '',
    crystalImage: '', pRatio: '',
    paintAppearance: '', paintThickness: '', impactImage: '',
    saltSpray450h: '', saltSpray720h: '', saltSpray1000h: '',
    corrosionImage: '', corrosionWidth: '', adhesion1000h: '',
  })

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/record2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) router.push('/experiments/record2')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">新增实验记录</h1>

      <div className="space-y-8">
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 text-lg mb-4">试验方案</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['degreasing', '脱脂'], ['pickling', '酸洗'], ['derusting', '中性除锈'],
              ['conditioning', '表调'], ['phosphating', '磷化'], ['passivation', '钝化'],
              ['electrophoresis', '电泳'],
            ].map(([key, label]) => (
              <div key={key as string}>
                <label className="label">{label as string}</label>
                <input className="input-field" value={form[key as keyof typeof form] as string}
                  onChange={e => update(key as string, e.target.value)} placeholder="温度/时间/方式" />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 text-lg mb-4">前处理效果</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              ['preDegreasing', '脱脂效果'], ['prePickling', '酸洗效果'],
              ['preConditioning', '表调效果'], ['prePhosphating', '磷化效果'],
              ['prePassivation', '钝化效果'],
            ].map(([key, label]) => (
              <div key={key as string}>
                <label className="label">{label as string}</label>
                <input className="input-field" value={form[key as keyof typeof form] as string}
                  onChange={e => update(key as string, e.target.value)} placeholder="效果描述" />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 text-lg mb-4">测试项目及检测结果</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="label">膜重 (g/m²)</label>
              <input className="input-field" value={form.filmWeight} onChange={e => update('filmWeight', e.target.value)} />
            </div>
            <div>
              <label className="label">XRF Zr/Si (mg/m²)</label>
              <input className="input-field" value={form.xrfZrSi} onChange={e => update('xrfZrSi', e.target.value)} />
            </div>
            <div>
              <label className="label">XRF 合金模式 (%)</label>
              <input className="input-field" value={form.xrfAlloy} onChange={e => update('xrfAlloy', e.target.value)} />
            </div>
            <div>
              <label className="label">P比 (%)</label>
              <input className="input-field" value={form.pRatio} onChange={e => update('pRatio', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {[
              ['crystalImage', '晶像图片'], ['impactImage', '抗冲击图片'],
              ['saltSpray450h', '盐雾450h外观'], ['saltSpray720h', '盐雾720h外观'],
              ['saltSpray1000h', '盐雾1000h外观'], ['corrosionImage', '腐蚀外观'],
              ['adhesion1000h', '1000h附着力'],
            ].map(([key, label]) => (
              <div key={key as string}>
                <label className="label">{label as string}</label>
                <input className="input-field" value={form[key as keyof typeof form] as string}
                  onChange={e => update(key as string, e.target.value)} placeholder="图片路径或描述" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">电泳后外观</label>
              <input className="input-field" value={form.paintAppearance} onChange={e => update('paintAppearance', e.target.value)} />
            </div>
            <div>
              <label className="label">漆膜厚度 (μm)</label>
              <input className="input-field" value={form.paintThickness} onChange={e => update('paintThickness', e.target.value)} />
            </div>
            <div>
              <label className="label">腐蚀宽度 (mm)</label>
              <input className="input-field" value={form.corrosionWidth} onChange={e => update('corrosionWidth', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => router.back()} className="btn-secondary">取消</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary">
            {loading ? '保存中...' : '保存记录'}
          </button>
        </div>
      </div>
    </div>
  )
}
