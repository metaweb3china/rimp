'use client'

import { useState } from 'react'

const roleLabels: Record<string, string> = { ADMIN: '管理员', LEAD: '研发组长', RESEARCHER: '研发员' }
const roleColors: Record<string, string> = { ADMIN: 'bg-purple-100 text-purple-700', LEAD: 'bg-blue-100 text-blue-700', RESEARCHER: 'bg-green-100 text-green-700' }

export default function UserManager({ users, currentRole }: { users: any[]; currentRole: string }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', name: '', role: 'RESEARCHER' })
  const [error, setError] = useState('')

  const canCreate = currentRole === 'ADMIN'
  const canCreateLead = currentRole === 'ADMIN'
  const roleOptions = currentRole === 'ADMIN'
    ? [{ value: 'LEAD', label: '研发组长' }, { value: 'RESEARCHER', label: '研发员' }]
    : [{ value: 'RESEARCHER', label: '研发员' }]

  const handleSubmit = async () => {
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      window.location.reload()
    } else {
      setError(data.error || '创建失败')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">共 {users.length} 个用户</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '取消' : '+ 添加用户'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-slate-900">添加用户</h3>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">用户名 *</label>
              <input className="input-field" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
            </div>
            <div>
              <label className="label">姓名</label>
              <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">密码 *</label>
              <input className="input-field" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <div>
              <label className="label">角色</label>
              <select className="input-field" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {roleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={!form.username || !form.password} className="btn-primary">创建用户</button>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-left text-sm text-slate-500">
              <th className="px-6 py-3 font-medium">用户名</th>
              <th className="px-6 py-3 font-medium">姓名</th>
              <th className="px-6 py-3 font-medium">角色</th>
              <th className="px-6 py-3 font-medium">状态</th>
              <th className="px-6 py-3 font-medium">创建时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{u.username}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{u.name}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleColors[u.role]}`}>
                    {roleLabels[u.role]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.active ? '正常' : '禁用'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString('zh-CN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
