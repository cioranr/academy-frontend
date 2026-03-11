'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { getMyRegistrations, getUserDegrees, downloadDegree, updateProfile } from '@/lib/api'
import type { EventRegistration, Degree } from '@/types'

const ROLE_LABELS: Record<string, string> = { participant: 'Participant', doctor: 'Medic', admin: 'Administrator', events_manager: 'Manager Evenimente' }
const STATUS_COLORS: Record<string, string> = { pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444', cancelled: '#6b7280' }
const STATUS_LABELS: Record<string, string> = { pending: 'În așteptare', approved: 'Aprobat', rejected: 'Respins', cancelled: 'Anulat' }

const inp = { width: '100%', padding: '0.65rem 1rem', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', background: '#fff', fontFamily: '"Roboto",sans-serif', color: '#000', outline: 'none' }

export default function DashboardPage() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [degrees, setDegrees] = useState<Degree[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [activeTab, setActiveTab] = useState<'events' | 'degrees' | 'profile'>('events')
  const [profileForm, setProfileForm] = useState({ first_name: '', last_name: '', phone: '', specialty: '', professional_grade: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    if (user) setProfileForm({
      first_name:         user.first_name         || '',
      last_name:          user.last_name           || '',
      phone:              user.phone               || '',
      specialty:          user.specialty           || '',
      professional_grade: user.professional_grade  || '',
    })
  }, [user])

  const handleSaveProfile = async () => {
    setSavingProfile(true); setProfileError(''); setProfileSaved(false)
    try {
      await updateProfile(profileForm)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : 'Eroare la salvare')
    } finally { setSavingProfile(false) }
  }

  useEffect(() => {
    if (!user) return
    Promise.all([getMyRegistrations(), getUserDegrees(user.id)])
      .then(([regs, degs]) => { setRegistrations(regs); setDegrees(degs) })
      .finally(() => setLoadingData(false))
  }, [user])

  const tabStyle = (tab: string) => ({
    padding: '0.6rem 1.5rem', borderRadius: '20px', border: 'none', cursor: 'pointer',
    fontFamily: '"Roboto",sans-serif', fontWeight: 400, fontSize: '0.9rem', transition: 'all 0.2s',
    background: activeTab === tab ? '#065EA6' : 'transparent',
    color: activeTab === tab ? '#fff' : '#6D6E71',
  })

  return (
    <main style={{ background: '#ecffff', minHeight: '100vh', fontFamily: '"Roboto",sans-serif', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 15px rgba(6,94,166,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontWeight: 300, fontSize: '1.8rem', color: '#065EA6', margin: '0 0 0.25rem' }}>Bun venit, {user?.first_name || user?.name}!</h1>
              <span style={{ display: 'inline-block', background: '#ecffff', color: '#065EA6', borderRadius: '20px', padding: '0.25rem 0.75rem', fontSize: '0.8rem', fontWeight: 400 }}>
                {ROLE_LABELS[user?.role || 'participant']}
              </span>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#6D6E71', fontWeight: 300 }}>{user?.email}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/calendar" style={{ padding: '0.6rem 1.5rem', background: '#065EA6', color: '#fff', borderRadius: '20px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 300 }}>
                Evenimente
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button style={tabStyle('events')} onClick={() => setActiveTab('events')}>
            Înregistrările mele ({registrations.length})
          </button>
          <button style={tabStyle('degrees')} onClick={() => setActiveTab('degrees')}>
            Diplomele mele ({degrees.length})
          </button>
          <button style={tabStyle('profile')} onClick={() => setActiveTab('profile')}>
            Profilul meu
          </button>
        </div>

        {activeTab === 'profile' ? (
          <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', boxShadow: '0 2px 15px rgba(6,94,166,0.08)', maxWidth: '560px' }}>
            <h2 style={{ fontWeight: 400, fontSize: '1.1rem', color: '#000', margin: '0 0 1.5rem' }}>Datele mele</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Prenume</label>
                  <input style={inp} value={profileForm.first_name} onChange={e => setProfileForm(p => ({ ...p, first_name: e.target.value }))} placeholder="Prenume" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nume</label>
                  <input style={inp} value={profileForm.last_name} onChange={e => setProfileForm(p => ({ ...p, last_name: e.target.value }))} placeholder="Nume" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</label>
                <input style={{ ...inp, background: '#f8fafc', color: '#6D6E71' }} value={user?.email || ''} disabled />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Telefon</label>
                <input style={inp} value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+40 7xx xxx xxx" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Grad profesional</label>
                <select style={{ ...inp, cursor: 'pointer' }} value={profileForm.professional_grade} onChange={e => setProfileForm(p => ({ ...p, professional_grade: e.target.value }))}>
                  <option value="">—</option>
                  <option value="medic-primar">Medic primar</option>
                  <option value="medic-specialist">Medic specialist</option>
                  <option value="medic-rezident">Medic rezident</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Specialitate</label>
                <select style={{ ...inp, cursor: 'pointer' }} value={profileForm.specialty} onChange={e => setProfileForm(p => ({ ...p, specialty: e.target.value }))}>
                  <option value="">—</option>
                  <option value="cardiologie">Cardiologie</option>
                  <option value="chirurgie">Chirurgie cardiovasculară</option>
                  <option value="rezidenti">Rezidenți</option>
                  <option value="alta">Altă specialitate</option>
                </select>
              </div>
              {profileError && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>{profileError}</p>}
              {profileSaved && <p style={{ color: '#10b981', fontSize: '0.85rem', margin: 0 }}>Datele au fost salvate cu succes.</p>}
              <button onClick={handleSaveProfile} disabled={savingProfile} style={{ alignSelf: 'flex-start', padding: '0.65rem 2rem', background: '#065EA6', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '0.9rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontWeight: 300, opacity: savingProfile ? 0.7 : 1 }}>
                {savingProfile ? 'Se salvează...' : 'Salvează modificările'}
              </button>
            </div>
          </div>
        ) : loadingData ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6D6E71', fontWeight: 300 }}>Se încarcă...</div>
        ) : activeTab === 'events' ? (
          <div>
            {registrations.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 2px 15px rgba(6,94,166,0.08)' }}>
                <p style={{ color: '#6D6E71', fontWeight: 300, marginBottom: '1rem' }}>Nu ești înregistrat la niciun eveniment.</p>
                <Link href="/calendar" style={{ padding: '0.6rem 1.5rem', background: '#065EA6', color: '#fff', borderRadius: '20px', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Vezi evenimentele disponibile
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {registrations.map(reg => (
                  <div key={reg.id} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 15px rgba(6,94,166,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontWeight: 400, fontSize: '1rem', color: '#000', margin: '0 0 0.25rem' }}>{reg.event?.title || `Eveniment #${reg.event_id}`}</h3>
                      {reg.event?.date && <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: '#6D6E71', fontWeight: 300 }}>{new Date(reg.event.date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                      {reg.event?.location && <p style={{ margin: 0, fontSize: '0.85rem', color: '#6D6E71', fontWeight: 300 }}>{reg.event.location}{reg.event.venue ? ` — ${reg.event.venue}` : ''}</p>}
                    </div>
                    <span style={{ background: STATUS_COLORS[reg.status] + '20', color: STATUS_COLORS[reg.status], borderRadius: '20px', padding: '0.3rem 0.85rem', fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {STATUS_LABELS[reg.status]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {degrees.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 2px 15px rgba(6,94,166,0.08)' }}>
                <p style={{ color: '#6D6E71', fontWeight: 300 }}>Nu ai primit nicio diplomă/certificat încă.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {degrees.map(deg => (
                  <div key={deg.id} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 15px rgba(6,94,166,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ width: '44px', height: '44px', background: '#ecffff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#065EA6" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontWeight: 400, fontSize: '0.95rem', color: '#000', margin: '0 0 0.25rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{deg.title}</h3>
                        {deg.event && <p style={{ margin: 0, fontSize: '0.8rem', color: '#6D6E71', fontWeight: 300 }}>{deg.event.title}</p>}
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 300 }}>{new Date(deg.created_at).toLocaleDateString('ro-RO')}</p>
                      </div>
                    </div>
                    <button onClick={() => downloadDegree(deg.id, deg.file_name)} style={{ width: '100%', background: '#065EA6', border: 'none', borderRadius: '12px', color: '#fff', padding: '0.6rem', fontSize: '0.85rem', fontWeight: 300, cursor: 'pointer', fontFamily: '"Roboto",sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Descarcă PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
