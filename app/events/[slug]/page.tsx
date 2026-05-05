'use client'
import { useEffect, useState, use, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getEvent, registerForEvent, storageUrl } from '@/lib/api'
import type { BackendEvent, EventSpeaker } from '@/types'
import { useAuth } from '@/lib/auth'
import { useRecaptcha } from '@/lib/useRecaptcha'

function DoctorCard({ speaker }: { speaker: EventSpeaker }) {
  return (
    <div className="flex flex-col speaker-card" style={{ background: '#f5f5f5', height: '462px', flexShrink: 0, scrollSnapAlign: 'center' }}>
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
  const { getToken } = useRecaptcha()
  const [event, setEvent] = useState<BackendEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const speakersRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', email: user?.email || '', phone: user?.phone || '', specialty: user?.specialty || '', professional_grade: user?.professional_grade || '', cuim: user?.cuim || '', message: '' })
  const showCuim = ['medic-specialist', 'medic-primar'].includes(form.professional_grade) && form.specialty !== 'rezidenti'
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [activeSpeakerIdx, setActiveSpeakerIdx] = useState(0)

  useEffect(() => {
    const el = speakersRef.current
    if (!el) return
    const onScroll = () => {
      const cards = el.querySelectorAll<HTMLElement>('.speaker-card')
      if (!cards.length) return
      const center = el.scrollLeft + el.clientWidth / 2
      let bestIdx = 0, bestDist = Infinity
      cards.forEach((c, i) => {
        const cardCenter = c.offsetLeft + c.offsetWidth / 2
        const dist = Math.abs(cardCenter - center)
        if (dist < bestDist) { bestDist = dist; bestIdx = i }
      })
      setActiveSpeakerIdx(bestIdx)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [event?.speakers?.length])

  const scrollToSpeaker = (idx: number) => {
    const el = speakersRef.current
    if (!el) return
    const card = el.querySelectorAll<HTMLElement>('.speaker-card')[idx]
    if (!card) return
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: 'smooth' })
  }

  useEffect(() => {
    getEvent(slug).then(ev => {
      setEvent(ev)
      if (ev.schema_org) {
        const existing = document.getElementById('event-schema-org')
        if (existing) existing.remove()
        const script = document.createElement('script')
        script.id = 'event-schema-org'
        script.type = 'application/ld+json'
        script.text = ev.schema_org
        document.head.appendChild(script)
      }
    }).catch(() => setNotFound(true)).finally(() => setLoading(false))
    return () => { document.getElementById('event-schema-org')?.remove() }
  }, [slug])

  useEffect(() => {
    if (user) setForm(p => ({ ...p, first_name: user.first_name || '', last_name: user.last_name || '', email: user.email, phone: user.phone || '', specialty: user.specialty || '', professional_grade: user.professional_grade || '', cuim: user.cuim || '' }))
  }, [user])

  const handleRegister = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault(); setSubmitError(''); setSubmitting(true)
    try {
      const recaptcha_token = await getToken('event_registration')
      const payload = { ...form, recaptcha_token, website: '' };
      if (!showCuim) payload.cuim = '';
      await registerForEvent(slug, payload)
      setSubmitted(true)
    } catch (err: unknown) { setSubmitError(err instanceof Error ? err.message : 'Eroare la înscriere') } finally { setSubmitting(false) }
  }

  const inp = { width: '100%', padding: '1rem 1.25rem', border: '2px solid #065ea6', borderRadius: '20px', fontSize: '0.95rem', background: 'transparent', outline: 'none', fontFamily: '"Roboto",sans-serif', fontWeight: 300, color: '#000' }
  const sel = { ...inp, appearance: 'none' as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23065ea6' d='M1 1L6 6L11 1' stroke='%23065ea6' stroke-width='2'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '12px', paddingRight: '3rem', cursor: 'pointer' }

  if (loading) return (
    <main style={{ background: '#ecffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <svg style={{ animation: 'pulse 1.2s ease-in-out infinite', transformOrigin: 'center' }} width="60" height="56" viewBox="0 0 24 24" fill="#ED3224">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <span style={{ color: '#065EA6', fontFamily: '"Roboto",sans-serif', fontWeight: 300, fontSize: '14px' }}>Se încarcă...</span>
      <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.18); } }`}</style>
    </main>
  )

  if (notFound || !event) return (
    <main style={{ background: '#ecffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', fontFamily: '"Roboto",sans-serif' }}>
        <h1 style={{ color: '#065EA6', fontWeight: 300 }}>Evenimentul nu a fost găsit</h1>
        <Link href="/calendar" style={{ color: '#065EA6' }}>← Calendar</Link>
      </div>
    </main>
  )

  const date = new Date(event.date)
  const endDate = event.end_date ? new Date(event.end_date) : null
  const isMultiDay = !!(endDate && endDate.getTime() > date.getTime())
  const day = date.getDate()
  const month = date.toLocaleDateString('ro-RO', { month: 'long' }).toUpperCase()
  const dayDisplay = isMultiDay
    ? `${date.getDate()}-${endDate!.getDate()}`
    : String(day)
  const monthDisplay = isMultiDay && date.getMonth() !== endDate!.getMonth()
    ? `${date.toLocaleDateString('ro-RO', { month: 'short' }).toUpperCase()}-${endDate!.toLocaleDateString('ro-RO', { month: 'short' }).toUpperCase()}`
    : month
  const subtitle = event.subtitle ?? ''
  const location = event.location ?? ''
  const venue = event.venue ?? ''
  const emcPoints = event.credits ?? null
  const creditsLabel = event.credits_label ?? `CURS CREDITAT CU ${emcPoints} PUNCTE EMC`
  const imageUrl = storageUrl(event.image)

  return (
    <main style={{ fontFamily: '"Roboto",sans-serif' }}>

      {/* ── HERO ── */}
      <section className="relative z-10 w-full">
        <div className="max-w-[1200px] mx-auto px-4 pt-6 pb-8 relative">

          {/* Main grid: title (left), info (mid), images (right) */}
          <div className="md:grid md:gap-6 md:items-center" style={{ gridTemplateColumns: 'minmax(0, 1.6fr) auto minmax(0, 1.1fr)' }}>

            {/* TITLE BLOCK */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 500, fontSize: 'clamp(48px, 8vw, 96px)', color: '#065ea6', lineHeight: 0.95, letterSpacing: '-4px' }}>
                Workshop
              </div>
              <div className="flex flex-wrap items-baseline gap-x-3" style={{ marginTop: '4px' }}>
                <div style={{ borderBottom: '2px solid #065ea6' }}>
                  <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 500, fontSize: 'clamp(28px, 4.5vw, 52px)', color: '#065ea6', lineHeight: 1, letterSpacing: '-3px' }}>
                    Interactiv:
                  </span>
                  {event.title && (
                    <span style={{ marginLeft: '10px', fontFamily: '"Roboto", sans-serif', fontWeight: 800, fontSize: 'clamp(16px, 3.2vw, 28px)', color: '#065ea6', lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '0.01em' }}>
                      {event.title}
                    </span>
                  )}
                </div>
              </div>
              {subtitle && (
                <div style={{ borderBottom: '2px solid #065ea6', textAlign: 'center' }}>
                  <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400, fontSize: 'clamp(11px, 1.4vw, 15px)', color: '#065ea6', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.4 }}>
                    {subtitle.split('\n').map((line, i, arr) => (
                      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                    ))}
                  </p>
                </div>
              )}
            </div>

            {/* INFO STACK (Monza Ares + date + emc) */}
            <div className="flex md:flex-col gap-3 md:gap-4 mt-5 md:mt-0 pr-5" style={{ borderRight: '2px solid #065ea6' }}>
              <div className="flex-1 md:flex-none flex flex-col items-center justify-center text-left" style={{ aspectRatio: '1/1', background: '#065ea6', color: '#fff', padding: '8px', minHeight: '88px', width: '120px' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', lineHeight: 1.1, letterSpacing: '0.05em', width: '100%' }}>MONZA ARES<br />ACADEMY</div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.45)', margin: '6px auto', width: '100%' }} />
                <div style={{ fontWeight: 400, fontSize: '11px', letterSpacing: '0.06em' }}>SPITALUL MONZA</div>
              </div>
              <div className="flex-1 md:flex-none flex flex-col items-center justify-center text-left" style={{ aspectRatio: '1/1', background: '#065ea6', color: '#fff', padding: '8px', minHeight: '88px', width: '120px' }}>
                <div style={{ fontWeight: 800, fontSize: 'clamp(26px, 3vw, 36px)', lineHeight: 1 }}>{dayDisplay}</div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.55)', width: '70%', margin: '6px auto' }} />
                <div style={{ fontWeight: 500, fontSize: '11px', letterSpacing: '0.08em' }}>{monthDisplay}</div>
              </div>
              {emcPoints ? (
                <div className="flex-1 md:flex-none flex flex-col items-center justify-center text-left" style={{ aspectRatio: '1/1', background: '#065ea6', color: '#fff', padding: '8px', minHeight: '88px', width: '120px' }}>
                  <div style={{ fontWeight: 800, fontSize: 'clamp(26px, 3vw, 36px)', lineHeight: 1 }}>{emcPoints}</div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.55)', width: '100%', margin: '5px auto' }} />
                  <div style={{ fontWeight: 500, fontSize: '9px', letterSpacing: '0.06em', lineHeight: 1.25 }}>{creditsLabel}</div>
                </div>
              ) : null}
            </div>

            {/* IMAGES */}
            <div className="flex gap-2 mt-4 md:mt-0 h-full">
              <div className="flex-1 relative h-full" style={{ background: '#fff', overflow: 'hidden', minHeight: '180px' }}>
                <Image
                  src={imageUrl ?? '/device-tavi.png'}
                  alt={event.title ?? ''}
                  fill
                  className="object-contain"
                  quality={90}
                  unoptimized={!!imageUrl}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Buton inscriere / mesaj locuri epuizate */}
      {!(event.show_fully_booked_message && event.fully_booked_message) && (
        <section className="bg-white pt-4">
          <div className="flex justify-center">
            <a href="#inscriere" className="inline-flex items-center gap-2 text-white rounded-full px-8 py-3 transition-all hover:-translate-y-px" style={{ background: '#065EA6', fontWeight: 300, fontSize: '13px' }}>
              Înscrie-te aici
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4l5 5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </a>
          </div>
        </section>
      )}

      {/* Descriere */}
      {event.description && (
        <section className="bg-white py-16">
          <div className="max-w-[900px] mx-auto px-4">
            <div className="event-description" style={{ fontWeight: 300, fontSize: '16px', color: '#000', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: event.description }} />
          </div>
          <style>{`
            .event-description p { margin: 0 0 1em 0; }
            .event-description ul, .event-description ol { margin: 0 0 1em 1.5em; padding-left: 1.25em; }
            .event-description ul { list-style: disc; }
            .event-description ol { list-style: decimal; }
            .event-description li { margin: 0.25em 0; }
            .event-description h2 { font-size: 22px; font-weight: 500; margin: 1.5em 0 0.5em; color: #065ea6; }
            .event-description h3 { font-size: 18px; font-weight: 500; margin: 1.25em 0 0.5em; color: #065ea6; }
            .event-description a { color: #065ea6; text-decoration: underline; }
            .event-description blockquote { margin: 1em 0; padding: 0.5em 1em; border-left: 3px solid #065ea6; background: #f0f7ff; color: #374151; }
            .event-description strong { font-weight: 700; }
            .event-description em { font-style: italic; }
            .event-description img { max-width: 100%; height: auto; }
            .event-description table { border-collapse: collapse; margin: 1em 0; }
            .event-description table td, .event-description table th { border: 1px solid #e5e7eb; padding: 0.5em 0.75em; }
          `}</style>
        </section>
      )}

      {/* Speakers */}
      {event.speakers && event.speakers.length > 0 && (
        <section className="bg-white py-10">
          <div className="max-w-[1200px] mx-auto px-4 md:px-[120px] relative">
            <button onClick={() => scrollToSpeaker(activeSpeakerIdx - 1)} disabled={activeSpeakerIdx === 0} aria-label="Anterior" className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid #ccc', background: 'transparent', cursor: activeSpeakerIdx === 0 ? 'default' : 'pointer', opacity: activeSpeakerIdx === 0 ? 0.4 : 1 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 2L4 8L10 14" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => scrollToSpeaker(activeSpeakerIdx - 1)} disabled={activeSpeakerIdx === 0} aria-label="Anterior" className="absolute left-2 top-[170px] z-10 flex md:hidden items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.85)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', cursor: activeSpeakerIdx === 0 ? 'default' : 'pointer', opacity: activeSpeakerIdx === 0 ? 0.4 : 1 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 2L4 8L10 14" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div ref={speakersRef} className="flex gap-[30px] overflow-x-auto speakers-track" style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
              {event.speakers.map(sp => <DoctorCard key={sp.id} speaker={sp} />)}
            </div>
            <button onClick={() => scrollToSpeaker(activeSpeakerIdx + 1)} disabled={activeSpeakerIdx === (event.speakers!.length - 1)} aria-label="Următor" className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid #ccc', background: 'transparent', cursor: activeSpeakerIdx === (event.speakers!.length - 1) ? 'default' : 'pointer', opacity: activeSpeakerIdx === (event.speakers!.length - 1) ? 0.4 : 1 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 2L12 8L6 14" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => scrollToSpeaker(activeSpeakerIdx + 1)} disabled={activeSpeakerIdx === (event.speakers!.length - 1)} aria-label="Următor" className="absolute right-2 top-[170px] z-10 flex md:hidden items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.85)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', cursor: activeSpeakerIdx === (event.speakers!.length - 1) ? 'default' : 'pointer', opacity: activeSpeakerIdx === (event.speakers!.length - 1) ? 0.4 : 1 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 2L12 8L6 14" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          {event.speakers.length > 1 && (
            <div className="flex md:hidden justify-center items-center gap-2 mt-5">
              {event.speakers.map((_, i) => (
                <button key={i} onClick={() => scrollToSpeaker(i)} aria-label={`Vorbitor ${i + 1}`} style={{ width: i === activeSpeakerIdx ? '22px' : '8px', height: '8px', borderRadius: '4px', border: 'none', background: i === activeSpeakerIdx ? '#065EA6' : '#cbd5e1', padding: 0, cursor: 'pointer', transition: 'all 0.2s' }} />
              ))}
            </div>
          )}
          <style>{`
            .speakers-track::-webkit-scrollbar{display:none}
            .speaker-card{ width: 306px; }
            @media (max-width: 767px){
              .speakers-track{ padding-left: calc(50vw - 153px); padding-right: calc(50vw - 153px); }
            }
          `}</style>
        </section>
      )}

      {/* Program */}
      {event.sessions && event.sessions.length > 0 && (() => {
        const dayCount = isMultiDay ? Math.round((endDate!.getTime() - date.getTime()) / 86400000) + 1 : 1
        const sessionsByDay: Record<number, typeof event.sessions> = {}
        event.sessions.forEach(s => { const d = s.day_index || 0; (sessionsByDay[d] ||= []).push(s) })
        const dayHeader = (di: number) => {
          const d = new Date(date.getTime()); d.setDate(date.getDate() + di)
          return d.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
        }
        return (
          <section className="bg-white py-12">
            <div className="max-w-[900px] mx-auto px-4">
              <h2 className="text-center mb-8" style={{ fontWeight: 300, fontSize: '28px', color: '#000' }}>Program</h2>
              {Array.from({ length: dayCount }, (_, di) => {
                const sessions = sessionsByDay[di] || []
                if (!sessions.length) return null
                return (
                  <div key={di} style={{ marginBottom: di < dayCount - 1 ? '2.5rem' : 0 }}>
                    {dayCount > 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', margin: '0 0 1.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '12px', color: '#fff', background: '#065EA6', padding: '0.25rem 0.75rem', borderRadius: '20px', letterSpacing: '0.08em' }}>ZIUA {di + 1}</span>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#065EA6', letterSpacing: '0.05em' }}>{dayHeader(di)}</span>
                      </div>
                    )}
                    {dayCount === 1 && <p className="text-center mb-8" style={{ fontWeight: 700, fontSize: '16px', color: '#065EA6', letterSpacing: '0.05em' }}>{dayHeader(di)}</p>}
                    <div>
                      {sessions.map((s, i) => (
                        <div key={s.id} className="flex items-start gap-4 px-6 py-4" style={{ borderBottom: i < sessions.length - 1 ? '3px solid #065EA6' : 'none', background: '#fff' }}>
                          <span style={{ fontWeight: 400, fontSize: '13px', color: '#065EA6', minWidth: '110px', flexShrink: 0 }}>{s.time_label}</span>
                          <div>
                            <p style={{ fontWeight: 400, fontSize: '13px', color: '#065EA6', margin: 0 }}>{s.title}</p>
                            {s.items?.map(item => <p key={item.id} style={{ fontWeight: 300, fontSize: '13px', color: '#000', margin: '4px 0 0' }}>{item.content}</p>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })()}

      {/* Form inscriere / mesaj locuri epuizate */}
      <section className="bg-white py-12" id="inscriere">
        <div className="max-w-[900px] mx-auto px-4">
          <div style={{ background: 'transparent', padding: '2.5rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
            {event.show_fully_booked_message && event.fully_booked_message ? (
              <div style={{ background: '#fff8e1', border: '1px solid #f5d96b', borderRadius: '20px', padding: '2rem', textAlign: 'center', color: '#7a5d00', whiteSpace: 'pre-line', fontWeight: 400, fontSize: '1.05rem', lineHeight: 1.6 }}>
                {event.fully_booked_message}
              </div>
            ) : (<>
            <h3 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#000', marginBottom: '2rem', textAlign: 'center' }}>Înscrie-te</h3>
            {submitted ? (
              <div style={{ background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '25px', padding: '2rem', textAlign: 'center', fontFamily: '"Roboto",sans-serif' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 400, marginBottom: '0.5rem' }}>Cererea ta a fost înregistrată cu succes!</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 300 }}>Vei fi contactat în curând cu detalii despre eveniment.</div>
              </div>
            ) : user ? (
              <div style={{ textAlign: 'center' }}>
                {submitError && <div style={{ background: '#fde8e8', color: '#c53030', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>{submitError}</div>}
                <button
                  onClick={handleRegister}
                  disabled={submitting}
                  style={{ background: '#065EA6', border: 'none', borderRadius: '50px', color: '#fff', padding: '0.75rem 3rem', fontSize: '1.1rem', fontWeight: 300, cursor: 'pointer', minWidth: '200px', fontFamily: '"Roboto",sans-serif', boxShadow: '0 4px 15px rgba(6,94,166,0.3)', opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? 'Se trimite...' : 'Înscrie-te'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister}>
                {/* Honeypot — must stay empty */}
                <input name="website" type="text" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} aria-hidden="true" />
                {submitError && <div style={{ background: '#fde8e8', color: '#c53030', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>{submitError}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input style={inp} placeholder="Prenume *" required value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} />
                  <input style={inp} placeholder="Nume *" required value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))} />
                  <input type="email" style={inp} placeholder="E-Mail *" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                  <input type="tel" style={inp} placeholder="Telefon" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                  <select style={sel} value={form.professional_grade} onChange={e => setForm(p => ({ ...p, professional_grade: e.target.value }))}>
                    <option value="" disabled>Grad profesional</option>
                    <option value="medic-primar">Medic primar</option>
                    <option value="medic-specialist">Medic specialist</option>
                    <option value="medic-rezident">Medic rezident</option>
                    <option value="student">Student</option>
                  </select>
                  <select style={sel} value={form.specialty} onChange={e => setForm(p => ({ ...p, specialty: e.target.value }))}>
                    <option value="" disabled>Specialitate</option>
                    <option value="cardiologie">Cardiologie</option>
                    <option value="chirurgie">Chirurgie cardiovasculară</option>
                    <option value="rezidenti">Rezidenți</option>
                    <option value="alta">Altă specialitate</option>
                  </select>
                  {showCuim && (
                    <input style={{ ...inp, gridColumn: '1 / -1' }} placeholder="Cod Unic de Identificare Medic (CUIM) *" required value={form.cuim} onChange={e => setForm(p => ({ ...p, cuim: e.target.value }))} />
                  )}
                </div>
                <div className="flex items-start gap-3 mt-6 px-1">
                  <input type="checkbox" id="terms" required style={{ marginTop: '3px', accentColor: '#065EA6', width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }} />
                  <label htmlFor="terms" style={{ fontFamily: '"Roboto",sans-serif', fontWeight: 300, fontSize: '0.85rem', color: '#414042', lineHeight: 1.5, cursor: 'pointer' }}>
                    Am citit și sunt de acord cu{' '}
                    <Link href="/termeni-si-conditii" target="_blank" style={{ color: '#065EA6', textDecoration: 'underline' }}>
                      Termenii și Condițiile
                    </Link>
                  </label>
                </div>
                <div className="flex justify-center mt-4">
                  <button type="submit" disabled={submitting} style={{ background: '#065EA6', border: 'none', borderRadius: '50px', color: '#fff', padding: '0.5rem 2rem', fontSize: '1.1rem', fontWeight: 300, cursor: 'pointer', minWidth: '200px', fontFamily: '"Roboto",sans-serif', boxShadow: '0 4px 15px rgba(6,94,166,0.3)', opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? 'Se trimite...' : 'Trimite'}
                  </button>
                </div>
              </form>
            )}
            </>)}
          </div>
        </div>
      </section>

      <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.18); } }`}</style>
    </main>
  )
}
