'use client'

import { useState } from 'react'
import Image from 'next/image'
import { InscriereForm } from '@/components/sections/InscriereForm'


interface FeaturedWorkshopProps {
  description?: string
  date?: string
  month?: string
  emcPoints?: number
  deviceImage?: string
  taviImage?: string
}

export function FeaturedWorkshop({
  description = 'ABORDARE AVANSATĂ ȘI OPTIMIZAREA REZULTATELOR,\nDE LA ANATOMIE LA IMPLANTARE',
  date = '31',
  month = 'OCTOMBRIE',
  emcPoints = 6,
  deviceImage = '/device-tavi.png',
  taviImage = '/tavi-word.png',
}: FeaturedWorkshopProps) {
  const [formOpen, setFormOpen] = useState(false)

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
            <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 400, fontSize: '155px', color: '#065EA6', lineHeight: 1, letterSpacing: '-3px', display: 'flex', justifyContent: 'end' }}>
              Workshop
            </div>

            {/* Interactiv + TAVI */}
            <div className="flex items-center gap-4 mb-4 ml-2 ">
              <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 500, fontSize: '115px', color: '#065EA6', lineHeight: 1 }}>
                Interactiv
              </span>
              <span className=" " style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '115px', color: '#065EA6', lineHeight: 1 }}>
                TAVI
              </span>
            </div>

            {/* Separator */}
            <div className="border-t border-[#065EA6] mb-4" />

            {/* Descriere */}
            <p className="text-center mb-6" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400, fontSize: '24px', color: '#065EA6', lineHeight: 1.5 }}>
              {description.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </p>

            {/* 3 casute + poza */}
            <div className="flex items-center gap-4">

              {/* 1 — albastru */}
              <div className="flex-1 flex items-center justify-center text-center" style={{ background: '#065EA6', height: '150px' }}>
                <div>
                  <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '22px', color: '#fff', lineHeight: 1.5, textTransform: 'uppercase' }}>
                    CENTRUL<br />DE TRAINING
                  </p>
                  <div style={{ borderTop: '1px solid #ffffff', margin: '4px 0' }} />
                  <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 800, fontSize: '16px', color: '#fff', marginTop: '5px', textTransform: 'uppercase' }}>
                    SPITALUL MONZA
                  </p>
                </div>
              </div>

              {/* 2 — alb, data */}
              <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ background: '#ffffff', height: '150px' }}>
                <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '46px', color: '#065EA6', lineHeight: 1 }}>
                  {date}
                </p>
                <div style={{ borderTop: '1px solid #065EA6', margin: '4px 0', width: '70%' }} />
                <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 800, fontSize: '15px', color: '#065EA6', letterSpacing: '0.08em', marginTop: '2px' }}>
                  {month}
                </p>
              </div>

              {/* 3 — alb, EMC */}
              <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ background: '#ffffff', height: '150px' }}>
                <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '46px', color: '#065EA6', lineHeight: 1 }}>
                  {emcPoints}
                </p>
                <div style={{ borderTop: '1px solid #065EA6', margin: '4px 0', width: '70%' }} />
                <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 800, fontSize: '15px', color: '#065EA6', lineHeight: 1.5, marginTop: '2px' }}>
                  CURS CREDITAT<br />CU {emcPoints} PUNCTE EMC
                </p>
              </div>

              {/* Poza */}
              <div className="flex-[1.5] flex items-center justify-center">
                <Image src={deviceImage} alt="Dispozitiv" width={130} height={120} quality={90} className="object-contain" />
              </div>

            </div>
          </div>
        </div>

        {/* Buton + Form — in afara cardului gri */}
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

          {/* Form — apare la click */}
          {formOpen && <InscriereForm />}
        </div>

      </div>
    </section>
  )
}
