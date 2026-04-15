// components/sections/Testimonial.tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { BackendTestimonial } from '@/types'
import { storageUrl } from '@/lib/api'

interface TestimonialProps {
  data?: BackendTestimonial[] | null
}

function extractYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

function TestimonialCard({ t }: { t: BackendTestimonial }) {
  const doctorName    = t.doctor_name
  const quote         = t.quote
  const workshopTitle = t.workshop_title
  const workshopHref  = t.workshop_href
  const videoSrc      = storageUrl(t.video)
  const imageSrc      = storageUrl(t.image) ?? '/testimonial.png'
  const youtubeId     = t.youtube_url ? extractYoutubeId(t.youtube_url) : null

  return (
    <div style={{ borderRadius: '20px 20px 0 0', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

      {/* Media: YouTube > video > image */}
      {youtubeId ? (
        <div className="relative w-full" style={{ paddingBottom: '56.25%', background: '#000', position: 'relative' }}>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : videoSrc ? (
        <div className="relative w-full" style={{ height: '380px', background: '#000' }}>
          <video
            src={videoSrc}
            controls
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div className="relative w-full" style={{ height: '380px' }}>
          <Image
            src={imageSrc}
            alt={doctorName}
            fill
            quality={90}
            loading="eager"
            className="object-cover object-top"
            unoptimized={imageSrc.startsWith('http')}
          />
        </div>
      )}

      {/* Text */}
      <div className="px-8 py-8" style={{ background: '#f7f7f7' }}>
        <p
          className="mb-3"
          style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 500, fontSize: '16px', color: '#065EA6' }}
        >
          {doctorName}
        </p>
        <p
          className="mb-6"
          style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '16px', color: '#000', lineHeight: 1.6 }}
        >
          {quote}
        </p>
        {workshopTitle && workshopHref && (
          <Link
            href={workshopHref}
            className="flex items-center gap-2 no-underline"
            style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '16px', color: '#000' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 2L11 8L5 14" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {workshopTitle}
          </Link>
        )}
      </div>

    </div>
  )
}

export function Testimonial({ data }: TestimonialProps) {
  const active = (data ?? []).filter(t => t.active)
  const [current, setCurrent] = useState(0)

  // Fallback when no data
  if (!active.length) {
    const fallback: BackendTestimonial = {
      id: 0, title: 'Testimonial',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      doctor_name: 'Dr. Ionescu Popescu',
      quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet quam eu tortor molestie consectetur.',
      workshop_title: 'Workshop Interactiv X', workshop_href: '/workshop',
      image: null, video: null, youtube_url: null,
      active: true, order: 0, created_at: '', updated_at: '',
    }
    active.push(fallback)
  }

  const t = active[current]
  const subtitle = t.subtitle ?? ''

  return (
    <section className="bg-white py-16">
      <div className="max-w-[900px] mx-auto px-4">

        {/* Title + subtitle */}
        <h2
          className="text-center mb-4"
          style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '28px', color: '#000' }}
        >
          Testimonial
        </h2>
        {subtitle && (
          <p
            className="text-center mb-10"
            style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '16px', color: '#000' }}
          >
            {subtitle}
          </p>
        )}

        {/* Card */}
        <TestimonialCard t={t} />

        {/* Navigation dots (only when multiple) */}
        {active.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '1.5rem' }}>
            {active.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Testimonial ${i + 1}`}
                style={{
                  width: i === current ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  border: 'none',
                  background: i === current ? '#065EA6' : '#D1D5DB',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 0.2s, background 0.2s',
                }}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
