'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Prefs = { necessary: true; analytics: boolean; marketing: boolean }

const STORAGE_KEY = 'cookie_consent'

function loadPrefs(): Prefs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function savePrefs(prefs: Prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  window.dispatchEvent(new CustomEvent('cookieConsentUpdate', { detail: prefs }))
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>({ necessary: true, analytics: false, marketing: false })

  useEffect(() => {
    if (!loadPrefs()) setVisible(true)
  }, [])

  function acceptAll() {
    const p: Prefs = { necessary: true, analytics: true, marketing: true }
    savePrefs(p)
    setVisible(false)
  }

  function rejectAll() {
    const p: Prefs = { necessary: true, analytics: false, marketing: false }
    savePrefs(p)
    setVisible(false)
  }

  function saveSelected() {
    savePrefs(prefs)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: '#fff', boxShadow: '0 -4px 24px rgba(6,94,166,0.12)',
      fontFamily: '"Roboto",sans-serif',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.25rem 1.5rem' }}>

        {/* Main row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <p style={{ margin: '0 0 0.35rem', fontWeight: 500, fontSize: '0.95rem', color: '#000' }}>
              Utilizăm cookie-uri 🍪
            </p>
            <p style={{ margin: 0, fontWeight: 300, fontSize: '0.82rem', color: '#414042', lineHeight: 1.55 }}>
              Folosim cookie-uri esențiale pentru funcționarea site-ului și, cu acordul tău, cookie-uri de analiză și marketing.
              Poți gestiona preferințele sau afla mai multe în{' '}
              <Link href="/politica-cookies" style={{ color: '#065EA6', textDecoration: 'underline' }}>
                Politica de Cookie-uri
              </Link>.
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '160px', justifyContent: 'center' }}>
            <button onClick={acceptAll} style={btnPrimary}>Acceptă toate</button>
            <button onClick={rejectAll} style={btnOutline}>Refuză opționale</button>
            <button onClick={() => setShowDetails(p => !p)} style={btnLink}>
              {showDetails ? 'Ascunde preferințe' : 'Personalizează'}
            </button>
          </div>
        </div>

        {/* Detailed preferences */}
        {showDetails && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

              {/* Necessary */}
              <div style={rowStyle}>
                <div>
                  <span style={labelStyle}>Cookie-uri necesare</span>
                  <p style={descStyle}>Esențiale pentru funcționarea site-ului. Nu pot fi dezactivate.</p>
                </div>
                <div style={toggleOff}>Activ</div>
              </div>

              {/* Analytics */}
              <div style={rowStyle}>
                <div>
                  <span style={labelStyle}>Cookie-uri de analiză</span>
                  <p style={descStyle}>Ne ajută să înțelegem cum este utilizat site-ul (ex. Google Analytics).</p>
                </div>
                <Toggle checked={prefs.analytics} onChange={v => setPrefs(p => ({ ...p, analytics: v }))} />
              </div>

              {/* Marketing */}
              <div style={rowStyle}>
                <div>
                  <span style={labelStyle}>Cookie-uri de marketing</span>
                  <p style={descStyle}>Utilizate pentru afișarea de reclame relevante și măsurarea campaniilor.</p>
                </div>
                <Toggle checked={prefs.marketing} onChange={v => setPrefs(p => ({ ...p, marketing: v }))} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button onClick={saveSelected} style={btnPrimary}>Salvează preferințele</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-checked={checked}
      role="switch"
      style={{
        flexShrink: 0,
        width: '44px', height: '24px',
        borderRadius: '12px',
        border: 'none',
        background: checked ? '#065EA6' : '#d1d5db',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute',
        top: '3px',
        left: checked ? '23px' : '3px',
        width: '18px', height: '18px',
        borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

const btnPrimary: React.CSSProperties = {
  background: '#065EA6', color: '#fff', border: 'none',
  borderRadius: '50px', padding: '0.45rem 1.25rem',
  fontSize: '0.82rem', fontWeight: 400, cursor: 'pointer',
  fontFamily: '"Roboto",sans-serif', whiteSpace: 'nowrap',
}
const btnOutline: React.CSSProperties = {
  background: 'transparent', color: '#065EA6',
  border: '1.5px solid #065EA6', borderRadius: '50px',
  padding: '0.45rem 1.25rem', fontSize: '0.82rem',
  fontWeight: 400, cursor: 'pointer',
  fontFamily: '"Roboto",sans-serif', whiteSpace: 'nowrap',
}
const btnLink: React.CSSProperties = {
  background: 'transparent', border: 'none',
  color: '#414042', fontSize: '0.78rem',
  fontWeight: 300, cursor: 'pointer',
  textDecoration: 'underline', fontFamily: '"Roboto",sans-serif',
  padding: '0.2rem 0',
}
const rowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center',
  justifyContent: 'space-between', gap: '1rem',
}
const labelStyle: React.CSSProperties = {
  fontWeight: 500, fontSize: '0.85rem', color: '#000',
}
const descStyle: React.CSSProperties = {
  margin: '2px 0 0', fontWeight: 300, fontSize: '0.78rem', color: '#414042',
}
const toggleOff: React.CSSProperties = {
  flexShrink: 0, fontSize: '0.75rem', color: '#065EA6',
  fontWeight: 500, background: '#e8f0f9', borderRadius: '12px',
  padding: '3px 10px',
}
