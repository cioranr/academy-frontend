'use client'
import { useEffect, useRef, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { checkin, CheckinError, type CheckinResult, type CheckinEvent } from '@/lib/api'

type State =
  | { kind: 'loading' }
  | { kind: 'confirmed'; result: CheckinResult }
  | { kind: 'already_confirmed'; result: CheckinResult }
  | { kind: 'not_registered'; event?: CheckinEvent }
  | { kind: 'error'; message: string }

function formatEventDate(ev: CheckinEvent): string {
  const fmt = (d: string) => new Date(d).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
  const start = fmt(ev.date)
  const end = ev.end_date && ev.end_date !== ev.date ? fmt(ev.end_date) : null
  const time = ev.time_start ? ` · ${ev.time_start.slice(0, 5)}${ev.time_end ? `–${ev.time_end.slice(0, 5)}` : ''}` : ''
  return (end ? `${start} – ${end}` : start) + time
}

function EventDetails({ ev }: { ev: CheckinEvent }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '1.25rem', marginTop: '1.5rem', textAlign: 'left' }}>
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6D6E71', marginBottom: '0.35rem' }}>Eveniment</div>
      <div style={{ fontWeight: 500, color: '#000', fontSize: '1rem', marginBottom: '0.75rem' }}>{ev.title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', color: '#374151', fontWeight: 300 }}>
        <span>📅 {formatEventDate(ev)}</span>
        {(ev.location || ev.venue) && <span>📍 {[ev.venue, ev.location].filter(Boolean).join(', ')}</span>}
      </div>
    </div>
  )
}

export default function CheckinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const router = useRouter()
  const { user, loading } = useAuth()
  const [state, setState] = useState<State>({ kind: 'loading' })
  const fired = useRef(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (loading) return
    if (!user) {
      // Not authenticated → login, then come straight back here (no second scan needed)
      router.replace(`/login?redirect=${encodeURIComponent(`/checkin/${token}`)}`)
      return
    }
    if (fired.current) return
    fired.current = true

    checkin(token)
      .then(result => setState({ kind: result.status, result }))
      .catch((err: unknown) => {
        if (err instanceof CheckinError) {
          if (err.code === 'event_inactive') { router.replace('/'); return }
          if (err.code === 'not_registered') { setState({ kind: 'not_registered', event: err.event }); return }
        }
        setState({ kind: 'error', message: err instanceof Error ? err.message : 'A apărut o eroare. Te rugăm să încerci din nou.' })
      })
  }, [loading, user, token, router, attempt])

  const card: React.CSSProperties = { background: '#fff', borderRadius: '20px', padding: '2.5rem 2rem', width: '100%', maxWidth: '460px', boxShadow: '0 4px 30px rgba(6,94,166,0.12)', textAlign: 'center' }
  const btn: React.CSSProperties = { display: 'inline-block', marginTop: '1.75rem', background: '#065EA6', color: '#fff', borderRadius: '50px', padding: '0.8rem 2rem', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 300 }

  return (
    <main style={{ background: '#ecffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 1rem', fontFamily: '"Roboto",sans-serif' }}>
      {state.kind === 'loading' && (
        <div style={card}>
          <div style={{ width: 44, height: 44, border: '3px solid #cfe9f7', borderTopColor: '#065EA6', borderRadius: '50%', margin: '0 auto 1.25rem', animation: 'spin 0.9s linear infinite' }} />
          <p style={{ color: '#6D6E71', fontWeight: 300, margin: 0 }}>Se confirmă prezența...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {(state.kind === 'confirmed' || state.kind === 'already_confirmed') && (
        <div style={card}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: state.kind === 'confirmed' ? '#d1fae5' : '#fef3c7', color: state.kind === 'confirmed' ? '#065f46' : '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#065EA6', margin: '0 0 0.5rem' }}>
            {state.kind === 'confirmed' ? 'Prezența ta a fost confirmată cu succes' : 'Prezența a fost deja confirmată'}
          </h1>
          <p style={{ color: '#000', fontSize: '1.05rem', fontWeight: 400, margin: '0.75rem 0 0' }}>
            {state.result.participant.first_name} {state.result.participant.last_name}
          </p>
          {state.kind === 'already_confirmed' && state.result.present_at && (
            <p style={{ color: '#6D6E71', fontSize: '0.8rem', fontWeight: 300, margin: '0.25rem 0 0' }}>
              confirmată la {new Date(state.result.present_at).toLocaleString('ro-RO', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
          <EventDetails ev={state.result.event} />
          <Link href="/dashboard" style={btn}>Contul meu</Link>
        </div>
      )}

      {state.kind === 'not_registered' && (
        <div style={card}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fde8e8', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </div>
          <h1 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#991b1b', margin: '0 0 0.5rem' }}>Nu ești înregistrat la acest eveniment</h1>
          <p style={{ color: '#6D6E71', fontWeight: 300, fontSize: '0.9rem', margin: 0 }}>
            Contul <strong style={{ fontWeight: 500 }}>{user?.email}</strong> nu are o înscriere validă. Te rugăm să te adresezi organizatorilor.
          </p>
          {state.event && <EventDetails ev={state.event} />}
          {state.event && <Link href={`/events/${state.event.slug}`} style={btn}>Vezi evenimentul</Link>}
        </div>
      )}

      {state.kind === 'error' && (
        <div style={card}>
          <h1 style={{ fontWeight: 300, fontSize: '1.4rem', color: '#991b1b', margin: '0 0 0.5rem' }}>Ceva nu a funcționat</h1>
          <p style={{ color: '#6D6E71', fontWeight: 300, fontSize: '0.9rem', margin: 0 }}>{state.message}</p>
          <button onClick={() => { fired.current = false; setState({ kind: 'loading' }); setAttempt(a => a + 1) }} style={{ ...btn, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Încearcă din nou</button>
        </div>
      )}
    </main>
  )
}
