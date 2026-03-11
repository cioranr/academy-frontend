'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getEvents, deleteEvent } from '@/lib/api'
import type { BackendEvent } from '@/types'

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  published: { bg: '#d1fae5', text: '#065f46' },
  draft:     { bg: '#f3f4f6', text: '#6b7280' },
  cancelled: { bg: '#fde8e8', text: '#991b1b' },
}
const STATUS_RO: Record<string, string> = { published: 'Publicat', draft: 'Ciornă', cancelled: 'Anulat' }

export default function AdminEventsPage() {
  const [events, setEvents] = useState<BackendEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getEvents().then(setEvents).finally(() => setLoading(false)) }, [])

  const handleDelete = async (ev: BackendEvent) => {
    if (!confirm(`Ștergi evenimentul "${ev.title}"?`)) return
    await deleteEvent(ev.id)
    setEvents(prev => prev.filter(e => e.id !== ev.id))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontWeight: 300, fontSize: '1.8rem', color: '#000', margin: 0 }}>Evenimente</h1>
        <Link href="/admin/events/new" style={{ padding: '0.65rem 1.5rem', background: '#065EA6', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 400 }}>+ Eveniment nou</Link>
      </div>

      {loading ? <div style={{ color: '#6D6E71', fontWeight: 300 }}>Se încarcă...</div> : (
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Titlu', 'Data', 'Locație', 'Participanți', 'Status', 'Acțiuni'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 500, color: '#6D6E71', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((ev, i) => (
                <tr key={ev.id} style={{ borderBottom: i < events.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 400, fontSize: '0.9rem' }}>{ev.title}</div>
                    {ev.subtitle && <div style={{ fontSize: '0.75rem', color: '#6D6E71', fontWeight: 300, marginTop: '2px' }}>{ev.subtitle}</div>}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#374151', whiteSpace: 'nowrap' }}>{new Date(ev.date).toLocaleDateString('ro-RO')}</td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#374151' }}>{ev.venue || ev.location || '—'}</td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#374151', textAlign: 'center' }}>{ev.max_participants ?? '∞'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ ...STATUS_COLORS[ev.status], borderRadius: '20px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 500 }}>{STATUS_RO[ev.status]}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Link href={`/admin/events/${ev.id}`} style={{ padding: '0.35rem 0.75rem', background: '#ecffff', color: '#065EA6', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 400 }}>Editează</Link>
                      <Link href={`/admin/events/${ev.id}/registrations`} style={{ padding: '0.35rem 0.75rem', background: '#f3f4f6', color: '#374151', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 400 }}>Înscrieri</Link>
                      <button onClick={() => handleDelete(ev)} style={{ padding: '0.35rem 0.75rem', background: '#fde8e8', color: '#ED3224', borderRadius: '8px', border: 'none', fontSize: '0.8rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Șterge</button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#6D6E71', fontWeight: 300 }}>Nu există evenimente.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
