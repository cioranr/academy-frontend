'use client'

import Image from 'next/image'
import Link from 'next/link'

interface EventItem {
  bgImage: string
  subtitlu: string
  descriere: string
  data: string
  locatie: string
  locatieExtra?: string
  zi: string
  luna: string
  emcPoints: number
  href: string
}

const EVENTS: EventItem[] = [
  {
    bgImage: '/calendar-1.png',
    subtitlu: 'TAVI',
    descriere: 'ABORDARE AVANSATĂ ȘI OPTIMIZAREA REZULTATELOR, DE LA ANATOMIE LA IMPLANTARE',
    data: '13 Martie 2026',
    locatie: 'MONZA ARES ACADEMY',
    locatieExtra: 'CLUJ-NAPOCA, HILTON CITY PLAZA HOTEL, SALA BALLROOM',
    zi: '31',
    luna: 'MARTIE',
    emcPoints: 6,
    href: '/workshop/tavi',
  },
  {
    bgImage: '/calendar2.png',
    subtitlu: '',
    descriere: 'DE ECOGRAFIE TRANSESOFAGIANĂ',
    data: '7 Aprilie 2026',
    locatie: 'MONZA ARES ACADEMY',
    locatieExtra: 'BUCUREȘTI SPITAL MONZA ARES',
    zi: '7',
    luna: 'APRILIE',
    emcPoints: 6,
    href: '/workshop/ecografie',
  },
  {
    bgImage: '/calendar-3.jpg',
    subtitlu: '',
    descriere: 'LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT',
    data: '22 Aprilie 2026',
    locatie: 'MONZA ARES ACADEMY',
    locatieExtra: 'BUCUREȘTI SPITAL MONZA ARES',
    zi: '22',
    luna: 'APRILIE',
    emcPoints: 6,
    href: '/workshop/lorem',
  },
]

function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="bg-[#F7F7F7] w-full max-w-[1000px]   pb-6 mb-10" style={{ borderRadius: '0 0 50px 50px' }}>

      {/* Imagine background cu titlu overlay */}
      <div className="relative w-full mb-4" style={{ height: '300px' }}>
        <Image src={event.bgImage} alt="Workshop" fill quality={85} className="object-cover object-center" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-[100px]">
          {/* Workshop */}
          <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 400, fontSize: 'clamp(60px, 8vw, 100px)', color: '#065EA6', lineHeight: 0.9, display: 'flex', justifyContent: 'flex-end', width: '100%', paddingRight: '2rem' }}>
            Workshop
          </div>
          {/* Interactiv + subtitlu */}
          <div className="flex items-center gap-4 w-full ">
            <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 500, fontSize: 'clamp(40px, 6vw, 80px)', color: '#065EA6', lineHeight: 1 }}>
              Interactiv
            </span>
            {event.subtitlu && (
              <span style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 'clamp(40px, 6vw, 80px)', color: '#065EA6', lineHeight: 1 }}>
                {event.subtitlu}
              </span>
            )}
          </div>
          {/* Separator */}
          <div style={{ borderTop: '1px solid #065EA6', width: 'calc(100% - 4rem)', margin: '10px 2rem' }} />
          {/* Descriere */}
          <p className="text-center px-8" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400, fontSize: '28px', color: '#065EA6' }}>
            {event.descriere}
          </p>
        </div>
      </div>

      {/* Data */}
      <p className="text-center mb-2 px-5" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '15px', color: '#065EA6' }}>
        {event.data}
      </p>

      {/* Text scurt */}
      <p className="text-center mb-6 px-[100px]" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '14px', color: '#000', lineHeight: 1.7 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet quam eu tortor molestie consectetur.
        Proin ullamcorper nisi eget dolor fermentum, a tempus enim luctus.
      </p>

      {/* 3 căsuțe — identic FeaturedWorkshop */}
      <div className="flex items-center gap-4 mb-6 px-[100px]">

        {/* 1 — albastru locatie */}
        <div className="flex-1 flex items-center justify-center text-center" style={{ background: '#065EA6', height: '150px' }}>
          <div>
            <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '13px', color: '#fff', lineHeight: 1.5, textTransform: 'uppercase', margin: 0 }}>
              {event.locatie}
            </p>
            {event.locatieExtra && (
              <>
                <div style={{ borderTop: '1px solid #fff', margin: '4px 0' }} />
                <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400, fontSize: '11px', color: '#fff', margin: 0, lineHeight: 1.4, textTransform: 'uppercase' }}>
                  {event.locatieExtra}
                </p>
              </>
            )}
          </div>
        </div>

        {/* 2 — alb zi */}
        <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ background: '#ffffff', height: '150px' }}>
          <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '46px', color: '#065EA6', lineHeight: 1, margin: 0 }}>
            {event.zi}
          </p>
          <div style={{ borderTop: '1px solid #065EA6', margin: '4px 0', width: '70%' }} />
          <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 800, fontSize: '15px', color: '#065EA6', letterSpacing: '0.08em', margin: 0 }}>
            {event.luna}
          </p>
        </div>

        {/* 3 — alb EMC */}
        <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ background: '#ffffff', height: '150px' }}>
          <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '46px', color: '#065EA6', lineHeight: 1, margin: 0 }}>
            {event.emcPoints}
          </p>
          <div style={{ borderTop: '1px solid #065EA6', margin: '4px 0', width: '70%' }} />
          <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 800, fontSize: '15px', color: '#065EA6', lineHeight: 1.5, margin: 0 }}>
            CURS CREDITAT<br />CU {event.emcPoints} PUNCTE EMC
          </p>
        </div>

      </div>

      {/* Link vezi mai multe */}
      <Link href={event.href} className="flex items-center gap-2 no-underline px-[100]" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400, fontSize: '14px', color: '#065EA6' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="8.44" height="15.62" viewBox="0 0 8.44 15.62">
          <path fill="#065EA6" d="M.19.19C-.06.44-.06.85.19,1.1l6.71,6.71L.19,14.52c-.25.25-.25.66,0,.91.25.25.66.25.91,0l7.15-7.15c.13-.13.19-.3.19-.47,0-.17-.06-.34-.19-.47L1.1.19C.85-.06.44-.06.19.19Z" />
        </svg>
        Vezi mai multe
      </Link>

    </div>
  )
}

export default function CalendarPage() {
  return (
    <main style={{ background: '#ecffff', fontFamily: '"Roboto", sans-serif', minHeight: '100vh' }}>

      {/* Titlu */}
      <div className="max-w-[1000px] mx-auto px-4 pt-12 pb-6">
        <h1 style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '32px', color: '#6D6E71', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
          Calendar
        </h1>
      </div>

      {/* Evenimente */}
      <div className="max-w-[1000px] mx-auto px-4 pb-16">
        {EVENTS.map((event, i) => (
          <EventCard key={i} event={event} />
        ))}
      </div>

    </main>
  )
}
