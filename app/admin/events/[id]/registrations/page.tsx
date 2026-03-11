'use client'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { getEvent, getEventRegistrations, updateRegistrationStatus, deleteRegistration } from '@/lib/api'
import type { BackendEvent, EventRegistration } from '@/types'

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:   { bg: '#fef3c7', text: '#92400e' },
  approved:  { bg: '#d1fae5', text: '#065f46' },
  rejected:  { bg: '#fde8e8', text: '#991b1b' },
  cancelled: { bg: '#f3f4f6', text: '#6b7280' },
}
const STATUS_RO: Record<string, string> = { pending: 'În așteptare', approved: 'Aprobat', rejected: 'Respins', cancelled: 'Anulat' }

export default function EventRegistrationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [event, setEvent] = useState<BackendEvent | null>(null)
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    getEvent(id).then(ev => {
      setEvent(ev)
      return getEventRegistrations(ev.slug)
    }).then(setRegistrations).finally(() => setLoading(false))
  }, [id])

  const handleStatus = async (reg: EventRegistration, status: EventRegistration['status']) => {
    const updated = await updateRegistrationStatus(reg.id, status)
    setRegistrations(prev => prev.map(r => r.id === updated.id ? updated : r))
  }

  const handleDelete = async (reg: EventRegistration) => {
    if (!confirm(`Ștergi definitiv înregistrarea lui ${reg.first_name} ${reg.last_name}? Această acțiune nu poate fi anulată.`)) return
    await deleteRegistration(reg.id)
    setRegistrations(prev => prev.filter(r => r.id !== reg.id))
  }

  const filtered = filter === 'all' ? registrations : registrations.filter(r => r.status === filter)
  const counts = { all: registrations.length, pending: registrations.filter(r => r.status === 'pending').length, approved: registrations.filter(r => r.status === 'approved').length }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link href="/admin/events" style={{ color: '#6D6E71', textDecoration: 'none', fontSize: '0.9rem' }}>← Înapoi</Link>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#000', margin: 0, flex: 1 }}>Înscrieri: {event?.title || '...'}</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[['all', 'Toate'], ['pending', 'În așteptare'], ['approved', 'Aprobate']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} style={{ padding: '0.4rem 0.9rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontSize: '0.8rem', fontWeight: filter === val ? 500 : 400, background: filter === val ? '#065EA6' : '#f3f4f6', color: filter === val ? '#fff' : '#374151' }}>
              {label} ({counts[val as keyof typeof counts] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {loading ? <div style={{ color: '#6D6E71', fontWeight: 300 }}>Se încarcă...</div> : (
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Nume', 'Email', 'Telefon', 'Specialitate', 'Grad', 'Status', 'Data', 'Acțiuni'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 500, color: '#6D6E71', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg, i) => (
                <tr key={reg.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 400 }}>{reg.first_name} {reg.last_name}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#065EA6' }}><a href={`mailto:${reg.email}`} style={{ color: '#065EA6', textDecoration: 'none' }}>{reg.email}</a></td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#374151' }}>{reg.phone || '—'}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#374151' }}>{reg.specialty || '—'}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#374151' }}>{reg.professional_grade || '—'}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ ...STATUS_COLORS[reg.status], borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 500 }}>{STATUS_RO[reg.status]}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#6D6E71', whiteSpace: 'nowrap' }}>{new Date(reg.registered_at).toLocaleDateString('ro-RO')}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {reg.status !== 'approved' && <button onClick={() => handleStatus(reg, 'approved')} style={{ padding: '0.3rem 0.6rem', background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Aprobă</button>}
                      {reg.status !== 'rejected' && <button onClick={() => handleStatus(reg, 'rejected')} style={{ padding: '0.3rem 0.6rem', background: '#fde8e8', color: '#991b1b', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Respinge</button>}
                      <button onClick={() => handleDelete(reg)} style={{ padding: '0.3rem 0.6rem', background: '#1f2937', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Șterge</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#6D6E71', fontWeight: 300 }}>Nicio înscriere.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
