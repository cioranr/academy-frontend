'use client'

import { useState } from 'react'
import Image from 'next/image'
import { InscriereForm } from '@/components/sections/InscriereForm'
import { storageUrl } from '@/lib/api'
import type { BackendEvent } from '@/types'

interface FeaturedWorkshopProps {
  event?: BackendEvent | null
}

export function FeaturedWorkshop({ event }: FeaturedWorkshopProps) {
  const [formOpen, setFormOpen] = useState(false)

  // Derive display values from event, fall back to defaults
  const date       = event?.date ? new Date(event.date).getDate().toString() : '31'
  const month      = event?.date
    ? new Date(event.date).toLocaleDateString('ro-RO', { month: 'long' }).toUpperCase()
    : 'OCTOMBRIE'
  const emcPoints  = event?.credits ?? 6
  const subtitle   = event?.subtitle ?? 'ABORDARE AVANSATĂ ȘI OPTIMIZAREA REZULTATELOR,\nDE LA ANATOMIE LA IMPLANTARE'
  const location   = event?.location ?? 'CENTRUL DE TRAINING'
  const venue      = event?.venue ?? 'SPITALUL MONZA'
  const eventSlug    = event?.slug ?? 'workshop-interactiv-tavi'
  const creditsLabel = event?.credits_label ?? `CURS CREDITAT CU ${emcPoints} PUNCTE EMC`
  const imageUrl     = storageUrl(event?.image)

  return (
    <section className="relative z-10 pb-10 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center">

          {/* Card gri */}
          <div
            className="bg-[#F7F7F7] w-full max-w-[1000px] px-8 pt-6 pb-6"
            style={{ marginTop: '-60px', borderRadius: '0 0 25px 25px' }}
          >

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
                  {date}
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
        </div>

        {/* Buton + Form */}
        <div className="flex flex-col items-center mt-5">
          <a
            onClick={() => setFormOpen(v => !v)}
            className="inline-flex items-center gap-2 text-white rounded-full px-8 py-2 transition-all hover:-translate-y-px cursor-pointer"
            style={{ background: '#065EA6', fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '13px' }}
          >
            Înscrie-te aici
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 4l5 5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </a>

          {formOpen && <InscriereForm eventSlug={eventSlug} />}
        </div>

      </div>
    </section>
  )
}
