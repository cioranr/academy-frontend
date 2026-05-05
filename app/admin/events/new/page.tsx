'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createEvent } from '@/lib/api'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

export default function NewEventPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', subtitle: '', description: '', slug: '', date: '', end_date: '', time_start: '', time_end: '', location: '', venue: '', credits: '', credits_label: '', status: 'draft', max_participants: '', fully_booked_message: '', show_fully_booked_message: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const ev = await createEvent({ ...form, credits: form.credits ? Number(form.credits) : undefined, max_participants: form.max_participants ? Number(form.max_participants) : undefined, subtitle: form.subtitle || undefined, description: form.description || undefined, slug: form.slug || undefined, end_date: form.end_date || undefined, time_start: form.time_start || undefined, time_end: form.time_end || undefined, location: form.location || undefined, venue: form.venue || undefined, credits_label: form.credits_label || undefined, fully_booked_message: form.fully_booked_message || undefined, show_fully_booked_message: form.show_fully_booked_message } as never)
      router.push(`/admin/events/${ev.id}`)
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Eroare') } finally { setLoading(false) }
  }

  const inp = { padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem', background: '#fff', outline: 'none', fontFamily: '"Roboto",sans-serif', width: '100%', color: '#000' }
  const Label = ({ children }: { children: React.ReactNode }) => <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#374151', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{children}</label>

  return (
    <div style={{ maxWidth: '750px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/events" style={{ color: '#6D6E71', textDecoration: 'none', fontSize: '0.9rem' }}>← Înapoi</Link>
        <h1 style={{ fontWeight: 300, fontSize: '1.8rem', color: '#000', margin: 0 }}>Eveniment nou</h1>
      </div>
      {error && <div style={{ background: '#fde8e8', color: '#c53030', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="col-span-2" style={{ gridColumn: '1/-1' }}><Label>Titlu *</Label><input required style={inp} placeholder="Titlul evenimentului" value={form.title} onChange={set('title')} /></div>
            <div style={{ gridColumn: '1/-1' }}><Label>Subtitlu</Label><input style={inp} placeholder="Subtitlu opțional" value={form.subtitle} onChange={set('subtitle')} /></div>
            <div style={{ gridColumn: '1/-1' }}>
              <Label>Descriere</Label>
              <RichTextEditor value={form.description} onChange={html => setForm(p => ({ ...p, description: html }))} placeholder="Descrierea evenimentului..." />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
            <div><Label>Data start *</Label><input type="date" required style={inp} value={form.date} onChange={set('date')} /></div>
            <div><Label>Data sfârșit <span style={{ fontWeight: 300, textTransform: 'none', fontSize: '0.7rem', color: '#6D6E71' }}>(opțional)</span></Label><input type="date" style={inp} min={form.date || undefined} value={form.end_date} onChange={set('end_date')} /></div>
            <div><Label>Ora start</Label><input type="time" style={inp} value={form.time_start} onChange={set('time_start')} /></div>
            <div><Label>Ora final</Label><input type="time" style={inp} value={form.time_end} onChange={set('time_end')} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><Label>Locație</Label><input style={inp} placeholder="ex: Centrul de Training" value={form.location} onChange={set('location')} /></div>
            <div><Label>Venue</Label><input style={inp} placeholder="ex: Spitalul Monza" value={form.venue} onChange={set('venue')} /></div>
            <div><Label>Puncte EMC</Label><input type="number" style={inp} placeholder="6" value={form.credits} onChange={set('credits')} /></div>
            <div><Label>Text EMC</Label><input style={inp} placeholder="ex: CURS CREDITAT CU 6 PUNCTE EMC" value={form.credits_label} onChange={set('credits_label')} /></div>
            <div><Label>Max. participanți</Label><input type="number" style={inp} placeholder="50" value={form.max_participants} onChange={set('max_participants')} /></div>
            <div><Label>Status</Label>
              <select style={{ ...inp, cursor: 'pointer' }} value={form.status} onChange={set('status')}>
                <option value="draft">Ciornă</option>
                <option value="published">Publicat</option>
                <option value="cancelled">Anulat</option>
              </select>
            </div>
            <div><Label>Slug URL</Label><input style={inp} placeholder="se generează automat" value={form.slug} onChange={set('slug')} /></div>
          </div>
          <div>
            <Label>Mesaj „Locuri epuizate"</Label>
            <textarea style={{ ...inp, height: '90px', resize: 'vertical' }} placeholder="ex: Locurile pentru acest eveniment au fost epuizate. Vă mulțumim pentru interes!" value={form.fully_booked_message} onChange={set('fully_booked_message')} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', userSelect: 'none' }}>
            <span style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px' }}>
              <input type="checkbox" checked={form.show_fully_booked_message} onChange={e => setForm(p => ({ ...p, show_fully_booked_message: e.target.checked }))} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', inset: 0, background: form.show_fully_booked_message ? '#065EA6' : '#cbd5e1', borderRadius: '999px', transition: 'background 0.2s' }} />
              <span style={{ position: 'absolute', top: '3px', left: form.show_fully_booked_message ? '21px' : '3px', width: '16px', height: '16px', background: '#fff', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
            </span>
            <span style={{ fontSize: '0.9rem', color: '#374151' }}>Afișează mesajul pe pagina evenimentului (înlocuiește butonul de înscriere)</span>
          </label>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" disabled={loading} style={{ padding: '0.75rem 2rem', background: '#065EA6', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 400, cursor: 'pointer', fontFamily: '"Roboto",sans-serif', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Se salvează...' : 'Creează evenimentul'}
          </button>
          <Link href="/admin/events" style={{ padding: '0.75rem 2rem', background: '#f3f4f6', color: '#374151', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 400 }}>Anulează</Link>
        </div>
      </form>
    </div>
  )
}
