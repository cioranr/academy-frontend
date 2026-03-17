'use client'
import { use } from 'react'

const MOCK_DIPLOMA = {
  doctor_name: 'DR. PAVEL PLATON',
  workshop_title: 'WORKSHOP INTERACTIV: TEHNICI DE CTO & CROSSING ÎN CLTI',
  location: 'București',
  period: '10–11 februarie 2026',
  credits: 10,
  cmr_address: '13686/22.12.2025',
  signers: [
    { name: 'DR. NICOLAE CĂRSTEA', signature: '/signatures/carstea.png' },
    { name: 'DR. MARIN POSTU',     signature: '/signatures/postu.png' },
    { name: 'DR. PAVEL PLATON',    signature: '/signatures/platon.png' },
  ],
  logo_amici: '/logo-amici.png',
}

export default function DiplomaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const diploma = MOCK_DIPLOMA
  void id

  return (
    <main style={{
      background: '#e0e0e0',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
    }}>

      {/* Buton print */}
      <button
        onClick={() => window.print()}
        className="print:hidden"
        style={{
          marginBottom: '20px',
          background: '#065EA6',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          padding: '8px 24px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 300,
          fontFamily: 'Arial, sans-serif',
        }}
      >
        Printează / Salvează PDF
      </button>

      {/* Hârtie albă cu diploma înăuntru */}
      <div style={{
        background: '#ffffff',
        padding: '20px',
        boxShadow: '0 4px 30px rgba(0,0,0,0.15)',
        display: 'inline-block',
      }}>

        {/* Diploma propriu-zisă */}
        <div id="diploma" style={{
          width: '257mm',
          backgroundColor: '#cfe8f3',
          position: 'relative',
          padding: '12mm 20mm 10mm 20mm',
          boxSizing: 'border-box',
        }}>

          {/* Logo AMICI sus dreapta */}
          <div style={{ position: 'absolute', top: '10mm', right: '14mm' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={diploma.logo_amici} alt="AMICI" style={{ width: '32mm', display: 'block' }} />
          </div>

          {/* Titlu */}
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: '46pt',
            fontWeight: 'bold',
            color: '#1a3a6b',
            textAlign: 'center',
            lineHeight: 1.1,
            marginTop: '6mm',
            marginBottom: '6mm',
          }}>
            Certificat de<br />participare
          </div>

          {/* Separator 1 */}
          <div style={{ borderTop: '1px solid #1a3a6b', width: '100%', marginBottom: '4mm' }} />

          {/* Nume doctor */}
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: '20pt',
            fontStyle: 'italic',
            color: '#1a3a6b',
            textAlign: 'center',
            marginBottom: '4mm',
          }}>
            {diploma.doctor_name}
          </div>

          {/* Text principal */}
          <div style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '10pt',
            color: '#1a3a6b',
            textAlign: 'center',
            lineHeight: 1.7,
          }}>
            a participat la atelierul de lucru cu titlul<br />
            <strong style={{ fontSize: '10.5pt' }}>„{diploma.workshop_title}"</strong><br />
            organizat la {diploma.location} în perioada {diploma.period}.<br />
            <br />
            <strong>COLEGIUL MEDICILOR DIN ROMÂNIA ACORDĂ PENTRU ACEST ATELIER UN NUMĂR DE {diploma.credits} CREDITE EMC.</strong><br />
            <span style={{ fontSize: '9pt' }}>(adresa Nr. {diploma.cmr_address})</span>
          </div>

          {/* Separator 2 */}
          <div style={{ borderTop: '1px solid #1a3a6b', width: '100%', marginTop: '5mm', marginBottom: '5mm' }} />

          {/* Semnaturi */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
            {diploma.signers.map(s => (
              <div key={s.name} style={{ textAlign: 'center', flex: 1, padding: '0 6mm' }}>
                <div style={{ height: '16mm', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '2mm' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.signature}
                    alt=""
                    style={{ maxHeight: '16mm', maxWidth: '38mm' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
                <div style={{
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '8pt',
                  fontWeight: 'bold',
                  color: '#1a3a6b',
                  letterSpacing: '0.04em',
                }}>
                  {s.name}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        @media print {
          body { margin: 0; background: #fff; }
          main { padding: 0; background: #fff; justify-content: flex-start; }
          button { display: none; }
          @page { size: A4 landscape; margin: 10mm; }
        }
      `}</style>

    </main>
  )
}
