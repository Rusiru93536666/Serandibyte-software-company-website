'use client'

import { FormEvent, useState } from 'react'

export default function LoginForm() {
  const [email, setEmail] = useState('admin@serandibyte.com')
  const [password, setPassword] = useState('admin123')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    setMessage(data.message || 'Login attempt complete')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
      <div>
        <label className="mb-2 block text-sm text-slate-300">Email</label>
        <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100" />
      </div>
      <div>
        <label className="mb-2 block text-sm text-slate-300">Password</label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100" />
      </div>
      <button className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">Login</button>
      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
    </form>
  )
}
