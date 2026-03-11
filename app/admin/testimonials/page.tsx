'use client'
import { useEffect, useState } from 'react'
import { getTestimonials, createTestimonial, updateTestimonial, uploadTestimonialImage, deleteTestimonial } from '@/lib/api'
import { storageUrl } from '@/lib/api'
import type { BackendTestimonial } from '@/types'

const inp = { padding: '0.65rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem', background: '#fff', fontFamily: '"Roboto",sans-serif', color: '#000', width: '100%', outline: 'none' }
const Label = ({ children }: { children: React.ReactNode }) => <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{children}</label>

const EMPTY = { subtitle: '', doctor_name: '', quote: '', workshop_title: '', workshop_href: '', active: true, order: 0 }

export default function TestimonialsAdminPage() {
  const [list, setList]           = useState<BackendTestimonial[]>([])
  const [editing, setEditing]     = useState<BackendTestimonial | null>(null)
  const [form, setForm]           = useState<Partial<BackendTestimonial>>(EMPTY)
  const [creating, setCreating]   = useState(false)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { getTestimonials().then(setList) }, [])

  const set = (k: keyof BackendTestimonial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const handleCreate = async () => {
    if (!form.doctor_name || !form.quote) return
    setSaving(true)
    try {
      const t = await createTestimonial(form)
      setList(l => [...l, t])
      setCreating(false)
      // Switch immediately to edit so image upload is available
      openEdit(t)
    } catch { alert('Eroare la creare') } finally { setSaving(false) }
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const t = await updateTestimonial(editing.id, form)
      setList(l => l.map(x => x.id === t.id ? t : x))
      setEditing(t)
    } catch { alert('Eroare la salvare') } finally { setSaving(false) }
  }

  const handleToggleActive = async (t: BackendTestimonial) => {
    const updated = await updateTestimonial(t.id, { active: !t.active })
    setList(l => l.map(x => x.id === updated.id ? updated : x))
    if (editing?.id === updated.id) setEditing(updated)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const url = await uploadTestimonialImage(id, file)
      setList(l => l.map(x => x.id === id ? { ...x, image: url } : x))
      if (editing?.id === id) setEditing(t => t ? { ...t, image: url } : t)
    } catch { alert('Eroare la upload') } finally { setUploading(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Ștergi testimonialul?')) return
    await deleteTestimonial(id)
    setList(l => l.filter(x => x.id !== id))
    if (editing?.id === id) setEditing(null)
  }

  const openEdit = (t: BackendTestimonial) => {
    setEditing(t)
    setCreating(false)
    setForm({ subtitle: t.subtitle || '', doctor_name: t.doctor_name, quote: t.quote, workshop_title: t.workshop_title || '', workshop_href: t.workshop_href || '', active: t.active, order: t.order })
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#000', margin: 0 }}>Testimoniale</h1>
        <button onClick={() => { setCreating(true); setEditing(null); setForm(EMPTY) }} style={{ padding: '0.6rem 1.25rem', background: '#065EA6', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontSize: '0.85rem' }}>+ Testimonial nou</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: list.length || creating ? '1fr 1.4fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {list.map(t => (
            <div key={t.id} style={{ background: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: editing?.id === t.id ? '2px solid #065EA6' : '2px solid transparent', cursor: 'pointer' }} onClick={() => openEdit(t)}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {t.image
                  ? <img src={storageUrl(t.image) ?? t.image} alt="" style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                  : <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: '#e5e7eb', flexShrink: 0 }} />
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem', color: '#000' }}>{t.doctor_name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6D6E71', fontWeight: 300, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{t.quote}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end' }}>
                  <button onClick={e => { e.stopPropagation(); handleToggleActive(t) }} style={{ padding: '0.25rem 0.6rem', background: t.active ? '#d1fae5' : '#f3f4f6', color: t.active ? '#065f46' : '#6D6E71', border: 'none', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', whiteSpace: 'nowrap' }}>
                    {t.active ? 'Activ' : 'Inactiv'}
                  </button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(t.id) }} style={{ padding: '0.25rem 0.6rem', background: '#fde8e8', color: '#ED3224', border: 'none', borderRadius: '6px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Șterge</button>
                </div>
              </div>
            </div>
          ))}
          {!list.length && !creating && <p style={{ color: '#6D6E71', fontWeight: 300, fontSize: '0.9rem' }}>Niciun testimonial adăugat.</p>}
        </div>

        {/* Edit / Create form */}
        {(editing || creating) && (
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <h2 style={{
                fontWeight: 500,
                fontSize: '1rem',
                color: '#000',
                margin: 0
              }}>{creating ? 'Testimonial nou' : 'Editează testimonial'}</h2>

              {/* Image upload (only for existing) */}
              {editing && (
                  <div>
                    <Label>Fotografie</Label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: '#f8fafc'
                    }}>
                      {editing.image
                          ? <img src={storageUrl(editing.image) ?? editing.image} alt="" style={{
                            width: '72px',
                            height: '72px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            flexShrink: 0
                          }}/>
                          : <div style={{
                            width: '72px',
                            height: '72px',
                            background: '#e5e7eb',
                            borderRadius: '8px',
                            flexShrink: 0
                          }}/>
                      }
                      <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.45rem 0.9rem',
                        background: uploading ? '#e5e7eb' : '#065EA6',
                        color: uploading ? '#6D6E71' : '#fff',
                        borderRadius: '8px',
                        cursor: uploading ? 'default' : 'pointer',
                        fontSize: '0.8rem',
                        fontFamily: '"Roboto",sans-serif'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        {uploading ? 'Se încarcă...' : 'Încarcă fotografie'}
                        <input type="file" accept="image/*" style={{display: 'none'}} disabled={uploading}
                               onChange={e => handleImageUpload(e, editing.id)}/>
                      </label>
                    </div>
                  </div>
              )}
              <div><Label>Subtitlu secțiune <span
                  style={{fontWeight: 300, textTransform: 'none', fontSize: '0.7rem', color: '#6D6E71'}}>(Enter = linie nouă)</span></Label><textarea
                  style={{...inp, height: '60px', resize: 'vertical'}} value={form.subtitle || ''}
                  onChange={set('subtitle')}/></div>
              <div><Label>Nume doctor *</Label><input style={inp} placeholder="Dr. Ion Popescu"
                                                      value={form.doctor_name || ''} onChange={set('doctor_name')}/>
              </div>
              <div><Label>Citat * <span
                  style={{fontWeight: 300, textTransform: 'none', fontSize: '0.7rem', color: '#6D6E71'}}>(Enter = linie nouă)</span></Label><textarea
                  style={{...inp, height: '100px', resize: 'vertical'}} placeholder="Cuvintele doctorului..."
                  value={form.quote || ''} onChange={set('quote')}/></div>
              <div><Label>Titlu workshop (link)</Label><input style={inp} placeholder="Workshop Interactiv TAVI"
                                                              value={form.workshop_title || ''}
                                                              onChange={set('workshop_title')}/></div>
              <div><Label>Link workshop</Label><input style={inp} placeholder="/events/workshop-interactiv-tavi"
                                                      value={form.workshop_href || ''} onChange={set('workshop_href')}/>
              </div>
              <div><Label>Ordine</Label><input type="number" style={inp} value={form.order ?? 0}
                                               onChange={set('order')}/></div>

              <div style={{display: 'flex', gap: '0.75rem'}}>
                <button onClick={creating ? handleCreate : handleSave} disabled={saving} style={{
                  flex: 1,
                  padding: '0.65rem',
                  background: '#065EA6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontFamily: '"Roboto",sans-serif',
                  fontSize: '0.9rem',
                  opacity: saving ? 0.7 : 1
                }}>
                  {saving ? 'Se salvează...' : creating ? 'Creează' : 'Salvează'}
                </button>
                <button onClick={() => {
                  setEditing(null);
                  setCreating(false)
                }} style={{
                  padding: '0.65rem 1rem',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontFamily: '"Roboto",sans-serif',
                  fontSize: '0.9rem'
                }}>Anulează
                </button>
              </div>
            </div>
        )}
      </div>
    </div>
  )
}
