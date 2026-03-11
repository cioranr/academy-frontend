'use client'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getEvent, updateEvent, uploadEventImage, createSpeaker, updateSpeaker, uploadSpeakerImage, deleteSpeaker, createSession, deleteSession, createSessionItem, deleteSessionItem, getDoctors, createDoctor, updateDoctor, uploadDoctorImage } from '@/lib/api'
import { storageUrl } from '@/lib/api'
import type { BackendEvent, EventSpeaker, EventSession, Doctor } from '@/types'

const inp = { padding: '0.65rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem', background: '#fff', fontFamily: '"Roboto",sans-serif', color: '#000', width: '100%', outline: 'none' }
const Label = ({ children }: { children: React.ReactNode }) => <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{children}</label>
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
    <h2 style={{ fontWeight: 500, fontSize: '1rem', color: '#000', margin: '0 0 1.25rem' }}>{title}</h2>
    {children}
  </div>
)

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [event, setEvent] = useState<BackendEvent | null>(null)
  const [form, setForm] = useState<Partial<BackendEvent>>({})
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [tab, setTab] = useState<'info' | 'speakers' | 'schedule'>('info')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [doctorSearch, setDoctorSearch] = useState('')
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [editDoctorForm, setEditDoctorForm] = useState<Partial<Doctor>>({})
  const [uploadingDoctorImg, setUploadingDoctorImg] = useState(false)
  const [editingSpeaker, setEditingSpeaker] = useState<EventSpeaker | null>(null)
  const [editSpeakerForm, setEditSpeakerForm] = useState<Partial<EventSpeaker>>({})
  const [uploadingSpeakerImg, setUploadingSpeakerImg] = useState(false)
  const [newDoctorForm, setNewDoctorForm] = useState({ name: '', specialty: '', slug: '', bio: '' })
  const [creatingDoctor, setCreatingDoctor] = useState(false)
  const [newSpeaker, setNewSpeaker] = useState({ name: '', specialty: '', image: '', slug: '', speaker_role: 'speaker' as const })
  const [newSession, setNewSession] = useState({ time_label: '', title: '' })
  const [newItems, setNewItems] = useState<Record<number, string>>({})
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  useEffect(() => { getDoctors().then(setDoctors) }, [])

  useEffect(() => {
    getEvent(id).then(ev => { setEvent(ev); setForm({ title: ev.title, subtitle: ev.subtitle || '', description: ev.description || '', date: ev.date?.split('T')[0] || '', time_start: ev.time_start || '', time_end: ev.time_end || '', location: ev.location || '', venue: ev.venue || '', credits: ev.credits, credits_label: ev.credits_label || '', image: ev.image || '', image_small: ev.image_small || '', image_big: ev.image_big || '', status: ev.status, max_participants: ev.max_participants }) })
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try { const ev = await updateEvent(Number(id), form); setEvent(ev) } catch { alert('Eroare la salvare') } finally { setSaving(false) }
  }

  const [uploadingImageSmall, setUploadingImageSmall] = useState(false)
  const [uploadingImageBig, setUploadingImageBig] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'small' | 'big' = 'main') => {
    const file = e.target.files?.[0]; if (!file) return
    const setUploading = type === 'small' ? setUploadingImageSmall : type === 'big' ? setUploadingImageBig : setUploadingImage
    setUploading(true)
    try {
      const { field, url } = await uploadEventImage(event!.id, file, type)
      setEvent(ev => ev ? { ...ev, [field]: url } : ev)
      setForm(p => ({ ...p, [field]: url }))
    } catch { alert('Eroare la upload imagine') } finally { setUploading(false) }
  }

  // ── Doctor pool handlers ────────────────────────────────────────────────
  const handleAddDoctorToPool = async () => {
    if (!newDoctorForm.name) return
    setCreatingDoctor(true)
    try {
      const doc = await createDoctor(newDoctorForm)
      setDoctors(d => [...d, doc])
      setNewDoctorForm({ name: '', specialty: '', slug: '', bio: '' })
    } catch { alert('Eroare la creare doctor') } finally { setCreatingDoctor(false) }
  }
  const handleDoctorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, doctor: Doctor) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploadingDoctorImg(true)
    try {
      const url = await uploadDoctorImage(doctor.id, file)
      const updated = { ...doctor, image: url }
      setDoctors(d => d.map(x => x.id === doctor.id ? updated : x))
      if (editingDoctor?.id === doctor.id) setEditingDoctor(updated)
    } catch { alert('Eroare la upload') } finally { setUploadingDoctorImg(false) }
  }
  const handleSaveDoctor = async () => {
    if (!editingDoctor) return
    try {
      const updated = await updateDoctor(editingDoctor.id, editDoctorForm)
      setDoctors(d => d.map(x => x.id === updated.id ? updated : x))
      setEditingDoctor(updated)
    } catch { alert('Eroare la salvare') }
  }
  const handleAddDoctorToEvent = async (doc: Doctor, role: 'speaker' | 'director') => {
    try {
      const sp = await createSpeaker(event!.slug, { doctor_id: doc.id, name: doc.name, specialty: doc.specialty || '', image: doc.image || '', slug: doc.slug || '', speaker_role: role })
      setEvent(ev => ev ? { ...ev, speakers: [...(ev.speakers || []), sp] } : ev)
    } catch { alert('Eroare la adăugare') }
  }

  // ── Event speaker handlers ──────────────────────────────────────────────
  const handleSpeakerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, speaker: EventSpeaker) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploadingSpeakerImg(true)
    try {
      const url = await uploadSpeakerImage(speaker.id, file)
      setEvent(ev => ev ? { ...ev, speakers: ev.speakers?.map(s => s.id === speaker.id ? { ...s, image: url } : s) } : ev)
      if (editingSpeaker?.id === speaker.id) setEditingSpeaker(s => s ? { ...s, image: url } : s)
    } catch { alert('Eroare la upload') } finally { setUploadingSpeakerImg(false) }
  }
  const handleSaveSpeaker = async () => {
    if (!editingSpeaker) return
    try {
      const updated = await updateSpeaker(editingSpeaker.id, editSpeakerForm)
      setEvent(ev => ev ? { ...ev, speakers: ev.speakers?.map(s => s.id === updated.id ? updated : s) } : ev)
      setEditingSpeaker(updated)
    } catch { alert('Eroare la salvare') }
  }

  const handleAddSpeaker = async () => {
    if (!newSpeaker.name) return
    try { const sp = await createSpeaker(event!.slug, newSpeaker); setEvent(ev => ev ? { ...ev, speakers: [...(ev.speakers || []), sp] } : ev); setNewSpeaker({ name: '', specialty: '', image: '', slug: '', speaker_role: 'speaker' }) } catch {}
  }
  const handleDeleteSpeaker = async (id: number) => {
    await deleteSpeaker(id); setEvent(ev => ev ? { ...ev, speakers: ev.speakers?.filter(s => s.id !== id) } : ev)
    if (editingSpeaker?.id === id) setEditingSpeaker(null)
  }
  const handleAddSession = async () => {
    if (!newSession.time_label || !newSession.title) return
    try { const s = await createSession(event!.id, { ...newSession, order: (event?.sessions?.length || 0) }); setEvent(ev => ev ? { ...ev, sessions: [...(ev.sessions || []), s] } : ev); setNewSession({ time_label: '', title: '' }) } catch {}
  }
  const handleDeleteSession = async (sid: number) => {
    await deleteSession(sid); setEvent(ev => ev ? { ...ev, sessions: ev.sessions?.filter(s => s.id !== sid) } : ev)
  }
  const handleAddItem = async (session: EventSession) => {
    const content = newItems[session.id]; if (!content) return
    try { const item = await createSessionItem(session.id, { content, order: session.items?.length || 0 }); setEvent(ev => ev ? { ...ev, sessions: ev.sessions?.map(s => s.id === session.id ? { ...s, items: [...(s.items || []), item] } : s) } : ev); setNewItems(p => ({ ...p, [session.id]: '' })) } catch {}
  }
  const handleDeleteItem = async (sessionId: number, itemId: number) => {
    await deleteSessionItem(itemId); setEvent(ev => ev ? { ...ev, sessions: ev.sessions?.map(s => s.id === sessionId ? { ...s, items: s.items?.filter(i => i.id !== itemId) } : s) } : ev)
  }

  if (!event) return <div style={{ color: '#6D6E71', fontWeight: 300 }}>Se încarcă...</div>

  const tabBtn = (t: typeof tab, label: string) => (
    <button onClick={() => setTab(t)} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontSize: '0.85rem', fontWeight: tab === t ? 500 : 400, background: tab === t ? '#065EA6' : '#f3f4f6', color: tab === t ? '#fff' : '#374151' }}>{label}</button>
  )

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link href="/admin/events" style={{ color: '#6D6E71', textDecoration: 'none', fontSize: '0.9rem' }}>← Înapoi</Link>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#000', margin: 0, flex: 1 }}>{event.title}</h1>
        <Link href={`/admin/events/${id}/registrations`} style={{ padding: '0.5rem 1rem', background: '#f3f4f6', color: '#374151', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem' }}>Înscrieri</Link>
        <Link href={`/events/${event.slug}`} target="_blank" style={{ padding: '0.5rem 1rem', background: '#ecffff', color: '#065EA6', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem' }}>↗ Previzualizare</Link>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {tabBtn('info', 'Informații')}
        {tabBtn('speakers', `Vorbitori (${event.speakers?.length || 0})`)}
        {tabBtn('schedule', `Program (${event.sessions?.length || 0})`)}
      </div>

      {tab === 'info' && (
        <Section title="Detalii eveniment">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: '1/-1' }}><Label>Titlu</Label><input style={inp} value={form.title || ''} onChange={set('title')} /></div>
              <div style={{ gridColumn: '1/-1' }}><Label>Subtitlu <span style={{ fontWeight: 300, textTransform: 'none', fontSize: '0.7rem', color: '#6D6E71' }}>(Enter = linie nouă)</span></Label><textarea style={{ ...inp, height: '72px', resize: 'vertical' }} value={form.subtitle || ''} onChange={set('subtitle')} /></div>
              <div style={{ gridColumn: '1/-1' }}><Label>Descriere</Label><textarea style={{ ...inp, height: '100px', resize: 'vertical' }} value={form.description || ''} onChange={set('description')} /></div>
              <div><Label>Data</Label><input type="date" style={inp} value={typeof form.date === 'string' ? form.date.split('T')[0] : ''} onChange={set('date')} /></div>
              <div><Label>Status</Label><select style={{ ...inp, cursor: 'pointer' }} value={form.status || 'draft'} onChange={set('status')}><option value="draft">Ciornă</option><option value="published">Publicat</option><option value="cancelled">Anulat</option></select></div>
              <div><Label>Ora start</Label><input type="time" style={inp} value={form.time_start || ''} onChange={set('time_start')} /></div>
              <div><Label>Ora final</Label><input type="time" style={inp} value={form.time_end || ''} onChange={set('time_end')} /></div>
              <div><Label>Locație</Label><input style={inp} value={form.location || ''} onChange={set('location')} /></div>
              <div><Label>Venue</Label><input style={inp} value={form.venue || ''} onChange={set('venue')} /></div>
              <div><Label>Puncte EMC</Label><input type="number" style={inp} value={form.credits || ''} onChange={set('credits')} /></div>
              <div><Label>Text EMC</Label><input style={inp} value={form.credits_label || ''} onChange={set('credits_label')} /></div>
              <div><Label>Max. participanți</Label><input type="number" style={inp} value={form.max_participants || ''} onChange={set('max_participants')} /></div>
              {([
                { key: 'image',       label: 'Imagine principală',       type: 'main'  as const, uploading: uploadingImage,      setUploading: setUploadingImage },
                { key: 'image_small', label: 'Imagine mică (thumbnail)', type: 'small' as const, uploading: uploadingImageSmall, setUploading: setUploadingImageSmall },
                { key: 'image_big',   label: 'Imagine mare (banner)',    type: 'big'   as const, uploading: uploadingImageBig,   setUploading: setUploadingImageBig },
              ] as const).map(({ key, label, type, uploading }) => (
                <div key={key} style={{ gridColumn: '1/-1' }}>
                  <Label>{label}</Label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f8fafc' }}>
                    {(form as Record<string, unknown>)[key] ? (
                      <img
                        src={String((form as Record<string, unknown>)[key]).startsWith('/storage/') ? `http://localhost:8000${(form as Record<string, unknown>)[key]}` : String((form as Record<string, unknown>)[key])}
                        alt="Preview"
                        style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{ width: '80px', height: '60px', background: '#e5e7eb', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: uploading ? '#e5e7eb' : '#065EA6', color: uploading ? '#6D6E71' : '#fff', borderRadius: '8px', cursor: uploading ? 'default' : 'pointer', fontSize: '0.85rem', fontFamily: '"Roboto",sans-serif' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        {uploading ? 'Se încarcă...' : 'Încarcă imagine'}
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, type)} disabled={uploading} />
                      </label>
                      <p style={{ margin: '0.35rem 0 0', fontSize: '0.75rem', color: '#6D6E71', fontWeight: 300 }}>JPG, PNG, WebP · max 5MB</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSave} disabled={saving} style={{ alignSelf: 'flex-start', padding: '0.65rem 2rem', background: '#065EA6', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Se salvează...' : 'Salvează modificările'}
            </button>
          </div>
        </Section>
      )}

      {tab === 'speakers' && (
        <>
          {/* ── Vorbitori adăugați la eveniment ── */}
          <Section title="Vorbitori adăugați la eveniment">
            {!event.speakers?.length && <p style={{ color: '#6D6E71', fontWeight: 300, fontSize: '0.9rem' }}>Niciun vorbitor adăugat.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {event.speakers?.map(sp => (
                <div key={sp.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '10px' }}>
                    {sp.image
                      ? <img src={storageUrl(sp.image) ?? sp.image} alt={sp.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      : <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg></div>
                    }
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 400, fontSize: '0.9rem' }}>{sp.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6D6E71', fontWeight: 300 }}>{sp.specialty} · {sp.speaker_role === 'director' ? 'Director' : 'Vorbitor'}</div>
                    </div>
                    <button onClick={() => { setEditingSpeaker(editingSpeaker?.id === sp.id ? null : sp); setEditSpeakerForm({ name: sp.name, specialty: sp.specialty || '', slug: sp.slug || '', speaker_role: sp.speaker_role }) }} style={{ background: '#ecffff', color: '#065EA6', border: 'none', borderRadius: '6px', padding: '0.35rem 0.65rem', fontSize: '0.8rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>
                      {editingSpeaker?.id === sp.id ? 'Închide' : 'Editează'}
                    </button>
                    <button onClick={() => handleDeleteSpeaker(sp.id)} style={{ background: '#fde8e8', color: '#ED3224', border: 'none', borderRadius: '6px', padding: '0.35rem 0.65rem', fontSize: '0.8rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Șterge</button>
                  </div>

                  {editingSpeaker?.id === sp.id && (
                    <div style={{ background: '#f0f7ff', borderRadius: '10px', padding: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {/* Image upload */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {editingSpeaker.image
                          ? <img src={storageUrl(editingSpeaker.image) ?? editingSpeaker.image} alt="" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                          : <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e5e7eb', flexShrink: 0 }} />
                        }
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.9rem', background: uploadingSpeakerImg ? '#e5e7eb' : '#065EA6', color: uploadingSpeakerImg ? '#6D6E71' : '#fff', borderRadius: '8px', cursor: uploadingSpeakerImg ? 'default' : 'pointer', fontSize: '0.8rem', fontFamily: '"Roboto",sans-serif' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          {uploadingSpeakerImg ? 'Se încarcă...' : 'Schimbă poza'}
                          <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploadingSpeakerImg} onChange={e => handleSpeakerImageUpload(e, editingSpeaker)} />
                        </label>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <input style={inp} placeholder="Nume" value={editSpeakerForm.name || ''} onChange={e => setEditSpeakerForm(p => ({ ...p, name: e.target.value }))} />
                        <input style={inp} placeholder="Specialitate" value={editSpeakerForm.specialty || ''} onChange={e => setEditSpeakerForm(p => ({ ...p, specialty: e.target.value }))} />
                        <input style={inp} placeholder="Slug profil" value={editSpeakerForm.slug || ''} onChange={e => setEditSpeakerForm(p => ({ ...p, slug: e.target.value }))} />
                        <select style={{ ...inp, cursor: 'pointer' }} value={editSpeakerForm.speaker_role || 'speaker'} onChange={e => setEditSpeakerForm(p => ({ ...p, speaker_role: e.target.value as 'speaker' | 'director' }))}>
                          <option value="speaker">Vorbitor</option>
                          <option value="director">Director de curs</option>
                        </select>
                      </div>
                      <button onClick={handleSaveSpeaker} style={{ alignSelf: 'flex-start', padding: '0.5rem 1.5rem', background: '#065EA6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontSize: '0.85rem' }}>Salvează</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* ── Alege din baza de doctori ── */}
          <Section title="Baza de doctori">
            <input style={{ ...inp, marginBottom: '0.75rem' }} placeholder="Caută după nume..." value={doctorSearch} onChange={e => setDoctorSearch(e.target.value)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
              {doctors.filter(d => d.name.toLowerCase().includes(doctorSearch.toLowerCase())).map(doc => (
                <div key={doc.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                    {doc.image
                      ? <img src={storageUrl(doc.image) ?? doc.image} alt={doc.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg></div>
                    }
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 400 }}>{doc.name}</div>
                      {doc.specialty && <div style={{ fontSize: '0.75rem', color: '#6D6E71', fontWeight: 300 }}>{doc.specialty}</div>}
                    </div>
                    <button onClick={() => { setEditingDoctor(editingDoctor?.id === doc.id ? null : doc); setEditDoctorForm({ name: doc.name, specialty: doc.specialty || '', slug: doc.slug || '', bio: doc.bio || '' }) }} style={{ background: '#ecffff', color: '#065EA6', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>
                      {editingDoctor?.id === doc.id ? 'Închide' : 'Editează'}
                    </button>
                    <button onClick={() => handleAddDoctorToEvent(doc, 'speaker')} style={{ background: '#e8f4e8', color: '#166534', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>+ Vorbitor</button>
                    <button onClick={() => handleAddDoctorToEvent(doc, 'director')} style={{ background: '#fef3c7', color: '#92400e', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>+ Director</button>
                  </div>

                  {editingDoctor?.id === doc.id && (
                    <div style={{ background: '#f0f7ff', borderRadius: '10px', padding: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {editingDoctor.image
                          ? <img src={storageUrl(editingDoctor.image) ?? editingDoctor.image} alt="" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                          : <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e5e7eb', flexShrink: 0 }} />
                        }
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.9rem', background: uploadingDoctorImg ? '#e5e7eb' : '#065EA6', color: uploadingDoctorImg ? '#6D6E71' : '#fff', borderRadius: '8px', cursor: uploadingDoctorImg ? 'default' : 'pointer', fontSize: '0.8rem', fontFamily: '"Roboto",sans-serif' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          {uploadingDoctorImg ? 'Se încarcă...' : 'Schimbă poza'}
                          <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploadingDoctorImg} onChange={e => handleDoctorImageUpload(e, editingDoctor)} />
                        </label>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <input style={inp} placeholder="Nume" value={editDoctorForm.name || ''} onChange={e => setEditDoctorForm(p => ({ ...p, name: e.target.value }))} />
                        <input style={inp} placeholder="Specialitate" value={editDoctorForm.specialty || ''} onChange={e => setEditDoctorForm(p => ({ ...p, specialty: e.target.value }))} />
                        <input style={inp} placeholder="Slug profil" value={editDoctorForm.slug || ''} onChange={e => setEditDoctorForm(p => ({ ...p, slug: e.target.value }))} />
                        <textarea style={{ ...inp, height: '60px', resize: 'vertical', gridColumn: '1/-1' }} placeholder="Bio" value={editDoctorForm.bio || ''} onChange={e => setEditDoctorForm(p => ({ ...p, bio: e.target.value }))} />
                      </div>
                      <button onClick={handleSaveDoctor} style={{ alignSelf: 'flex-start', padding: '0.5rem 1.5rem', background: '#065EA6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontSize: '0.85rem' }}>Salvează</button>
                    </div>
                  )}
                </div>
              ))}
              {doctors.filter(d => d.name.toLowerCase().includes(doctorSearch.toLowerCase())).length === 0 && (
                <p style={{ color: '#6D6E71', fontWeight: 300, fontSize: '0.85rem' }}>Niciun doctor găsit.</p>
              )}
            </div>

            {/* Add new doctor to pool */}
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.75rem', color: '#374151' }}>Adaugă doctor nou în bază</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input style={inp} placeholder="Nume *" value={newDoctorForm.name} onChange={e => setNewDoctorForm(p => ({ ...p, name: e.target.value }))} />
                <input style={inp} placeholder="Specialitate" value={newDoctorForm.specialty} onChange={e => setNewDoctorForm(p => ({ ...p, specialty: e.target.value }))} />
                <input style={inp} placeholder="Slug (ex: dr-cebotaru)" value={newDoctorForm.slug} onChange={e => setNewDoctorForm(p => ({ ...p, slug: e.target.value }))} />
                <button onClick={handleAddDoctorToPool} disabled={creatingDoctor || !newDoctorForm.name} style={{ padding: '0.65rem', background: '#065EA6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontSize: '0.85rem', opacity: creatingDoctor || !newDoctorForm.name ? 0.6 : 1 }}>
                  {creatingDoctor ? 'Se adaugă...' : 'Adaugă în bază'}
                </button>
              </div>
            </div>
          </Section>
        </>
      )}

      {tab === 'schedule' && (
        <Section title="Program / Sesiuni">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {event.sessions?.map(s => (
              <div key={s.id} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#065EA6', minWidth: '90px' }}>{s.time_label}</span>
                  <span style={{ fontWeight: 400, fontSize: '0.9rem', flex: 1 }}>{s.title}</span>
                  <button onClick={() => handleDeleteSession(s.id)} style={{ background: '#fde8e8', color: '#ED3224', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Șterge</button>
                </div>
                <div style={{ padding: '0.75rem 1rem' }}>
                  {s.items?.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.3rem 0' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6D6E71', fontWeight: 300, flex: 1 }}>• {item.content}</span>
                      <button onClick={() => handleDeleteItem(s.id, item.id)} style={{ background: 'none', color: '#ED3224', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontFamily: '"Roboto",sans-serif' }}>×</button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <input style={{ ...inp, flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.8rem' }} placeholder="Adaugă subiect..." value={newItems[s.id] || ''} onChange={e => setNewItems(p => ({ ...p, [s.id]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleAddItem(s)} />
                    <button onClick={() => handleAddItem(s)} style={{ padding: '0.45rem 0.75rem', background: '#ecffff', color: '#065EA6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: '"Roboto",sans-serif' }}>+</button>
                  </div>
                </div>
              </div>
            ))}
            {!event.sessions?.length && <p style={{ color: '#6D6E71', fontWeight: 300, fontSize: '0.9rem' }}>Nicio sesiune adăugată.</p>}
          </div>
          <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.75rem', color: '#374151' }}>Adaugă sesiune</div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input style={{ ...inp, width: '130px', flexShrink: 0 }} placeholder="ex: 09:00-10:30" value={newSession.time_label} onChange={e => setNewSession(p => ({ ...p, time_label: e.target.value }))} />
              <input style={{ ...inp, flex: 1 }} placeholder="ex: SESIUNEA I" value={newSession.title} onChange={e => setNewSession(p => ({ ...p, title: e.target.value }))} />
              <button onClick={handleAddSession} style={{ padding: '0.65rem 1rem', background: '#065EA6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Adaugă</button>
            </div>
          </div>
        </Section>
      )}
    </div>
  )
}
