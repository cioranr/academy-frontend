'use client'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { getEvent, getEventFeedbackStats, exportEventFeedback } from '@/lib/api'
import type { FeedbackStats } from '@/lib/api'
import type { BackendEvent } from '@/types'

export default function EventFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [event, setEvent] = useState<BackendEvent | null>(null)
  const [stats, setStats] = useState<FeedbackStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'present' | 'completed' | 'pending' | 'diploma'>('all')

  useEffect(() => {
    Promise.all([
      getEvent(id),
      getEventFeedbackStats(Number(id)),
    ]).then(([ev, s]) => { setEvent(ev); setStats(s) }).finally(() => setLoading(false))
  }, [id])

  const handleExport = async () => {
    setExporting(true)
    try { await exportEventFeedback(Number(id)) } catch { alert('Eroare la export') } finally { setExporting(false) }
  }

  const filtered = stats?.participants.filter(p => {
    if (filter === 'present')  return p.is_present
    if (filter === 'completed') return p.feedback_completed
    if (filter === 'pending')  return p.feedback_sent_at && !p.feedback_completed
    if (filter === 'diploma')  return p.diploma_sent
    return true
  }) ?? []

  const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: '#6D6E71', marginTop: '0.25rem', fontWeight: 400 }}>{label}</div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link href={`/admin/events/${id}/registrations`} style={{ color: '#6D6E71', textDecoration: 'none', fontSize: '0.9rem' }}>← Înscrieri</Link>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#000', margin: 0, flex: 1 }}>Feedback: {event?.title || '...'}</h1>
        {stats?.event.send_feedback && stats.feedback_completed > 0 && (
          <button onClick={handleExport} disabled={exporting} style={{ padding: '0.4rem 0.9rem', borderRadius: '20px', border: '1px solid #d1d5db', cursor: exporting ? 'default' : 'pointer', fontFamily: '"Roboto",sans-serif', fontSize: '0.8rem', background: '#fff', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {exporting ? 'Se exportă...' : 'Export CSV'}
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ color: '#6D6E71', fontWeight: 300 }}>Se încarcă...</div>
      ) : !stats?.event.send_feedback ? (
        <div style={{ background: '#fff7ed', border: '1px solid #fbbf24', borderRadius: '12px', padding: '1.5rem', color: '#92400e' }}>
          Acest eveniment nu are activat formularul de feedback. Activați-l din secțiunea <Link href={`/admin/events/${id}`} style={{ color: '#065EA6' }}>Editare eveniment → tab Feedback</Link>.
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <StatCard label="Total participanți" value={stats.total} color="#374151" />
            <StatCard label="Prezenți" value={stats.present} color="#065EA6" />
            <StatCard label="Formular trimis" value={stats.feedback_sent} color="#7c3aed" />
            <StatCard label="Formular completat" value={stats.feedback_completed} color="#065f46" />
            <StatCard label="Formular neprimplins" value={stats.feedback_pending} color="#92400e" />
            <StatCard label="Diplomă trimisă" value={stats.diploma_sent} color="#1e40af" />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {([['all', 'Toți'], ['present', 'Prezenți'], ['completed', 'Au completat'], ['pending', 'Nu au completat'], ['diploma', 'Au primit diploma']] as const).map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)} style={{ padding: '0.4rem 0.9rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontSize: '0.8rem', fontWeight: filter === val ? 500 : 400, background: filter === val ? '#065EA6' : '#f3f4f6', color: filter === val ? '#fff' : '#374151' }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Participant', 'Email', 'Prezent', 'Formular trimis', 'Formular completat', 'Diplomă'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 500, color: '#6D6E71', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 400 }}>{p.first_name} {p.last_name}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#065EA6' }}><a href={`mailto:${p.email}`} style={{ color: '#065EA6', textDecoration: 'none' }}>{p.email}</a></td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {p.is_present
                        ? <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 500 }}>✓ {p.present_at ? new Date(p.present_at).toLocaleDateString('ro-RO') : 'Da'}</span>
                        : <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>—</span>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {p.feedback_sent_at
                        ? <span style={{ background: '#ede9fe', color: '#5b21b6', borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 500 }}>{new Date(p.feedback_sent_at).toLocaleDateString('ro-RO')}</span>
                        : <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>—</span>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {p.feedback_completed
                        ? <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 500 }}>✓ Completat</span>
                        : p.feedback_sent_at
                          ? <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 500 }}>În așteptare</span>
                          : <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>—</span>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {p.diploma_sent
                        ? <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 500 }}>✓ Trimisă</span>
                        : <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>—</span>}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#6D6E71', fontWeight: 300 }}>Niciun participant în această categorie.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
