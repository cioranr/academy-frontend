'use client'

import { InscriereForm } from '@/components/sections/InscriereForm'

export default function InregistrarePage() {
  return (
    <main style={{ background: 'linear-gradient(to bottom, #ecffff 30%, #ffffff 30%)', fontFamily: '"Roboto", sans-serif', }}>

      {/* Titlu */}
      <div className="max-w-[1000px] mx-auto px-4 pt-12 pb-6">
        <h1 style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '32px', color: '#6D6E71', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
          Înregistrare
        </h1>
      </div>

      {/* Card form */}
      <div className="max-w-[1000px] mx-auto px-4 pb-16">
        <div style={{ background: '#F7F7F7', borderRadius: '0 0 50px 50px', padding: '3rem 2rem' }}>

          {/* Text intro */}
          <p className="text-center mb-8" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '14px', color: '#000', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto 2rem' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet quam eu tortor molestie consectetur.
            Proin ullamcorper nisi eget dolor fermentum, a tempus enim luctus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Nullam sit amet quam eu tortor molestie consectetur.
            Proin ullamcorper nisi eget dolor fermentum, a tempus enim luctus
          </p>

          {/* Form */}
          <InscriereForm />

        </div>
      </div>

    </main>
  )
}
