'use client'
import { use, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getVideoResourceBySlug, storageUrl } from '@/lib/api'
import type { Doctor, VideoResource } from '@/types'

function extractYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}
function extractVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="flex flex-col doctor-card" style={{ background: '#f5f5f5', height: '420px', flexShrink: 0, scrollSnapAlign: 'center', width: '280px' }}>
      <div className="relative overflow-hidden" style={{ height: '300px' }}>
        {doctor.image
          ? <Image src={storageUrl(doctor.image) ?? doctor.image} alt={doctor.name} fill quality={75} className="object-cover object-top" sizes="280px" unoptimized={!!storageUrl(doctor.image)} />
          : <div style={{ width: '100%', height: '100%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg></div>
        }
      </div>
      <div className="p-4" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontFamily: '"Roboto",sans-serif', fontWeight: 400, fontSize: '18px', color: '#000', margin: '0 0 4px' }}>{doctor.name}</h2>
        {doctor.specialty && <p style={{ fontFamily: '"Roboto",sans-serif', fontWeight: 300, fontSize: '13px', color: '#414042', margin: 0, lineHeight: 1.4 }}>{doctor.specialty}</p>}
      </div>
    </div>
  )
}

export default function VideoResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [resource, setResource] = useState<VideoResource | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    getVideoResourceBySlug(slug)
      .then(setResource)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    const onScroll = () => {
      const cards = el.querySelectorAll<HTMLElement>('.doctor-card')
      if (!cards.length) return
      const center = el.scrollLeft + el.clientWidth / 2
      let bestIdx = 0, bestDist = Infinity
      cards.forEach((c, i) => {
        const cardCenter = c.offsetLeft + c.offsetWidth / 2
        const dist = Math.abs(cardCenter - center)
        if (dist < bestDist) { bestDist = dist; bestIdx = i }
      })
      setActiveIdx(bestIdx)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [resource?.doctors?.length])

  const scrollTo = (idx: number) => {
    const el = carouselRef.current
    if (!el) return
    const card = el.querySelectorAll<HTMLElement>('.doctor-card')[idx]
    if (!card) return
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: 'smooth' })
  }

  if (loading) return (
    <main style={{ background: '#ecffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Roboto",sans-serif', color: '#065EA6', fontWeight: 300 }}>
      Se încarcă...
    </main>
  )

  if (notFound || !resource) return (
    <main style={{ background: '#ecffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', fontFamily: '"Roboto",sans-serif' }}>
        <h1 style={{ color: '#065EA6', fontWeight: 300 }}>Resursa nu a fost găsită</h1>
        <Link href="/" style={{ color: '#065EA6' }}>← Pagina principală</Link>
      </div>
    </main>
  )

  const youtubeId = resource.video_embed ? extractYoutubeId(resource.video_embed) : null
  const vimeoId   = resource.video_embed && !youtubeId ? extractVimeoId(resource.video_embed) : null
  const videoFile = storageUrl(resource.video_path)
  const doctors   = resource.doctors || []

  return (
    <main style={{ background: '#fff', fontFamily: '"Roboto",sans-serif', minHeight: '100vh' }}>
      <section style={{ background: '#ecffff', padding: '3rem 1rem 2rem' }}>
        <div className="max-w-[900px] mx-auto">
          <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 500, fontSize: 'clamp(32px, 5vw, 48px)', color: '#065EA6', lineHeight: 1.1, margin: 0, textAlign: 'center' }}>
            {resource.title}
          </h1>
          {resource.short_description && (
            <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400, fontSize: '15px', color: '#065EA6', textAlign: 'center', marginTop: '1rem', lineHeight: 1.5 }}>
              {resource.short_description}
            </p>
          )}
        </div>
      </section>

      {(videoFile || youtubeId || vimeoId) && (
        <section style={{ background: '#000', padding: 0 }}>
          <div className="max-w-[1100px] mx-auto" style={{ aspectRatio: '16 / 9', position: 'relative' }}>
            {videoFile ? (
              <video src={videoFile} controls playsInline style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
            ) : youtubeId ? (
              <iframe src={`https://www.youtube.com/embed/${youtubeId}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : (
              <iframe src={`https://player.vimeo.com/video/${vimeoId}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
            )}
          </div>
        </section>
      )}

      {resource.content && (
        <section className="bg-white py-12">
          <div className="max-w-[900px] mx-auto px-4">
            <div className="event-description" style={{ fontWeight: 300, fontSize: '16px', color: '#000', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: resource.content }} />
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
            `}</style>
          </div>
        </section>
      )}

      {doctors.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-[1100px] mx-auto px-4 relative">
            <h2 className="text-center" style={{ fontWeight: 300, fontSize: '24px', color: '#000', margin: '0 0 1.5rem' }}>
              {doctors.length === 1 ? 'Autor' : 'Autori'}
            </h2>

            <button
              onClick={() => scrollTo(activeIdx - 1)}
              disabled={activeIdx === 0}
              aria-label="Anterior"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center"
              style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1px solid #ccc', background: 'transparent', cursor: activeIdx === 0 ? 'default' : 'pointer', opacity: activeIdx === 0 ? 0.4 : 1 }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 2L4 8L10 14" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            <div ref={carouselRef} className="flex gap-[24px] overflow-x-auto doctors-track" style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
              {doctors.map(d => <DoctorCard key={d.id} doctor={d} />)}
            </div>

            <button
              onClick={() => scrollTo(activeIdx + 1)}
              disabled={activeIdx === doctors.length - 1}
              aria-label="Următor"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center"
              style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1px solid #ccc', background: 'transparent', cursor: activeIdx === doctors.length - 1 ? 'default' : 'pointer', opacity: activeIdx === doctors.length - 1 ? 0.4 : 1 }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 2L12 8L6 14" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            {doctors.length > 1 && (
              <div className="flex justify-center items-center gap-2 mt-5">
                {doctors.map((_, i) => (
                  <button key={i} onClick={() => scrollTo(i)} aria-label={`Doctor ${i + 1}`} style={{ width: i === activeIdx ? '22px' : '8px', height: '8px', borderRadius: '4px', border: 'none', background: i === activeIdx ? '#065EA6' : '#cbd5e1', padding: 0, cursor: 'pointer', transition: 'all 0.2s' }} />
                ))}
              </div>
            )}

            <style>{`
              .doctors-track::-webkit-scrollbar{display:none}
              @media (max-width: 767px){
                .doctors-track{ padding-left: calc(50vw - 140px); padding-right: calc(50vw - 140px); }
              }
            `}</style>
          </div>
        </section>
      )}
    </main>
  )
}
