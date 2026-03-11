'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getEvents, getUsers, getEventRegistrations } from '@/lib/api'
import type { BackendEvent, BackendUser } from '@/types'

export default function AdminPage() {
  const [events, setEvents] = useState<BackendEvent[]>([])
  const [users, setUsers] = useState<BackendUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getEvents(), getUsers()])
      .then(([evs, usrs]) => { setEvents(evs); setUsers(usrs) })
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Evenimente', value: events.length, sub: `${events.filter(e => e.status === 'published').length} publicate`, href: '/admin/events', color: '#065EA6' },
    { label: 'Utilizatori', value: users.length, sub: `${users.filter(u => u.role === 'participant').length} participanți`, href: '/admin/users', color: '#10b981' },
    { label: 'Medici', value: users.filter(u => u.role === 'doctor').length, sub: 'conturi de medici', href: '/admin/users', color: '#6366f1' },
    { label: 'Administratori', value: users.filter(u => u.role === 'admin' || u.role === 'events_manager').length, sub: 'cont admin/manager', href: '/admin/users', color: '#f59e0b' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontWeight: 300, fontSize: '1.8rem', color: '#000', margin: 0 }}>Sumar</h1>
        <Link href="/admin/events/new" style={{ padding: '0.65rem 1.5rem', background: '#065EA6', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 400 }}>+ Eveniment nou</Link>
      </div>

      {loading ? <div style={{ color: '#6D6E71', fontWeight: 300 }}>Se încarcă...</div> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {stats.map(s => (
              <Link key={s.label} href={s.href} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', textDecoration: 'none', display: 'block', borderLeft: `4px solid ${s.color}`, transition: 'box-shadow 0.2s' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: '#000', margin: '0.25rem 0 0.1rem' }}>{s.label}</div>
                <div style={{ fontSize: '0.8rem', color: '#6D6E71', fontWeight: 300 }}>{s.sub}</div>
              </Link>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Recent events */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ fontWeight: 500, fontSize: '1rem', margin: 0 }}>Evenimente recente</h2>
                <Link href="/admin/events" style={{ fontSize: '0.8rem', color: '#065EA6', textDecoration: 'none' }}>Toate →</Link>
              </div>
              {events.slice(0, 5).map(ev => (
                <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 400 }}>{ev.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6D6E71', fontWeight: 300 }}>{new Date(ev.date).toLocaleDateString('ro-RO')}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: ev.status === 'published' ? '#d1fae5' : '#f3f4f6', color: ev.status === 'published' ? '#065f46' : '#6D6E71', borderRadius: '20px', padding: '0.2rem 0.6rem' }}>{ev.status}</span>
                </div>
              ))}
            </div>

            {/* Recent users */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ fontWeight: 500, fontSize: '1rem', margin: 0 }}>Utilizatori recenți</h2>
                <Link href="/admin/users" style={{ fontSize: '0.8rem', color: '#065EA6', textDecoration: 'none' }}>Toți →</Link>
              </div>
              {users.slice(0, 5).map(u => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 400 }}>{u.first_name || ''} {u.last_name || u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6D6E71', fontWeight: 300 }}>{u.email}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: '#ecffff', color: '#065EA6', borderRadius: '20px', padding: '0.2rem 0.6rem' }}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
