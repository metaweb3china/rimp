'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewMaterialPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', unit: 'g/L', specs: '', remark: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name) return
    setLoading(true)
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) router.push('/materials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">添加原材料</h1>

      <div className="card p-6 space-y-4">
        <div>
          <label className="label">原材料名称 *</label>
          <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="如：硝酸镍" />
        </div>
        <div>
          <label className="label">单位</label>
          <input className="input-field" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
        </div>
        <div>
          <label className="label">规格/浓度</label>
          <input className="input-field" value={form.specs} onChange={e => setForm(f => ({ ...f, specs: e.target.value }))} placeholder="如：98%" />
        </div>
        <div>
          <label className="label">备注</label>
          <input className="input-field" value={form.remark} onChange={e => setForm(f => ({ ...f, remark: e.target.value }))} placeholder="备注信息" />
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={() => router.back()} className="btn-secondary">取消</button>
          <button onClick={handleSubmit} disabled={loading || !form.name} className="btn-primary">保存</button>
        </div>
      </div>
    </div>
  )
}
