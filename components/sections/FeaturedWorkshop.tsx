'use client'

import Image from 'next/image'
import Link from 'next/link'
import { storageUrl } from '@/lib/api'
import type { BackendEvent } from '@/types'

interface FeaturedWorkshopProps {
  event?: BackendEvent | null
}

export function FeaturedWorkshop({ event }: FeaturedWorkshopProps) {
  const startDate = event?.date ? new Date(event.date) : null
  const endDate   = event?.end_date ? new Date(event.end_date) : null
  const isMultiDay = !!(endDate && startDate && endDate.getTime() > startDate.getTime())

  const dayDisplay = startDate
    ? (isMultiDay ? `${startDate.getDate()}-${endDate!.getDate()}` : String(startDate.getDate()))
    : '31'
  const monthDisplay = startDate
    ? (isMultiDay && startDate.getMonth() !== endDate!.getMonth()
        ? `${startDate.toLocaleDateString('ro-RO', { month: 'short' }).toUpperCase()}-${endDate!.toLocaleDateString('ro-RO', { month: 'short' }).toUpperCase()}`
        : startDate.toLocaleDateString('ro-RO', { month: 'long' }).toUpperCase())
    : 'OCTOMBRIE'

  const emcPoints    = event?.credits ?? null
  const subtitle     = event?.subtitle ?? ''
  const eventSlug    = event?.slug ?? 'workshop-interactiv-tavi'
  const creditsLabel = event?.credits_label ?? (emcPoints ? `CURS CREDITAT CU ${emcPoints} PUNCTE EMC` : '')
  const imageUrl     = storageUrl(event?.image)
  const imageBig     = storageUrl(event?.image_big)
  const imageSmall   = storageUrl(event?.image_small)

  return (
    <section className="relative z-10 w-full" >
      <div className="max-w-[1200px] mx-auto px-4 pt-6 pb-8 relative">

        {/* Main grid: title (left), info (mid), images (right) */}
        <div className="md:grid md:gap-6 md:items-center" style={{ gridTemplateColumns: 'minmax(0, 1.6fr) auto minmax(0, 1.1fr)' }}>

          {/* TITLE BLOCK */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 500, fontSize: 'clamp(48px, 8vw, 96px)', color: '#065ea6', lineHeight: 0.95, letterSpacing: '-4px' }}>
              Workshop
            </div>
            <div className="flex flex-wrap items-baseline gap-x-3" style={{ marginTop: '4px' }}>
              <div style={{
                borderBottom: '2px solid #065ea6'
              }}>
                <span style={{  fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 500, fontSize: 'clamp(28px, 4.5vw, 52px)', color: '#065ea6', lineHeight: 1, letterSpacing: '-3px' }}>
                  Interactiv:
                </span>
                {event?.title && (
                  <span style={{ marginLeft: '10px',fontFamily: '"Roboto", sans-serif', fontWeight: 800, fontSize: 'clamp(16px, 3.2vw, 28px)', color: '#065ea6', lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '0.01em' }}>
                    {event.title}
                  </span>
                )}
              </div>
            </div>
            {subtitle && (
                <div style={{
                  borderBottom: '2px solid #065ea6', textAlign: 'center'
                }}>
                  <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400, fontSize: 'clamp(11px, 1.4vw, 15px)', color: '#065ea6', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.4 }}>
                    {subtitle.split('\n').map((line, i, arr) => (
                      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                    ))}
                  </p>
                </div>
            )}
          </div>

          {/* INFO STACK (date + emc) */}
          <div className="flex md:flex-col gap-3 md:gap-4 mt-5 md:mt-0 pr-5" style={{ borderRight: '2px solid #065ea6' }}>
            <div className="flex-1 md:flex-none flex flex-col items-center justify-center text-left" style={{ aspectRatio: '1/1', background: '#065ea6', color: '#fff', padding: '8px', minHeight: '88px', width: '120px' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', lineHeight: 1.1, letterSpacing: '0.05em', width: '100%'}}>MONZA ARES<br />ACADEMY</div>
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
            <div className="flex-1 relative h-full" style={{ background: '#fff', overflow: 'hidden' }}>
              <Image
                  src={imageUrl ?? '/device-tavi.png'}
                  alt={event?.title ?? ''}
                  fill
                  className="object-contain"
                  quality={90}
                  unoptimized={!!imageUrl}
              />
              </div>
          </div>

        </div>

        {/* Buton */}
        <div className="flex justify-center mt-6">
          <Link
            href={'/events/' + eventSlug}
            className="inline-flex items-center gap-2 text-white rounded-full px-8 py-2 transition-all hover:-translate-y-px"
            style={{ background: '#065ea6', fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '13px' }}
          >
            Înscrie-te aici
          </Link>
        </div>

      </div>
    </section>
  )
}
