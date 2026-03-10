'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { InscriereForm } from '@/components/sections/InscriereForm'

// ─── Date mock ───────────────────────────────────────────────
const DOCTORI = [
  { image: '/Dr_Theodor_Cebotaru.webp', name: 'Dr. Theodor Cebotaru', specialitate: 'Medic primar Chirurgie Cardiovasculară', href: '/medici/dr-theodor-cebotaru' },
  { image: '/dr-2.jpg', name: 'Dr. Stanislav Rurac', specialitate: 'Medic primar Chirurgie cardiovasculară', href: '/medici/dr-stanislav-rurac' },
  { image: '/dr-3.jpg', name: 'Dr. Călin Popa', specialitate: 'Medic primar Chirurgie cardiovasculară\nChirurgie vasculară', href: '/medici/dr-calin-popa' },
  { image: '/dr-4.jpg', name: 'Dr. Andrei Eni', specialitate: 'Chirurgie vasculară', href: '/medici/dr-andrei-eni' },
]

const DIRECTORI = [
  { image: '/dr-1.jpg', name: 'Dr. Theodor Cebotaru', specialitate: 'Medic primar Chirurgie Cardiovasculară\nChirurgie cardiovasculară', href: '/medici/dr-theodor-cebotaru' },
  { image: '/dr-2.jpg', name: 'Dr. Stanislav Rurac', specialitate: 'Medic primar Chirurgie cardiovasculară\nChirurgie cardiovasculară', href: '/medici/dr-stanislav-rurac' },
]

const PROGRAM = [
  { ora: '08:30-09:00', titlu: 'REGISTRATION & COFFEE', items: [] },
  { ora: '09:00-10:30', titlu: 'SESIUNEA I', items: [
    'PROTOCOLUL DE EVALUARE PRE TAVI',
    'PREZENTAREA ÎN DETALIU A VALVEI SAPIEN',
    'ABORD FEMURAL ȘI ALTERNATIV ÎN TAVI CU VALVA SAPIEN',
    'TEHNICA TAVI MINIMALISTĂ',
  ]},
  { ora: '10:30-10:45', titlu: 'PAUZĂ DE CAFEA', items: [] },
  { ora: '10:45-12:45', titlu: 'SESIUNEA II', items: [
    'CAZ TAVI 1 LIVE',
    'ANALIZĂ COMENTATĂ A CAZULUI. TRANSMISIE LIVE. Q&A',
    'ATELIER HANDS-ON I – SIMULARE TAVI STEP-BY-STEP – CU FOCUS PE ROLE-PLAY DECIZIONAL',
    'TAVI ÎN BICUSPIDIA AORTICĂ',
    'TAVI ÎN SITUAȚII SPECIALE VIV, VIR, VIMAC',
  ]},
  { ora: '12:45-13:30', titlu: 'PAUZĂ DE MASĂ', items: [] },
  { ora: '13:30-15:30', titlu: 'SESIUNEA III', items: [
    'CAZ TAVI 2 LIVE',
    'ANALIZĂ COMENTATĂ A CAZULUI. TRANSMISIE LIVE. Q&A',
    'ATELIER HANDS-ON II – SIMULARE TAVI STEP-BY-STEP – CU FOCUS PE ROLE-PLAY DECIZIONAL',
    'REVASCULARIZAREA CORONARIANĂ LA PACIENȚI CU TAVI',
    'STENOZA AORTICĂ MODERATĂ – CÂND DEVINE TAVI O OPȚIUNE TERAPEUTICĂ',
  ]},
  { ora: '15:30-15:45', titlu: 'PAUZĂ DE CAFEA', items: [] },
  { ora: '15:45-17:45', titlu: 'SESIUNEA IV', items: [
    'CAZ TAVI 3 LIVE',
    'ANALIZĂ COMENTATĂ A CAZULUI. TRANSMISIE LIVE. Q&A',
    'ATELIER HANDS-ON II – SIMULARE TAVI STEP-BY-STEP – CU FOCUS PE ROLE-PLAY DECIZIONAL',
    'COMPLICAȚII ÎN TIMPUL ȘI DUPĂ TAVI',
    'DEBATE INTERACTIV: "TAVI PENTRU TOȚI" VS. "CHIRURGIE LA TINERI" - CUI DĂM DREPTATE?',
  ]},
  { ora: '17:45-18:00', titlu: 'CONCLUZII ȘI ÎNCHIDERE WORKSHOP', items: [] },
  { ora: '18:30', titlu: 'CINĂ', items: [] },
]

