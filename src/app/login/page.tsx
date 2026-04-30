'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/dashboard')
      } else {
        setError(data.error || '登录失败')
      }
    } catch {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <span className="text-3xl">🔬</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">材料保护电子实验记录本</h1>
          <p className="text-sm text-slate-500 mt-1">请登录后使用</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
          )}

          <div>
            <label className="label">用户名</label>
            <input className="input-field" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="请输入用户名" required />
          </div>

          <div>
            <label className="label">密码</label>
            <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="请输入密码" required />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? '登录中...' : '登 录'}
          </button>
        </form>
      </div>
    </div>
  )
}
