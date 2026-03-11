'use client'
import { useEffect, useState, use, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getEvent, registerForEvent, storageUrl } from '@/lib/api'
import type { BackendEvent, EventSpeaker } from '@/types'
import { useAuth } from '@/lib/auth'

function DoctorCard({ speaker }: { speaker: EventSpeaker }) {
  return (
    <div className="flex flex-col" style={{ background: '#f5f5f5', height: '462px', flexShrink: 0, width: '306px' }}>
      <div className="relative overflow-hidden" style={{ height: '340px' }}>
        {speaker.image
          ? <Image src={storageUrl(speaker.image) ?? speaker.image} alt={speaker.name} fill quality={75} className="object-cover object-top" sizes="306px" unoptimized={!!storageUrl(speaker.image)} />
          : <div style={{ width: '100%', height: '100%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg></div>
        }
      </div>
      <div className="p-5" style={{ height: '122px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: '"Roboto",sans-serif', fontWeight: 300, fontSize: '22px', color: '#000', margin: '0 0 4px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{speaker.name}</h2>
          <p style={{ fontFamily: '"Roboto",sans-serif', fontWeight: 300, fontSize: '13px', color: '#414042', margin: 0, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{speaker.specialty}</p>
        </div>
      </div>
    </div>
  )
}

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { user } = useAuth()
  const [event, setEvent] = useState<BackendEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const speakersRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', email: user?.email || '', phone: user?.phone || '', specialty: user?.specialty || '', professional_grade: user?.professional_grade || '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    getEvent(slug).then(setEvent).catch(() => setNotFound(true)).finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (user) setForm(p => ({ ...p, first_name: user.first_name || '', last_name: user.last_name || '', email: user.email, phone: user.phone || '', specialty: user.specialty || '', professional_grade: user.professional_grade || '' }))
  }, [user])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitError(''); setSubmitting(true)
    try { await registerForEvent(slug, form); setSubmitted(true) } catch (err: unknown) { setSubmitError(err instanceof Error ? err.message : 'Eroare la înscriere') } finally { setSubmitting(false) }
  }

  const inp = { width: '100%', padding: '1rem 1.25rem', border: '2px solid #065ea6', borderRadius: '20px', fontSize: '0.95rem', background: 'transparent', outline: 'none', fontFamily: '"Roboto",sans-serif', fontWeight: 300, color: '#000' }
  const sel = { ...inp, appearance: 'none' as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23065ea6' d='M1 1L6 6L11 1' stroke='%23065ea6' stroke-width='2'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '12px', paddingRight: '3rem', cursor: 'pointer' }

  if (loading) return <main style={{ background: '#ecffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: '#065EA6', fontFamily: '"Roboto",sans-serif', fontWeight: 300 }}>Se încarcă...</div></main>
  if (notFound || !event) return <main style={{ background: '#ecffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ textAlign: 'center', fontFamily: '"Roboto",sans-serif' }}><h1 style={{ color: '#065EA6', fontWeight: 300 }}>Evenimentul nu a fost găsit</h1><Link href="/calendar" style={{ color: '#065EA6' }}>← Calendar</Link></div></main>

  const date = new Date(event.date)
  const day = date.getDate()
  const month = date.toLocaleDateString('ro-RO', { month: 'long' }).toUpperCase()
  const subtitle = event.subtitle ?? ''
  const location = event.location ?? ''
  const venue = event.venue ?? ''
  const emcPoints = event.credits ?? 6
  const creditsLabel = event.credits_label ?? `CURS CREDITAT CU ${emcPoints} PUNCTE EMC`
  const imageUrl = storageUrl(event.image)

  return (
    <main style={{ background: '#ecffff', fontFamily: '"Roboto",sans-serif' }}>
      {/* Hero */}
      <section style={{ background: '#ecffff', paddingTop: '40px', paddingBottom: '60px' }}>
        <div className="max-w-[1000px] mx-auto px-4">
          {/* Workshop */}
          <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 500, fontSize: '155px', color: '#065EA6', lineHeight: 1, letterSpacing: '-3px', display: 'flex', justifyContent: 'end' }}>
            Workshop
          </div>

          {/* Interactiv + subtitle keyword */}
          <div className="flex items-center gap-4 mb-4 ml-2">
              <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 500, fontSize: '115px', color: '#065EA6', lineHeight: 1, letterSpacing: '-6px' }}>
                Interactiv
              </span>
            {event?.title && (
                <span style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 600, fontSize: 'clamp(40px, 8vw, 115px)', color: '#065EA6', lineHeight: 1 }}>
                  {event.title}
                </span>
            )}
          </div>

          {/* Separator */}
          <div className="border-t border-[#065EA6] mb-4" />

          {/* Descriere */}
          <p className="text-center mb-6" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400, fontSize: '24px', color: '#065EA6', lineHeight: 1.5, textTransform: 'uppercase' }}>
            {subtitle.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </p>

          {/* 3 casute + poza */}
          <div className="flex items-center gap-4">

            {/* 1 — albastru */}
            <div className="flex-1 flex items-center justify-center text-left px-4" style={{ background: '#065EA6', height: '150px' }}>
              <div>
                <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400, fontSize: '22px', color: '#fff', lineHeight: 1, textTransform: 'uppercase' }}>
                  {location}
                </p>
                <div style={{ borderTop: '2px solid #ffffff' }} />
                <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400, fontSize: '16px', color: '#fff', marginTop: '5px', textTransform: 'uppercase' }}>
                  {venue}
                </p>
              </div>
            </div>

            {/* 2 — alb, data */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4" style={{ background: '#ffffff', height: '150px' }}>
              <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 800, fontSize: '46px', color: '#065EA6', lineHeight: 1 }}>
                {day}
              </p>
              <div style={{ borderTop: '2px solid #065EA6', width: '70%' }} />
              <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 500, fontSize: '15px', color: '#065EA6', letterSpacing: '0.08em', marginTop: '2px' }}>
                {month}
              </p>
            </div>

            {/* 3 — alb, EMC */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4" style={{ background: '#ffffff', height: '150px' }}>
              <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 800, fontSize: '46px', color: '#065EA6', lineHeight: 1 }}>
                {emcPoints}
              </p>
              <div style={{ borderTop: '2px solid #065EA6', width: '100%' }} />
              <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 500, fontSize: '15px', color: '#065EA6', lineHeight: 1, marginTop: '2px', textAlign: 'left' }}>
                {creditsLabel}
              </p>
            </div>

            {/* Poza */}
            <div className="flex-[1.5] flex items-center justify-center px-4">
              <Image
                  src={imageUrl ?? '/device-tavi.png'}
                  alt={event?.title ?? 'Dispozitiv'}
                  width={imageUrl ? 180 : 130}
                  height={imageUrl ? 96 : 120}
                  quality={90}
                  className="object-cover"
                  unoptimized={!!imageUrl}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pt-4">
        <div className="flex justify-center">
          <a href="#inscriere" className="inline-flex items-center gap-2 text-white rounded-full px-8 py-3 transition-all hover:-translate-y-px" style={{ background: '#065EA6', fontWeight: 300, fontSize: '13px' }}>Înscrie-te aici <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4l5 5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg></a>
        </div>
      </section>

      {event.description && <section className="bg-white py-16"><div className="max-w-[900px] mx-auto px-4"><p style={{ fontWeight: 300, fontSize: '16px', color: '#000', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{event.description}</p></div></section>}

      {/* Speakers */}
      {event.speakers && event.speakers.length > 0 && (
        <section className="bg-white py-10">
          <div className="max-w-[1200px] mx-auto px-[120px] relative">
            <button onClick={() => speakersRef.current?.scrollBy({ left: -(306 + 30), behavior: 'smooth' })} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 2L4 8L10 14" stroke="#0066cc" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div ref={speakersRef} className="flex gap-[30px] overflow-x-auto" style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
              {event.speakers.map(sp => <DoctorCard key={sp.id} speaker={sp} />)}
            </div>
            <button onClick={() => speakersRef.current?.scrollBy({ left: 306 + 30, behavior: 'smooth' })} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 2L12 8L6 14" stroke="#0066cc" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          <style>{`div::-webkit-scrollbar{display:none}`}</style>
        </section>
      )}

      {/* Program */}
      {event.sessions && event.sessions.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-[900px] mx-auto px-4">
            <h2 className="text-center mb-2" style={{ fontWeight: 300, fontSize: '28px', color: '#000' }}>Program</h2>
            <p className="text-center mb-8" style={{ fontWeight: 700, fontSize: '16px', color: '#065EA6', letterSpacing: '0.05em' }}>
              {date.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
            </p>
            <div>
              {event.sessions.map((s, i) => (
                <div key={s.id} className="flex items-start gap-4 px-6 py-4" style={{ borderBottom: i < (event.sessions?.length || 0) - 1 ? '3px solid #065EA6' : 'none', background: '#fff' }}>
                  <span style={{ fontWeight: 400, fontSize: '13px', color: '#065EA6', minWidth: '110px', flexShrink: 0 }}>{s.time_label}</span>
                  <div>
                    <p style={{ fontWeight: 400, fontSize: '13px', color: '#065EA6', margin: 0 }}>{s.title}</p>
                    {s.items?.map(item => <p key={item.id} style={{ fontWeight: 300, fontSize: '13px', color: '#000', margin: '4px 0 0' }}>{item.content}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Registration form */}
      <section className="bg-white py-12" id="inscriere">
        <div className="max-w-[900px] mx-auto px-4">
          <div style={{ background: 'transparent', padding: '2.5rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#000', marginBottom: '2rem', textAlign: 'center' }}>Înscrie-te</h3>
            {submitted ? (
              <div style={{ background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '25px', padding: '2rem', textAlign: 'center', fontFamily: '"Roboto",sans-serif' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 400, marginBottom: '0.5rem' }}>Cererea ta a fost înregistrată cu succes!</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 300 }}>Vei fi contactat în curând cu detalii despre eveniment.</div>
              </div>
            ) : (
              <form onSubmit={handleRegister}>
                {submitError && <div style={{ background: '#fde8e8', color: '#c53030', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>{submitError}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input style={inp} placeholder="Prenume *" required value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} />
                  <input style={inp} placeholder="Nume *" required value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))} />
                  <input type="email" style={inp} placeholder="E-Mail *" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                  <input type="tel" style={inp} placeholder="Telefon" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                  <select style={sel} value={form.professional_grade} onChange={e => setForm(p => ({ ...p, professional_grade: e.target.value }))}>
                    <option value="">Grad profesional</option>
                    <option value="medic-primar">Medic primar</option>
                    <option value="medic-specialist">Medic specialist</option>
                    <option value="medic-rezident">Medic rezident</option>
                    <option value="student">Student</option>
                  </select>
                  <select style={sel} value={form.specialty} onChange={e => setForm(p => ({ ...p, specialty: e.target.value }))}>
                    <option value="">Specialitate</option>
                    <option value="cardiologie">Cardiologie</option>
                    <option value="chirurgie">Chirurgie cardiovasculară</option>
                    <option value="rezidenti">Rezidenți</option>
                    <option value="alta">Altă specialitate</option>
                  </select>
                </div>
                <div className="flex justify-center mt-6">
                  <button type="submit" disabled={submitting} style={{ background: '#065EA6', border: 'none', borderRadius: '50px', color: '#fff', padding: '0.5rem 2rem', fontSize: '1.1rem', fontWeight: 300, cursor: 'pointer', minWidth: '200px', fontFamily: '"Roboto",sans-serif', boxShadow: '0 4px 15px rgba(6,94,166,0.3)', opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? 'Se trimite...' : 'Trimite'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
