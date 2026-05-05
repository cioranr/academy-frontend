'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getDoctors, storageUrl, uploadVideoResourceVideo } from '@/lib/api'
import type { Doctor, VideoResource } from '@/types'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

const inp: React.CSSProperties = { padding: '0.65rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem', background: '#fff', fontFamily: '"Roboto",sans-serif', color: '#000', width: '100%', outline: 'none' }
const Label = ({ children }: { children: React.ReactNode }) => <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{children}</label>

export interface VideoResourceFormState {
  title: string
  slug: string
  short_description: string
  content: string
  video_embed: string
  active: boolean
  doctor_ids: number[]
}

interface Props {
  initial: VideoResourceFormState
  resource?: VideoResource | null
  onSubmit: (state: VideoResourceFormState) => Promise<void> | void
  submitLabel: string
  onResourceUpdate?: (r: VideoResource) => void
}

export function VideoResourceForm({ initial, resource, onSubmit, submitLabel, onResourceUpdate }: Props) {
  const [form, setForm] = useState<VideoResourceFormState>(initial)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [doctorSearch, setDoctorSearch] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [videoPath, setVideoPath] = useState<string | null>(resource?.video_path ?? null)

  useEffect(() => { getDoctors().then(setDoctors) }, [])

  const set = (k: keyof VideoResourceFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  const toggleDoctor = (id: number) => {
    setForm(p => ({
      ...p,
      doctor_ids: p.doctor_ids.includes(id) ? p.doctor_ids.filter(x => x !== id) : [...p.doctor_ids, id],
    }))
  }

  const moveDoctor = (id: number, dir: -1 | 1) => {
    setForm(p => {
      const idx = p.doctor_ids.indexOf(id)
      const newIdx = idx + dir
      if (idx < 0 || newIdx < 0 || newIdx >= p.doctor_ids.length) return p
      const next = [...p.doctor_ids]
      ;[next[idx], next[newIdx]] = [next[newIdx], next[idx]]
      return { ...p, doctor_ids: next }
    })
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!resource) { alert('Salvează întâi resursa, apoi încarcă videoclipul.'); return }
    const file = e.target.files?.[0]; if (!file) return
    setUploadingVideo(true)
    try {
      const url = await uploadVideoResourceVideo(resource.id, file)
      setVideoPath(url)
      onResourceUpdate?.({ ...resource, video_path: url })
    } catch { alert('Eroare la upload') } finally { setUploadingVideo(false) }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try { await onSubmit(form) } finally { setSubmitting(false) }
  }

  const selectedDoctors = form.doctor_ids
    .map(id => doctors.find(d => d.id === id))
    .filter(Boolean) as Doctor[]
  const availableDoctors = doctors
    .filter(d => !form.doctor_ids.includes(d.id))
    .filter(d => d.name.toLowerCase().includes(doctorSearch.toLowerCase()))

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 500, fontSize: '1rem', margin: '0 0 1.25rem' }}>Detalii</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1/-1' }}><Label>Titlu *</Label><input style={inp} value={form.title} onChange={set('title')} /></div>
          <div style={{ gridColumn: '1/-1' }}>
            <Label>Slug URL <span style={{ fontWeight: 300, textTransform: 'none', fontSize: '0.7rem', color: '#6D6E71' }}>(/resurse-video/{form.slug || '...'})</span></Label>
            <input style={inp} value={form.slug} onChange={set('slug')} placeholder="se generează automat din titlu" />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <Label>Descriere scurtă</Label>
            <textarea style={{ ...inp, height: '70px', resize: 'vertical' }} maxLength={500} value={form.short_description} onChange={set('short_description')} />
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: '#9CA3AF' }}>{form.short_description.length}/500</p>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <Label>Conținut (opțional)</Label>
            <RichTextEditor value={form.content} onChange={html => setForm(p => ({ ...p, content: html }))} placeholder="Conținut detaliat..." />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
              <span style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px' }}>
                <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', inset: 0, background: form.active ? '#065EA6' : '#cbd5e1', borderRadius: '999px', transition: 'background 0.2s' }} />
                <span style={{ position: 'absolute', top: '3px', left: form.active ? '21px' : '3px', width: '16px', height: '16px', background: '#fff', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
              </span>
              <span style={{ fontSize: '0.85rem', color: '#374151' }}>Activ — pagina răspunde la /resurse-video/{form.slug || 'slug'}</span>
            </label>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 500, fontSize: '1rem', margin: '0 0 1rem' }}>Video</h2>
        <p style={{ fontSize: '0.8rem', color: '#6D6E71', fontWeight: 300, margin: '0 0 1rem' }}>
          Folosește fie un fișier încărcat, fie un URL embed (YouTube/Vimeo). Dacă ambele sunt setate, fișierul are prioritate.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <Label>URL embed (YouTube / Vimeo)</Label>
            <input style={inp} value={form.video_embed} onChange={set('video_embed')} placeholder="https://www.youtube.com/watch?v=..." />
          </div>
          <div>
            <Label>Fișier video</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.9rem', background: uploadingVideo || !resource ? '#e5e7eb' : '#065EA6', color: uploadingVideo || !resource ? '#6D6E71' : '#fff', borderRadius: '8px', cursor: uploadingVideo || !resource ? 'default' : 'pointer', fontSize: '0.8rem', fontFamily: '"Roboto",sans-serif' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {uploadingVideo ? 'Se încarcă...' : (videoPath ? 'Schimbă fișierul' : 'Încarcă fișier')}
                <input type="file" accept="video/mp4,video/webm,video/quicktime" style={{ display: 'none' }} disabled={uploadingVideo || !resource} onChange={handleVideoUpload} />
              </label>
              {videoPath && <a href={storageUrl(videoPath) ?? videoPath} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#065EA6' }}>Previzualizare ↗</a>}
            </div>
            {!resource && <p style={{ margin: '0.4rem 0 0', fontSize: '0.7rem', color: '#9CA3AF' }}>Disponibil după salvarea resursei.</p>}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 500, fontSize: '1rem', margin: '0 0 1rem' }}>Doctori asociați ({selectedDoctors.length})</h2>
        <p style={{ fontSize: '0.8rem', color: '#6D6E71', fontWeight: 300, margin: '0 0 1rem' }}>
          Doctorii apar pe pagina publică într-un carousel, în ordinea de mai jos. Folosește săgețile pentru a-i reordona.
        </p>

        {selectedDoctors.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {selectedDoctors.map((d, i) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#6D6E71', minWidth: '20px' }}>#{i + 1}</span>
                {d.image
                  ? <Image src={storageUrl(d.image) ?? d.image} alt={d.name} width={36} height={36} style={{ borderRadius: '50%', objectFit: 'cover' }} unoptimized />
                  : <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e5e7eb' }} />
                }
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 400 }}>{d.name}</div>
                  {d.specialty && <div style={{ fontSize: '0.7rem', color: '#6D6E71', fontWeight: 300 }}>{d.specialty}</div>}
                </div>
                <button onClick={() => moveDoctor(d.id, -1)} disabled={i === 0} style={{ background: 'none', border: 'none', cursor: i === 0 ? 'default' : 'pointer', color: i === 0 ? '#cbd5e1' : '#065EA6', fontSize: '1rem' }}>↑</button>
                <button onClick={() => moveDoctor(d.id, 1)} disabled={i === selectedDoctors.length - 1} style={{ background: 'none', border: 'none', cursor: i === selectedDoctors.length - 1 ? 'default' : 'pointer', color: i === selectedDoctors.length - 1 ? '#cbd5e1' : '#065EA6', fontSize: '1rem' }}>↓</button>
                <button onClick={() => toggleDoctor(d.id)} style={{ background: '#fde8e8', color: '#991b1b', border: 'none', borderRadius: '6px', padding: '0.25rem 0.55rem', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Elimină</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
          <input style={{ ...inp, marginBottom: '0.75rem' }} placeholder="Caută doctor după nume..." value={doctorSearch} onChange={e => setDoctorSearch(e.target.value)} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '260px', overflowY: 'auto' }}>
            {availableDoctors.map(d => (
              <button key={d.id} type="button" onClick={() => toggleDoctor(d.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.45rem 0.75rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>
                {d.image
                  ? <Image src={storageUrl(d.image) ?? d.image} alt={d.name} width={32} height={32} style={{ borderRadius: '50%', objectFit: 'cover' }} unoptimized />
                  : <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e5e7eb' }} />
                }
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem' }}>{d.name}</div>
                  {d.specialty && <div style={{ fontSize: '0.7rem', color: '#6D6E71', fontWeight: 300 }}>{d.specialty}</div>}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#065EA6' }}>+ Adaugă</span>
              </button>
            ))}
            {availableDoctors.length === 0 && (
              <p style={{ color: '#9CA3AF', fontSize: '0.8rem', fontWeight: 300, padding: '0.5rem' }}>Niciun doctor disponibil. Adaugă unul nou din pagina „Vorbitori” a unui eveniment.</p>
            )}
          </div>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={submitting || !form.title} style={{ padding: '0.75rem 2rem', background: '#065EA6', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 400, cursor: submitting || !form.title ? 'default' : 'pointer', fontFamily: '"Roboto",sans-serif', opacity: submitting || !form.title ? 0.6 : 1 }}>
        {submitting ? 'Se salvează...' : submitLabel}
      </button>
    </div>
  )
}
