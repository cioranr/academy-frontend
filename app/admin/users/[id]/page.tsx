'use client'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { getUser, getUserDegrees, uploadDegree, deleteDegree, downloadDegree, getEvents } from '@/lib/api'
import type { BackendUser, Degree, BackendEvent } from '@/types'

const ROLE_RO: Record<string, string> = { participant: 'Participant', doctor: 'Medic', events_manager: 'Manager', admin: 'Admin' }

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [user, setUser] = useState<BackendUser | null>(null)
  const [degrees, setDegrees] = useState<Degree[]>([])
  const [events, setEvents] = useState<BackendEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [degreeForm, setDegreeForm] = useState({ title: '', event_id: '', file: null as File | null })
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    Promise.all([getUser(Number(id)), getUserDegrees(Number(id)), getEvents()])
      .then(([u, degs, evs]) => { setUser(u); setDegrees(degs); setEvents(evs) })
      .finally(() => setLoading(false))
  }, [id])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault(); setUploadError('')
    if (!degreeForm.file || !degreeForm.title) { setUploadError('Titlul și fișierul sunt obligatorii'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('title', degreeForm.title)
      fd.append('file', degreeForm.file)
      if (degreeForm.event_id) fd.append('event_id', degreeForm.event_id)
      const deg = await uploadDegree(Number(id), fd)
      setDegrees(prev => [deg, ...prev])
      setDegreeForm({ title: '', event_id: '', file: null })
      const fi = document.getElementById('degree-file') as HTMLInputElement; if (fi) fi.value = ''
    } catch (err: unknown) { setUploadError(err instanceof Error ? err.message : 'Eroare la upload') } finally { setUploading(false) }
  }

  const handleDeleteDegree = async (deg: Degree) => {
    if (!confirm(`Ștergi diploma "${deg.title}"?`)) return
    await deleteDegree(deg.id); setDegrees(prev => prev.filter(d => d.id !== deg.id))
  }

  const inp = { padding: '0.65rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem', background: '#fff', fontFamily: '"Roboto",sans-serif', color: '#000', width: '100%', outline: 'none' }

  if (loading) return <div style={{ color: '#6D6E71', fontWeight: 300 }}>Se încarcă...</div>
  if (!user) return <div style={{ color: '#ED3224' }}>Utilizatorul nu a fost găsit.</div>

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/users" style={{ color: '#6D6E71', textDecoration: 'none', fontSize: '0.9rem' }}>← Înapoi</Link>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#000', margin: 0 }}>{user.first_name || ''} {user.last_name || user.name}</h1>
        <span style={{ background: '#ecffff', color: '#065EA6', borderRadius: '20px', padding: '0.25rem 0.75rem', fontSize: '0.8rem', fontWeight: 400 }}>{ROLE_RO[user.role]}</span>
      </div>

      {/* User info */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 500, fontSize: '1rem', margin: '0 0 1rem' }}>Informații cont</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 2rem' }}>
          {[['Email', user.email], ['Telefon', user.phone || '—'], ['Specialitate', user.specialty || '—'], ['Grad profesional', user.professional_grade || '—'], ['Înregistrat', new Date(user.created_at).toLocaleDateString('ro-RO')], ['Email verificat', user.email_verified_at ? 'Da' : 'Nu']].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6D6E71', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>{label}</div>
              <div style={{ fontSize: '0.9rem', color: '#000', fontWeight: 300 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload degree */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 500, fontSize: '1rem', margin: '0 0 1rem' }}>Încarcă diplomă / certificat</h2>
        {uploadError && <div style={{ background: '#fde8e8', color: '#c53030', borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>{uploadError}</div>}
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div><input style={inp} placeholder="Titlul diplomei *" value={degreeForm.title} onChange={e => setDegreeForm(p => ({ ...p, title: e.target.value }))} /></div>
          <div>
            <select style={{ ...inp, cursor: 'pointer' }} value={degreeForm.event_id} onChange={e => setDegreeForm(p => ({ ...p, event_id: e.target.value }))}>
              <option value="">Eveniment asociat (opțional)</option>
              {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title} — {new Date(ev.date).toLocaleDateString('ro-RO')}</option>)}
            </select>
          </div>
          <div>
            <input id="degree-file" type="file" accept=".pdf" style={{ ...inp, padding: '0.5rem', cursor: 'pointer' }} onChange={e => setDegreeForm(p => ({ ...p, file: e.target.files?.[0] || null }))} />
            <div style={{ fontSize: '0.75rem', color: '#6D6E71', marginTop: '0.25rem', fontWeight: 300 }}>Doar fișiere PDF, max. 10MB</div>
          </div>
          <button type="submit" disabled={uploading} style={{ alignSelf: 'flex-start', padding: '0.6rem 1.5rem', background: '#065EA6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', opacity: uploading ? 0.7 : 1 }}>
            {uploading ? 'Se încarcă...' : 'Încarcă diploma'}
          </button>
        </form>
      </div>

      {/* Degrees list */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontWeight: 500, fontSize: '1rem', margin: '0 0 1rem' }}>Diplome ({degrees.length})</h2>
        {degrees.length === 0 ? (
          <p style={{ color: '#6D6E71', fontWeight: 300, fontSize: '0.9rem' }}>Nicio diplomă încărcată.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {degrees.map(deg => (
              <div key={deg.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#065EA6" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 400, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deg.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6D6E71', fontWeight: 300 }}>
                    {deg.event?.title || 'Fără eveniment'} · {new Date(deg.created_at).toLocaleDateString('ro-RO')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => downloadDegree(deg.id, deg.file_name)} style={{ padding: '0.35rem 0.65rem', background: '#ecffff', color: '#065EA6', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Descarcă</button>
                  <button onClick={() => handleDeleteDegree(deg)} style={{ padding: '0.35rem 0.65rem', background: '#fde8e8', color: '#ED3224', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Șterge</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
