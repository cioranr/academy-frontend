'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getUsers, updateUserRole, deleteUser } from '@/lib/api'
import type { BackendUser } from '@/types'

const ROLES: BackendUser['role'][] = ['participant', 'doctor', 'events_manager', 'admin']
const ROLE_RO: Record<string, string> = { participant: 'Participant', doctor: 'Medic', events_manager: 'Manager', admin: 'Admin' }
const ROLE_COLORS: Record<string, string> = { participant: '#6D6E71', doctor: '#6366f1', events_manager: '#10b981', admin: '#065EA6' }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<BackendUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { getUsers().then(setUsers).finally(() => setLoading(false)) }, [])

  const handleRole = async (user: BackendUser, role: BackendUser['role']) => {
    const updated = await updateUserRole(user.id, role)
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
  }
  const handleDelete = async (user: BackendUser) => {
    if (!confirm(`Ștergi utilizatorul ${user.email}?`)) return
    await deleteUser(user.id); setUsers(prev => prev.filter(u => u.id !== user.id))
  }

  const filtered = users.filter(u => !search || u.email.includes(search) || u.name.toLowerCase().includes(search.toLowerCase()) || (u.first_name || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontWeight: 300, fontSize: '1.8rem', color: '#000', margin: 0 }}>Utilizatori ({users.length})</h1>
        <input style={{ padding: '0.6rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem', fontFamily: '"Roboto",sans-serif', outline: 'none', minWidth: '220px' }} placeholder="Caută după nume sau email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? <div style={{ color: '#6D6E71', fontWeight: 300 }}>Se încarcă...</div> : (
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Utilizator', 'Email', 'Telefon', 'Specialitate', 'Grad', 'Rol', 'Acțiuni'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 500, color: '#6D6E71', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 400, fontSize: '0.9rem' }}>{u.first_name || ''} {u.last_name || u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 300 }}>#{u.id}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}><a href={`mailto:${u.email}`} style={{ color: '#065EA6', textDecoration: 'none' }}>{u.email}</a></td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#374151' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#374151' }}>{u.specialty || '—'}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#374151' }}>{u.professional_grade || '—'}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <select value={u.role} onChange={e => handleRole(u, e.target.value as BackendUser['role'])} style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '0.8rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', color: ROLE_COLORS[u.role], fontWeight: 500, background: '#fff' }}>
                      {ROLES.map(r => <option key={r} value={r}>{ROLE_RO[r]}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <Link href={`/admin/users/${u.id}`} style={{ padding: '0.3rem 0.65rem', background: '#ecffff', color: '#065EA6', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 400 }}>Detalii</Link>
                      <button onClick={() => handleDelete(u)} style={{ padding: '0.3rem 0.65rem', background: '#fde8e8', color: '#ED3224', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Șterge</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#6D6E71', fontWeight: 300 }}>Niciun utilizator găsit.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
