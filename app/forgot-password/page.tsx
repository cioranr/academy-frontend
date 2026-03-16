'use client'
import { useState } from 'react'
import Link from 'next/link'
import { forgotPassword } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inp = { padding: '1rem 1.25rem', border: '2px solid #065ea6', borderRadius: '20px', fontSize: '0.95rem', background: 'transparent', outline: 'none', fontFamily: '"Roboto",sans-serif', fontWeight: 300, width: '100%' }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare')
    } finally { setLoading(false) }
  }

  return (
    <main style={{ background: '#ecffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Roboto",sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '3rem 2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 4px 30px rgba(6,94,166,0.12)' }}>
        {sent ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e8f4fd', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#065EA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h1 style={{ fontWeight: 300, fontSize: '1.8rem', color: '#065EA6', marginBottom: '0.5rem' }}>Email trimis!</h1>
              <p style={{ fontSize: '0.9rem', color: '#6D6E71', fontWeight: 300, lineHeight: 1.6 }}>
                Am trimis un link de resetare a parolei la adresa <strong style={{ color: '#065EA6' }}>{email}</strong>.<br />
                Verifică inbox-ul și urmează instrucțiunile.
              </p>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#6D6E71', textAlign: 'center', fontWeight: 300 }}>
              Nu ai primit emailul?{' '}
              <button onClick={() => setSent(false)} style={{ background: 'none', border: 'none', color: '#065EA6', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontSize: '0.85rem', padding: 0 }}>
                Trimite din nou
              </button>
            </p>
            <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: '#6D6E71', fontWeight: 300 }}>
              <Link href="/login" style={{ color: '#065EA6', textDecoration: 'none' }}>← Înapoi la autentificare</Link>
            </p>
          </>
        ) : (
          <>
            <h1 style={{ fontWeight: 300, fontSize: '1.8rem', color: '#065EA6', marginBottom: '0.5rem', textAlign: 'center' }}>Parolă uitată?</h1>
            <p style={{ fontSize: '0.9rem', color: '#6D6E71', textAlign: 'center', marginBottom: '2rem', fontWeight: 300 }}>
              Introdu adresa de email și îți trimitem un link de resetare.
            </p>
            {error && <div style={{ background: '#fde8e8', color: '#c53030', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <input type="email" placeholder="Email *" required style={inp} value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', background: '#065EA6', border: 'none', borderRadius: '50px', color: '#fff', padding: '0.85rem', fontSize: '1rem', fontWeight: 300, cursor: 'pointer', fontFamily: '"Roboto",sans-serif', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Se trimite...' : 'Trimite link de resetare'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6D6E71', fontWeight: 300 }}>
              <Link href="/login" style={{ color: '#065EA6', textDecoration: 'none' }}>← Înapoi la autentificare</Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
