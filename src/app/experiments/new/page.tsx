'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { boardTypes, processSteps, reactionOptions, blackAshOptions, ashColorOptions, filmAppearanceOptions } from '@/lib/constants'

export default function NewExperimentPage() {
  const router = useRouter()
  const [materials, setMaterials] = useState<{ id: number; name: string; unit: string }[]>([])
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: '', purpose: '', summary: '', equipment: '', board: '', process: '',
    records: [{ step: 'degreasing', temp: '', duration: '', method: '浸泡' }],
    materialIds: [] as number[],
  })

  useEffect(() => {
    fetch('/api/materials').then(r => r.json()).then(d => setMaterials(d))
  }, [])

  const addProcessStep = () => {
    const nextIdx = processSteps.findIndex((s, i) => i > form.records.length - 1 || !form.records[i])
    if (nextIdx < processSteps.length) {
      const step = processSteps[nextIdx]
      setForm(f => ({
        ...f,
        records: [...f.records, { step: step.key, temp: '', duration: '', method: step.options[0] || '' }],
      }))
    }
  }

  const updateRecord = (idx: number, field: string, value: string) => {
    setForm(f => {
      const records = [...f.records]
      records[idx] = { ...records[idx], [field]: value }
      return { ...f, records }
    })
  }

  const handleSubmit = async (status: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/experiments/${data.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">新建实验记录</h1>

      <div className="space-y-8">
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-slate-900 text-lg">基本信息</h2>
          <div>
            <label className="label">实验主题 *</label>
            <input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="请输入实验主题" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">处理板材</label>
              <select className="input-field" value={form.board} onChange={e => setForm(f => ({ ...f, board: e.target.value }))}>
                <option value="">请选择</option>
                {boardTypes.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="label">实验设备</label>
              <input className="input-field" value={form.equipment} onChange={e => setForm(f => ({ ...f, equipment: e.target.value }))} placeholder="实验设备" />
            </div>
          </div>
          <div>
            <label className="label">实验目的</label>
            <textarea className="input-field" rows={2} value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} placeholder="实验目的" />
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 text-lg">工艺流程图</h2>
            <button type="button" onClick={addProcessStep}
              className="text-sm text-blue-600 hover:text-blue-700">+ 添加工序</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {form.records.map((rec, i) => {
              const step = processSteps.find(s => s.key === rec.step)
              return (
                <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                  <span className="text-sm font-medium text-slate-700 min-w-[3rem]">{step?.label}</span>
                  <input className="input-field !w-20 !py-1.5 text-xs" placeholder="℃" value={rec.temp}
                    onChange={e => updateRecord(i, 'temp', e.target.value)} />
                  <input className="input-field !w-20 !py-1.5 text-xs" placeholder="min" value={rec.duration}
                    onChange={e => updateRecord(i, 'duration', e.target.value)} />
                  {step?.options.length ? (
                    <select className="input-field !w-24 !py-1.5 text-xs" value={rec.method}
                      onChange={e => updateRecord(i, 'method', e.target.value)}>
                      {step.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : null}
                  {i > 0 && <span className="text-slate-300 text-lg">→</span>}
                </div>
              )
            })}
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-slate-900 text-lg">实验材料</h2>
          <div className="flex flex-wrap gap-2">
            {materials.map(m => (
              <label key={m.id} className={`px-4 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                form.materialIds.includes(m.id) ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
                <input type="checkbox" className="hidden" checked={form.materialIds.includes(m.id)}
                  onChange={e => {
                    const ids = e.target.checked
                      ? [...form.materialIds, m.id]
                      : form.materialIds.filter(id => id !== m.id)
                    setForm(f => ({ ...f, materialIds: ids }))
                  }} />
                {m.name}
              </label>
            ))}
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-slate-900 text-lg">实验小结</h2>
          <textarea className="input-field" rows={4} value={form.summary}
            onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} placeholder="实验小结" />
        </div>

        <div className="flex gap-3">
          <button onClick={() => handleSubmit('draft')} disabled={loading || !form.title}
            className="btn-secondary">保存草稿</button>
          <button onClick={() => handleSubmit('completed')} disabled={loading || !form.title}
            className="btn-primary">提交完成</button>
        </div>
      </div>
    </div>
  )
}
