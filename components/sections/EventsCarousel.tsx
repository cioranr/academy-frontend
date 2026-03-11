'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { storageUrl } from '@/lib/api'
import type { BackendEvent } from '@/types'

const FALLBACK_ITEMS = [
  { image: '/slide1.png', title: 'Monitorizarea ritmului inimii 24h', href: '/calendar' },
  { image: '/slide2.png', title: 'Implantare stimulator', href: '/calendar' },
  { image: '/slide3.jpeg', title: 'Ce este Monza Ares Help?', href: '/calendar' },
]

interface EventsCarouselProps {
  events?: BackendEvent[]
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="8.44" height="15.62" viewBox="0 0 8.44 15.62">
      <path fill="#065EA6" d="M.19.19C-.06.44-.06.85.19,1.1l6.71,6.71L.19,14.52c-.25.25-.25.66,0,.91.25.25.66.25.91,0l7.15-7.15c.13-.13.19-.3.19-.47,0-.17-.06-.34-.19-.47L1.1.19C.85-.06.44-.06.19.19Z" />
    </svg>
  )
}

export function EventsCarousel({ events }: EventsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const SLIDE_WIDTH = 338 + 30

  const slides = events && events.length > 0
    ? events.map(ev => ({
        image: storageUrl(ev.image_small ?? ev.image) ?? '/slide1.png',
        title: ev.title,
        date: ev.date ? new Date(ev.date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
        href: `/events/${ev.slug}`,
      }))
    : FALLBACK_ITEMS.map(i => ({ ...i, date: '' }))

  return (
    <section className="w-full py-10 bg-white">
      <div className="max-w-[1200px] mx-auto px-[120px] relative">

        <h2 className="text-center pb-5" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '28px', color: '#000', marginBottom: '24px' }}>
          Vezi următoarele conferințe și workshopuri programate
        </h2>

        {/* Prev */}
        <button
          onClick={() => trackRef.current?.scrollBy({ left: -SLIDE_WIDTH, behavior: 'smooth' })}
          aria-label="Previous slide"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center"
          style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 2L4 8L10 14" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Track */}
        <div
          ref={trackRef}
          className="flex gap-[30px] overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}
        >
          {slides.map((item, i) => (
            <div key={i} className="flex-shrink-0" style={{ width: '300px', height: '400px', scrollSnapAlign: 'start' }}>
              <div className="flex flex-col h-full" style={{ background: '#f5f5f5' }}>
                <div className="relative overflow-hidden" style={{ height: '300px' }}>
                  <Image src={item.image} alt={item.title} fill quality={75} className="object-cover object-top" sizes="150px" unoptimized={item.image.startsWith('http')} />
                </div>
                <div className="p-5" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '18px', color: '#000', margin: '0 0 4px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {item.title}
                    </h2>
                    {item.date && (
                      <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '12px', color: '#6D6E71', margin: 0 }}>
                        {item.date}
                      </p>
                    )}
                  </div>
                  <Link href={item.href} className="flex justify-start ml-1">
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => trackRef.current?.scrollBy({ left: SLIDE_WIDTH, behavior: 'smooth' })}
          aria-label="Next slide"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center"
          style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 2L12 8L6 14" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Mobile */}
        <div className="flex md:hidden justify-center gap-4 mt-4">
          <button onClick={() => trackRef.current?.scrollBy({ left: -SLIDE_WIDTH, behavior: 'smooth' })} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid #ccc', background: 'transparent' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 2L4 8L10 14" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <button onClick={() => trackRef.current?.scrollBy({ left: SLIDE_WIDTH, behavior: 'smooth' })} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid #ccc', background: 'transparent' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 2L12 8L6 14" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>

      </div>
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </section>
  )
}
