'use client'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { getEvent, getEventRegistrations, updateRegistrationStatus, deleteRegistration, generateDiploma, downloadDegree, markPresent } from '@/lib/api'
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

  const [diplomaBusy, setDiplomaBusy] = useState<number | null>(null)
  const handleGenerateDiploma = async (reg: EventRegistration) => {
    if (!reg.user_id) { alert('Înregistrarea nu este asociată unui cont de utilizator.'); return }
    setDiplomaBusy(reg.id)
    try {
      const deg = await generateDiploma(reg.id)
      await downloadDegree(deg.id, deg.file_name)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Eroare la generarea diplomei')
    } finally { setDiplomaBusy(null) }
  }

  const [presentBusy, setPresentBusy] = useState<number | null>(null)
  const handleMarkPresent = async (reg: EventRegistration) => {
    if (reg.is_present) return
    if (!confirm('Ești sigur că vrei să confirmi prezența acestui participant?')) return
    setPresentBusy(reg.id)
    try {
      const updated = await markPresent(reg.id)
      setRegistrations(prev => prev.map(r => r.id === updated.id ? updated : r))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Eroare la confirmarea prezenței')
    } finally { setPresentBusy(null) }
  }

  const filtered = filter === 'all' ? registrations : registrations.filter(r => r.status === filter)
  const counts = { all: registrations.length, pending: registrations.filter(r => r.status === 'pending').length, approved: registrations.filter(r => r.status === 'approved').length }

  const exportCsv = () => {
    const headers = ['Nume', 'Prenume', 'Email', 'Telefon', 'Specialitate', 'Grad profesional', 'CUIM', 'Status', 'Mesaj', 'Data înscrierii']
    const rows = filtered.map(r => [
      r.last_name, r.first_name, r.email, r.phone || '', r.specialty || '',
      r.professional_grade || '', r.cuim || '', STATUS_RO[r.status],
      (r.message || '').replace(/"/g, '""'),
      new Date(r.registered_at).toLocaleDateString('ro-RO'),
    ])
    const csv = 'sep=;\r\n' + [headers, ...rows].map(row => row.map(v => `"${v}"`).join(';')).join('\r\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inscrieri-${event?.slug || id}${filter !== 'all' ? `-${filter}` : ''}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link href="/admin/events" style={{ color: '#6D6E71', textDecoration: 'none', fontSize: '0.9rem' }}>← Înapoi</Link>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#000', margin: 0, flex: 1 }}>Înscrieri: {event?.title || '...'}</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {[['all', 'Toate'], ['pending', 'În așteptare'], ['approved', 'Aprobate']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} style={{ padding: '0.4rem 0.9rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontSize: '0.8rem', fontWeight: filter === val ? 500 : 400, background: filter === val ? '#065EA6' : '#f3f4f6', color: filter === val ? '#fff' : '#374151' }}>
              {label} ({counts[val as keyof typeof counts] ?? 0})
            </button>
          ))}
          <Link href={`/admin/events/${id}/feedback`} style={{ padding: '0.4rem 0.9rem', borderRadius: '20px', border: '1px solid #065EA6', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontSize: '0.8rem', fontWeight: 400, background: '#ecffff', color: '#065EA6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            Feedback
          </Link>
          <button onClick={exportCsv} disabled={filtered.length === 0} style={{ padding: '0.4rem 0.9rem', borderRadius: '20px', border: '1px solid #d1d5db', cursor: filtered.length === 0 ? 'default' : 'pointer', fontFamily: '"Roboto",sans-serif', fontSize: '0.8rem', fontWeight: 400, background: '#fff', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      {loading ? <div style={{ color: '#6D6E71', fontWeight: 300 }}>Se încarcă...</div> : (
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Nume', 'Email', 'Telefon', 'Specialitate', 'Grad', 'CUIM', 'Status', 'Data', 'Acțiuni'].map(h => (
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
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#374151' }}>{reg.cuim || '—'}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ ...STATUS_COLORS[reg.status], borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 500 }}>{STATUS_RO[reg.status]}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#6D6E71', whiteSpace: 'nowrap' }}>{new Date(reg.registered_at).toLocaleDateString('ro-RO')}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleMarkPresent(reg)}
                        disabled={reg.is_present || presentBusy === reg.id}
                        title={reg.is_present ? `Prezent la ${reg.present_at ? new Date(reg.present_at).toLocaleDateString('ro-RO') : ''}` : 'Marchează prezent'}
                        style={{ padding: '0.3rem 0.6rem', background: reg.is_present ? '#d1fae5' : '#fff7ed', color: reg.is_present ? '#065f46' : '#92400e', border: `1px solid ${reg.is_present ? '#6ee7b7' : '#fbbf24'}`, borderRadius: '6px', fontSize: '0.75rem', cursor: reg.is_present || presentBusy === reg.id ? 'default' : 'pointer', fontFamily: '"Roboto",sans-serif', opacity: presentBusy === reg.id ? 0.6 : 1, fontWeight: 500 }}>
                        {reg.is_present ? '✓ Prezent' : presentBusy === reg.id ? '...' : 'Prezent'}
                      </button>
                      {reg.status !== 'approved' && <button onClick={() => handleStatus(reg, 'approved')} style={{ padding: '0.3rem 0.6rem', background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Aprobă</button>}
                      {reg.status !== 'rejected' && <button onClick={() => handleStatus(reg, 'rejected')} style={{ padding: '0.3rem 0.6rem', background: '#fde8e8', color: '#991b1b', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Respinge</button>}
                      <button onClick={() => handleGenerateDiploma(reg)} disabled={diplomaBusy === reg.id} style={{ padding: '0.3rem 0.6rem', background: '#ecffff', color: '#065EA6', border: '1px solid #065EA6', borderRadius: '6px', fontSize: '0.75rem', cursor: diplomaBusy === reg.id ? 'default' : 'pointer', fontFamily: '"Roboto",sans-serif', opacity: diplomaBusy === reg.id ? 0.6 : 1 }}>
                        {diplomaBusy === reg.id ? 'Se generează...' : 'Diplomă'}
                      </button>
                      <button onClick={() => handleDelete(reg)} style={{ padding: '0.3rem 0.6rem', background: '#1f2937', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Șterge</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: '#6D6E71', fontWeight: 300 }}>Nicio înscriere.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
