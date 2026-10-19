'use client'
import { useEffect, useState } from 'react'
import { getSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } from '@/lib/api'
import type { Specialty } from '@/types'

const inp = { padding: '0.65rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem', background: '#fff', fontFamily: '"Roboto",sans-serif', color: '#000', width: '100%', outline: 'none' }
const btn = { padding: '0.55rem 1rem', borderRadius: '8px', border: 'none', fontSize: '0.8rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }
const th = { padding: '0.75rem 1rem', textAlign: 'left' as const, fontSize: '0.75rem', fontWeight: 500, color: '#6D6E71', textTransform: 'uppercase' as const, letterSpacing: '0.04em' }
const td = { padding: '0.65rem 1rem', fontSize: '0.85rem', color: '#374151' }

// Values the registration forms rely on (CUIM rule, "other" option).
const PROTECTED = ['rezidenti', 'alta']

const sortList = (l: Specialty[]) => [...l].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, 'ro'))

export default function SpecialtiesAdminPage() {
  const [list, setList]         = useState<Specialty[]>([])
  const [loading, setLoading]   = useState(true)
  const [newLabel, setNewLabel] = useState('')
  const [editId, setEditId]     = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ label: '', order: 0 })
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    getSpecialties().then(setList).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLabel.trim()) return
    setSaving(true); setError('')
    try {
      const s = await createSpecialty({ label: newLabel.trim() })
      setList(l => sortList([...l, s]))
      setNewLabel('')
    } catch (e) { setError((e as Error).message) } finally { setSaving(false) }
  }

  const startEdit = (s: Specialty) => { setEditId(s.id); setEditForm({ label: s.label, order: s.order }); setError('') }

  const handleSave = async () => {
    if (editId === null || !editForm.label.trim()) return
    setSaving(true); setError('')
    try {
      const s = await updateSpecialty(editId, { label: editForm.label.trim(), order: Number(editForm.order) || 0 })
      setList(l => sortList(l.map(x => x.id === s.id ? s : x)))
      setEditId(null)
    } catch (e) { setError((e as Error).message) } finally { setSaving(false) }
  }

  const handleDelete = async (s: Specialty) => {
    if (!confirm(`Ștergi specialitatea „${s.label}”?`)) return
    setError('')
    try {
      await deleteSpecialty(s.id)
      setList(l => l.filter(x => x.id !== s.id))
    } catch (e) { setError((e as Error).message) }
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 300, color: '#000', margin: '0 0 0.5rem' }}>Specialități</h1>
      <p style={{ fontSize: '0.85rem', color: '#6D6E71', fontWeight: 300, margin: '0 0 1.5rem' }}>
        Opțiunile din lista „Specialitate” a formularelor de înscriere și înregistrare, afișate în ordinea crescătoare a câmpului „Ordine”.
      </p>

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input style={inp} placeholder="Specialitate nouă (ex. Neurologie)" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
        <button type="submit" disabled={saving || !newLabel.trim()} style={{ ...btn, background: '#065EA6', color: '#fff', whiteSpace: 'nowrap', opacity: saving || !newLabel.trim() ? 0.6 : 1 }}>Adaugă</button>
      </form>

      {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '0 0 1rem', whiteSpace: 'pre-line' }}>{error}</p>}

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={th}>Denumire</th>
              <th style={th}>Cod</th>
              <th style={{ ...th, width: '100px' }}>Ordine</th>
              <th style={{ ...th, textAlign: 'right', width: '180px' }}>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ ...td, textAlign: 'center', color: '#6D6E71' }}>Se încarcă...</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={4} style={{ ...td, textAlign: 'center', color: '#6D6E71' }}>Nicio specialitate.</td></tr>
            ) : list.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                {editId === s.id ? (
                  <>
                    <td style={td}><input style={inp} value={editForm.label} onChange={e => setEditForm(p => ({ ...p, label: e.target.value }))} /></td>
                    <td style={{ ...td, color: '#6D6E71' }}>{s.value}</td>
                    <td style={td}><input type="number" min={0} style={inp} value={editForm.order} onChange={e => setEditForm(p => ({ ...p, order: Number(e.target.value) }))} /></td>
                    <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button onClick={handleSave} disabled={saving} style={{ ...btn, background: '#065EA6', color: '#fff', marginRight: '0.5rem' }}>Salvează</button>
                      <button onClick={() => setEditId(null)} style={{ ...btn, background: '#f3f4f6', color: '#374151' }}>Anulează</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={td}>{s.label}</td>
                    <td style={{ ...td, color: '#6D6E71' }}>{s.value}</td>
                    <td style={td}>{s.order}</td>
                    <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button onClick={() => startEdit(s)} style={{ ...btn, background: '#ecffff', color: '#065EA6', marginRight: '0.5rem' }}>Editează</button>
                      {!PROTECTED.includes(s.value) && (
                        <button onClick={() => handleDelete(s)} style={{ ...btn, background: '#fde8e8', color: '#ED3224' }}>Șterge</button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
