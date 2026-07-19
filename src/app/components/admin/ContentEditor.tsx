'use client'

import { useState } from 'react'

export default function ContentEditor() {
  const [section, setSection] = useState('hero')
  const [title, setTitle] = useState('Welcome')
  const [description, setDescription] = useState('Update this content from the admin dashboard.')

  async function handleSave() {
    await fetch(`/api/content/${section}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, title, description }),
    })
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
      <h2 className="text-xl font-semibold">Content editor</h2>
      <div className="mt-4 space-y-4">
        <input value={section} onChange={(event) => setSection(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100" placeholder="Section" />
        <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100" placeholder="Title" />
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100" placeholder="Description" />
        <button onClick={handleSave} className="rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">Save</button>
      </div>
    </div>
  )
}