const SPECIALITATI = [
  { value: 'cardiologie', label: 'Cardiologie' },
  { value: 'chirurgie', label: 'Chirurgie cardiovasculară' },
  { value: 'rezidenti', label: 'Rezidenți' },
  { value: 'alta', label: 'Altă specialitate' },
]

// ─── Arrow icon ───────────────────────────────────────────────
function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="8.44" height="15.62" viewBox="0 0 8.44 15.62">
      <path fill="#065EA6" d="M.19.19C-.06.44-.06.85.19,1.1l6.71,6.71L.19,14.52c-.25.25-.25.66,0,.91.25.25.66.25.91,0l7.15-7.15c.13-.13.19-.3.19-.47,0-.17-.06-.34-.19-.47L1.1.19C.85-.06.44-.06.19.19Z" />
    </svg>
  )
}

// ─── Doctor Card — identic cu EventsCarousel ─────────────────
function DoctorCard({ image, name, specialitate, href }: { image: string; name: string; specialitate: string; href: string }) {
  return (
    <div className="flex flex-col" style={{ background: '#f5f5f5', height: '462px' }}>
      <div className="relative overflow-hidden" style={{ height: '340px', flexShrink: 0 }}>
        <Image src={image} alt={name} fill quality={75} className="object-cover object-top" sizes="306px" />
      </div>
      <div className="p-5" style={{ height: '122px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '22px', color: '#000', margin: '0 0 4px 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
            {name}
          </h2>
          <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '13px', color: '#414042', margin: 0, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {specialitate}
          </p>
        </div>
        <Link href={href} className="flex justify-start ml-1">
          <ArrowIcon />
        </Link>
      </div>
    </div>
  )
}



// ─── Pagina principală ────────────────────────────────────────
export default function WorkshopPage() {
  const doctoriRef = useRef<HTMLDivElement>(null)

  return (
    <main style={{ background: '#ecffff', fontFamily: '"Roboto", sans-serif' }}>

      {/* ── HERO ── */}
      <section style={{ background: '#ecffff', paddingTop: '40px', paddingBottom: '60px' }}>
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="flex justify-end max-w-[900px]" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 400, fontSize: 'clamp(80px, 12vw, 155px)', color: '#065EA6', lineHeight: 0.85, letterSpacing: '-3px' }}>
            Workshop
          </div>
          <div className="flex items-center gap-4 mb-4 ml-2">
            <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 400, fontSize: 'clamp(50px, 8vw, 115px)', color: '#065EA6', lineHeight: 1 }}>Interactiv</span>
            <span className=" " style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '115px', color: '#065EA6', lineHeight: 1 }}>TAVI</span>
          </div>
          <div style={{ borderTop: '1px solid #065EA6', marginBottom: '16px' }} />
          <p className="text-center mb-8" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400, fontSize: '20px', color: '#065EA6', lineHeight: 1.5 }}>
            ABORDARE AVANSATĂ ȘI OPTIMIZAREA REZULTATELOR,<br />
            DE LA ANATOMIE LA IMPLANTARE
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center justify-center text-center" style={{ background: '#065EA6', height: '120px' }}>
              <div>
                <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '14px', color: '#fff', lineHeight: 1.5, textTransform: 'uppercase', margin: 0 }}>CENTRUL<br />DE TRAINING</p>
                <div style={{ borderTop: '1px solid #fff', margin: '4px 0' }} />
                <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '12px', color: '#fff', margin: 0, textTransform: 'uppercase' }}>SPITALUL MONZA</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ background: '#fff', height: '120px' }}>
              <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '46px', color: '#065EA6', lineHeight: 1, margin: 0 }}>31</p>
              <div style={{ borderTop: '1px solid #065EA6', margin: '4px 0', width: '70%' }} />
              <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '12px', color: '#065EA6', margin: 0, letterSpacing: '0.08em' }}>OCTOMBRIE</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ background: '#fff', height: '120px' }}>
              <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '46px', color: '#065EA6', lineHeight: 1, margin: 0 }}>6</p>
              <div style={{ borderTop: '1px solid #065EA6', margin: '4px 0', width: '70%' }} />
              <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '12px', color: '#065EA6', margin: 0, lineHeight: 1.4 }}>CURS CREDITAT<br />CU 6 PUNCTE EMC</p>
            </div>
            <div className="flex-[1.5] flex items-center justify-center">
              <Image src="/device-tavi.png" alt="Dispozitiv TAVI" width={130} height={120} quality={90} className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pt-4">
        <div className="flex justify-center">
          <a href="#inscriere" className="inline-flex items-center gap-2 text-white rounded-full px-8 py-3 transition-all hover:-translate-y-px"
            style={{ background: '#065EA6', fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '13px' }}>
            Înscrie-te aici
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 4l5 5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </section>

      {/* ── DESCRIERE ── */}
      <section className="bg-white py-16">
        <div className="max-w-[900px] mx-auto px-4">
          <h2 className="text-center mb-6" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '28px', color: '#065EA6' }}>
            Workshop interactiv TAVI Edwards™<br />
            <span style={{ fontSize: '22px' }}>Abordare avansată și optimizarea rezultatelor de la anatomie la implantare</span>
          </h2>
          <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '16px', color: '#000', lineHeight: 1.8 }}>
            Vă invităm să participați la Workshopul Interactiv TAVI Edwards™, organizat în cadrul Monza ARES în data de 31 octombrie 2025, un eveniment dedicat medicilor interesați de abordarea avansată a cazurilor TAVI și optimizarea rezultatelor clinice în anatomii provocatoare.
          </p>
          <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '16px', color: '#000', lineHeight: 1.8, marginTop: '16px' }}>
            Acest workshop este construit ca un format intensiv, orientat spre practică, care îmbină analiza decizională, transmiterea de cazuri live, discuții interactive și simulări hands-on cu focus pe precizie, timing și anatomii dificile – așa cum le întâlnim în practica reală.
          </p>
        </div>
      </section>

      {/* ── DOCTORI SLIDER — identic cu EventsCarousel ── */}
      <section className="bg-white py-10">
        <div className="max-w-[1200px] mx-auto px-[120px] relative">

          {/* Buton Prev */}
          <button
            onClick={() => doctoriRef.current?.scrollBy({ left: -(306 + 30), behavior: 'smooth' })}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center"
            style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 2L4 8L10 14" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Track */}
          <div
            ref={doctoriRef}
            className="flex gap-[30px] overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}
          >
            {DOCTORI.map((d, i) => (
              <div key={i} className="flex-shrink-0" style={{ width: '306px', scrollSnapAlign: 'start' }}>
                <DoctorCard {...d} />
              </div>
            ))}
          </div>

          {/* Buton Next */}
          <button
            onClick={() => doctoriRef.current?.scrollBy({ left: 306 + 30, behavior: 'smooth' })}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center"
            style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2L12 8L6 14" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

        </div>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
      </section>

      {/* ── DE CE SĂ PARTICIPI ── */}
      <section className="bg-white py-12">
        <div className="max-w-[900px] mx-auto px-4">
          <h2 className="mb-6" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '28px', color: '#000' }}>
            De ce să participi:
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              'Pentru a înțelege cum evoluează paradigma indicațiilor TAVI',
              'Pentru a învăța cum să interpretezi imagistica multimodală în anatomii dificile',
              'Pentru a te familiariza cu algoritmul decizional în valve-in-valve și cazuri complexe',
              'Pentru a aprofunda strategiile moderne de prevenire și management al complicațiilor',
              'Pentru a participa la un atelier hands-on aplicat, bazat pe role-play decizional și simulare procedurală integrată',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 mb-3">
                <span style={{ color: '#065EA6', fontWeight: 700, marginTop: '2px' }}>•</span>
                <span style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '16px', color: '#000' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CUI I SE ADRESEAZĂ ── */}
      <section className="bg-white py-12">
        <div className="max-w-[900px] mx-auto px-4">
          <h2 className="mb-6" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '28px', color: '#000' }}>
            Cui i se adresează:
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              'Cardiologilor intervenționiști cu experiență, care doresc să își extindă practica către procedurile TAVI',
              'Cardiologilor intervenționiști early-career, interesați de aprofundarea etapelor de planificare și implantare valvulară',
              'Medicilor cardiologi înscriși în programul de pregătire pentru competența de cardiologie intervențională',
              'Cardiologilor clinicieni',
              'Rezidenților în cardiologie, care urmăresc o carieră în intervențiile structurale și vor să înțeleagă din timp cerințele specifice terapiei TAVI',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 mb-3">
                <span style={{ color: '#065EA6', fontWeight: 700, marginTop: '2px' }}>•</span>
                <span style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '16px', color: '#000' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CE VEI ÎNVĂȚA ── */}
      <section className="bg-white py-12">
        <div className="max-w-[900px] mx-auto px-4">
          <h2 className="mb-6" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '28px', color: '#000' }}>
            Ce vei învăța?
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              'Cum să evaluezi corect un pacient TAVI folosind imagistica multimodală',
              'Cum să alegi dispozitivul Edwards™ potrivit în funcție de anatomie',
              'Cum se desfășoară o procedură TAVI completă cu Edwards™ – de la pre-dilatare, navigație, poziționare, până la post-dilatare și optimizarea rezultatului',
              'Cum să identifici și să gestionezi complicațiile procedurale și post-procedurale',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 mb-3">
                <span style={{ color: '#065EA6', fontWeight: 700, marginTop: '2px' }}>•</span>
                <span style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '16px', color: '#000' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── DIRECTORI DE CURS ── */}
      <section className="bg-white py-12">
        <div className="max-w-[900px] mx-auto px-4">
          <h2 className="text-center mb-8" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '28px', color: '#000' }}>
            Directori de curs:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DIRECTORI.map((d, i) => (
              <DoctorCard key={i} {...d} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAM ── */}
      <section className="bg-white py-12">
        <div className="max-w-[900px] mx-auto px-4">
          <h2 className="text-center mb-2" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '28px', color: '#000' }}>
            Program
          </h2>
          <p className="text-center mb-8" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '16px', color: '#065EA6', letterSpacing: '0.05em' }}>
            VINERI 31 OCTOMBRIE
          </p>
          <div>
            {PROGRAM.map((row, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4" style={{ borderBottom: i < PROGRAM.length - 1 ? '3px solid #065EA6' : 'none', background: '#fff' }}>
                <span style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400, fontSize: '13px', color: '#065EA6', minWidth: '110px', flexShrink: 0 }}>
                  {row.ora}
                </span>
                <div>
                  <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400, fontSize: '13px', color: '#065EA6', margin: 0 }}>
                    {row.titlu}
                  </p>
                  {row.items.map((item, j) => (
                    <p key={j} style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '13px', color: '#000', margin: '4px 0 0 0' }}>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ÎNSCRIERE ── */}
      <section className="bg-white py-12" id="inscriere">
        <div className="max-w-[900px] mx-auto px-4">
          <InscriereForm />
        </div>
      </section>

    </main>
  )
}
