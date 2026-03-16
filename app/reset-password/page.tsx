'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { resetPassword } from '@/lib/api'

function ResetPasswordForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') ?? ''
  const email = params.get('email') ?? ''

  const [form, setForm] = useState({ password: '', password_confirmation: '' })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inp = { padding: '1rem 1.25rem', border: '2px solid #065ea6', borderRadius: '20px', fontSize: '0.95rem', background: 'transparent', outline: 'none', fontFamily: '"Roboto",sans-serif', fontWeight: 300, width: '100%' }

  useEffect(() => {
    if (!token || !email) setError('Link invalid sau expirat.')
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    if (form.password !== form.password_confirmation) {
      setError('Parolele nu coincid'); setLoading(false); return
    }
    try {
      await resetPassword({ token, email, ...form })
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare')
    } finally { setLoading(false) }
  }

  return (
    <main style={{ background: '#ecffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Roboto",sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '3rem 2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 4px 30px rgba(6,94,166,0.12)' }}>
        {done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e8f4fd', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#065EA6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1 style={{ fontWeight: 300, fontSize: '1.8rem', color: '#065EA6', marginBottom: '0.5rem' }}>Parolă resetată!</h1>
            <p style={{ fontSize: '0.9rem', color: '#6D6E71', fontWeight: 300, lineHeight: 1.6 }}>
              Parola ta a fost schimbată cu succes.<br />
              Vei fi redirecționat către pagina de autentificare...
            </p>
            <Link href="/login" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#065EA6', fontSize: '0.9rem', textDecoration: 'none' }}>
              Mergi la autentificare →
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontWeight: 300, fontSize: '1.8rem', color: '#065EA6', marginBottom: '0.5rem', textAlign: 'center' }}>Resetare parolă</h1>
            <p style={{ fontSize: '0.9rem', color: '#6D6E71', textAlign: 'center', marginBottom: '2rem', fontWeight: 300 }}>
              Introdu noua ta parolă.
            </p>
            {error && <div style={{ background: '#fde8e8', color: '#c53030', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <input type="password" placeholder="Parolă nouă *" required style={inp} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <input type="password" placeholder="Confirmă parola *" required style={inp} value={form.password_confirmation} onChange={e => setForm(p => ({ ...p, password_confirmation: e.target.value }))} />
              </div>
              <button type="submit" disabled={loading || !token || !email} style={{ width: '100%', background: '#065EA6', border: 'none', borderRadius: '50px', color: '#fff', padding: '0.85rem', fontSize: '1rem', fontWeight: 300, cursor: 'pointer', fontFamily: '"Roboto",sans-serif', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Se salvează...' : 'Salvează parola nouă'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
