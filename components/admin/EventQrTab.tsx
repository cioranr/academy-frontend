'use client'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { getCheckinQr, generateCheckinQr, type CheckinQr } from '@/lib/api'

const Label = ({ children }: { children: React.ReactNode }) => <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{children}</label>
const primaryBtn: React.CSSProperties = { padding: '0.65rem 1.5rem', background: '#065EA6', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }
const secondaryBtn: React.CSSProperties = { ...primaryBtn, background: '#fff', color: '#374151', border: '1px solid #d1d5db' }

/** Admin tab: generate / preview / download / regenerate the event's check-in QR code. */
export function EventQrTab({ eventId, eventSlug }: { eventId: number; eventSlug: string }) {
  const [qr, setQr] = useState<CheckinQr | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => { getCheckinQr(eventId).then(setQr).catch(e => setError(e instanceof Error ? e.message : 'Eroare')) }, [eventId])

  // Render the preview client-side whenever the URL changes
  useEffect(() => {
    const url = qr?.url
    if (!url) return
    let cancelled = false
    QRCode.toDataURL(url, { width: 320, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } })
      .then(dataUrl => { if (!cancelled) setPreview(dataUrl) })
    return () => { cancelled = true }
  }, [qr?.url])

  const handleGenerate = async (regenerate: boolean) => {
    if (regenerate && !confirm('Regenerezi codul QR? Codul actual (inclusiv cel deja tipărit) nu va mai funcționa.')) return
    setBusy(true); setError('')
    try { setPreview(null); setQr(await generateCheckinQr(eventId)) }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Eroare la generare') }
    finally { setBusy(false) }
  }

  const download = async (format: 'png' | 'svg') => {
    if (!qr?.url) return
    const filename = `qr-checkin-${eventSlug || eventId}.${format}`
    let href: string
    if (format === 'png') {
      href = await QRCode.toDataURL(qr.url, { width: 1200, margin: 2, errorCorrectionLevel: 'M' })
    } else {
      const svg = await QRCode.toString(qr.url, { type: 'svg', margin: 2, errorCorrectionLevel: 'M' })
      href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
    }
    const a = document.createElement('a'); a.href = href; a.download = filename; a.click()
    if (format === 'svg') URL.revokeObjectURL(href)
  }

  const copyUrl = async () => {
    if (!qr?.url) return
    try { await navigator.clipboard.writeText(qr.url); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {}
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {error && <div style={{ background: '#fde8e8', color: '#c53030', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.85rem' }}>{error}</div>}

      {!qr?.url ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', border: '2px dashed #e5e7eb', borderRadius: '14px' }}>
          <p style={{ color: '#6D6E71', fontWeight: 300, fontSize: '0.9rem', margin: '0 0 1rem' }}>
            Acest eveniment nu are încă un cod QR de check-in.
          </p>
          <button onClick={() => handleGenerate(false)} disabled={busy} style={{ ...primaryBtn, opacity: busy ? 0.7 : 1 }}>
            {busy ? 'Se generează...' : 'Generează cod QR'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1rem', flex: '0 0 auto' }}>
            {preview
              ? <img src={preview} alt="Cod QR check-in" width={240} height={240} style={{ display: 'block', imageRendering: 'pixelated' }} />
              : <div style={{ width: 240, height: 240, background: '#f3f4f6', borderRadius: '8px' }} />}
          </div>

          <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
            <div>
              <Label>Link încorporat în cod</Label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <code style={{ flex: 1, fontSize: '0.78rem', background: '#f8fafc', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#374151' }}>{qr.url}</code>
                <button onClick={copyUrl} style={{ ...secondaryBtn, padding: '0.5rem 0.8rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{copied ? '✓ Copiat' : 'Copiază'}</button>
              </div>
              {qr.generated_at && <p style={{ margin: '0.4rem 0 0', fontSize: '0.75rem', color: '#6D6E71', fontWeight: 300 }}>Generat la {new Date(qr.generated_at).toLocaleString('ro-RO')}</p>}
            </div>

            <div>
              <Label>Descarcă</Label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => download('png')} style={primaryBtn}>⬇ PNG (tipărire)</button>
                <button onClick={() => download('svg')} style={secondaryBtn}>⬇ SVG</button>
              </div>
            </div>

            <div>
              <Label>Regenerare</Label>
              <button onClick={() => handleGenerate(true)} disabled={busy} style={{ ...secondaryBtn, color: '#991b1b', borderColor: '#fca5a5', opacity: busy ? 0.7 : 1 }}>
                {busy ? 'Se regenerează...' : '↻ Regenerează codul QR'}
              </button>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.75rem', color: '#6D6E71', fontWeight: 300 }}>Codul vechi devine invalid imediat. Folosește doar dacă a fost compromis.</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem', fontSize: '0.85rem', color: '#6D6E71', fontWeight: 300 }}>
        <strong style={{ fontWeight: 500, color: '#374151' }}>Cum funcționează:</strong>
        <ol style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', lineHeight: 1.7 }}>
          <li>Tipărește sau afișează codul QR la intrarea în locație.</li>
          <li>Participantul îl scanează cu telefonul; dacă nu este autentificat, se loghează și revine automat.</li>
          <li>Sistemul verifică înscrierea și bifează prezența (metodă „QR”). Dacă a fost deja bifată, nu se creează duplicat.</li>
          <li>Participantul vede pagina de confirmare cu numele, evenimentul, data și locația.</li>
          <li>Funcționează doar cât timp evenimentul este „Publicat”; altfel participantul este redirecționat pe homepage.</li>
        </ol>
      </div>
    </div>
  )
}
