'use client'

import { useState } from 'react'
import Image from 'next/image'
import { InscriereForm } from '@/components/sections/InscriereForm'

export default function DespreNoiPage() {
  const [formOpen, setFormOpen] = useState(false)

  return (
    <main style={{ fontFamily: '"Roboto", sans-serif' }}>

      {/* ── HERO cu background maini.png ── */}
      <section className="bg-[#ecffff] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/maini.png"
            alt=""
            fill
            quality={90}
            loading="eager"
            fetchPriority="high"
            className="object-contain object-center"
            aria-hidden="true"
          />
        </div>
        <div className="w-full max-w-[1000px] mx-auto px-4 py-5 relative z-10" style={{ height: '450px' }}>
        </div>
      </section>

      {/* ── TITLU + CARD ── */}
      <div className="relative z-10" style={{ background: 'transparent', fontFamily: '"Roboto", sans-serif', marginTop: '-220px'}}>

        {/* Titlu */}
        <div className="max-w-[1000px] mx-auto px-4 pt-12 pb-6">
          <h1 style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '32px', color: '#6D6E71', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
            Despre noi
          </h1>
        </div>

        {/* Card */}
        <div className="max-w-[1000px] mx-auto px-4 pb-16">
          <div style={{ background: '#F7F7F7', borderRadius: '0 0 50px 50px', padding: '3rem 2rem' }}>

            <h2 className="text-center mb-6" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '28px', color: '#000' }}>
              MONZA ARES Academy
            </h2>
            <p className="text-center mb-4" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '15px', color: '#000', lineHeight: 1.8 }}>
              MONZA ARES Academy este platforma educațională a celei mai mari rețele private integrate de cardiologie din România, dedicată formării și perfecționării continue.
            </p>
            <p className="text-center mb-4" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '15px', color: '#000', lineHeight: 1.8 }}>
              Academia dezvoltă programe de training, workshopuri practice, cursuri avansate și inițiative de schimb de expertiză, aliniate celor mai noi practici și protocoale internaționale pentru ecosistemul cardiotoracic.
            </p>
            <p className="text-center mb-4" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '15px', color: '#000', lineHeight: 1.8 }}>
              Se adresează medicilor cardiologi, chirurgilor, medicilor rezidenți, specialiștilor din disciplinele complementare și tuturor profesioniștilor implicați în prevenția, diagnosticul și tratamentul afecțiunilor cardiovasculare și toracice care doresc să își consolideze competențele și să fie parte la evoluția medicinei.
            </p>
            <p className="text-center mb-10" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '15px', color: '#000', lineHeight: 1.8 }}>
              Prin MONZA ARES Academy, participanții au acces la expertiză și know-how clinic aplicat și la o comunitate medicală cu performanță probată.
            </p>

            <h2 className="text-center mb-6" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '28px', color: '#000' }}>
              Viziunea MONZA ARES Academy
            </h2>
            <p className="text-center mb-10" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '15px', color: '#000', lineHeight: 1.8 }}>
              MONZA ARES Academy își propune să devină reperul național în educația medicală privată și un catalizator al progresului în tratamentul afecțiunilor cardiotoracice în România.
            </p>

            <h2 className="text-center mb-6" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '28px', color: '#000' }}>
              Misiunea MONZA ARES Academy
            </h2>
            <p className="text-center mb-4" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '15px', color: '#000', lineHeight: 1.8 }}>
              MONZA ARES Academy are misiunea de a forma medici în cele mai noi practici, tehnologii și protocoale din cardiologia modernă și afecțiuni conexe, contribuind la creșterea nivelului profesional și la dezvoltarea continuă a competențelor în domeniu.
            </p>
            <p className="text-center mb-8" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '15px', color: '#000', lineHeight: 1.8 }}>
              MONZA ARES Academy urmărește să contribuie la consolidarea unei comunități medicale de elită, capabile să aplice, dar și să dezvolte noi soluții de prevenție, diagnostic și tratament.
            </p>

           

          </div>
          {/* Buton + Form */}
            <div className="flex justify-center mb-6 mt-4">
              <button
                onClick={() => setFormOpen(v => !v)}
                className="inline-flex items-center gap-2 text-white rounded-full px-8 py-2 transition-all hover:-translate-y-px"
                style={{ background: '#065EA6', fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '13px', border: 'none', cursor: 'pointer' }}
              >
                Înscrie-te aici
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 4l5 5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {formOpen && <InscriereForm />}
        </div>

      </div>
 
    </main>
  )
}
