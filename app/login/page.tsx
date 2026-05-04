'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await login(form.email, form.password)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Eroare la autentificare')
    } finally { setLoading(false) }
  }

  const inp = { padding: '1rem 1.25rem', border: '2px solid #065ea6', borderRadius: '20px', fontSize: '0.95rem', background: 'transparent', outline: 'none', fontFamily: '"Roboto",sans-serif', fontWeight: 300, width: '100%' }

  return (
    <main style={{ background: '#ecffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Roboto",sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '3rem 2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 4px 30px rgba(6,94,166,0.12)' }}>
        <h1 style={{ fontWeight: 300, fontSize: '1.8rem', color: '#065EA6', marginBottom: '0.5rem', textAlign: 'center' }}>Contul meu</h1>
        <p style={{ fontSize: '0.9rem', color: '#6D6E71', textAlign: 'center', marginBottom: '2rem', fontWeight: 300 }}>Autentifică-te pentru a accesa platforma</p>
        {error && <div style={{ background: '#fde8e8', color: '#c53030', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <input type="email" placeholder="Email *" required style={inp} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div style={{ marginBottom: '0.5rem', position: 'relative' }}>
            <input type={showPassword ? 'text' : 'password'} placeholder="Parolă *" required style={{ ...inp, paddingRight: '3rem' }} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? 'Ascunde parola' : 'Afișează parola'}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', padding: '0.25rem', cursor: 'pointer', color: '#065EA6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
            <Link href="/forgot-password" style={{ fontSize: '0.85rem', color: '#065EA6', textDecoration: 'none', fontWeight: 300 }}>Ai uitat parola?</Link>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', background: '#065EA6', border: 'none', borderRadius: '50px', color: '#fff', padding: '0.85rem', fontSize: '1rem', fontWeight: 300, cursor: 'pointer', fontFamily: '"Roboto",sans-serif', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Se autentifică...' : 'Autentificare'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6D6E71', fontWeight: 300 }}>
          Nu ai cont?{' '}
          <Link href="/inregistrare" style={{ color: '#065EA6', textDecoration: 'none', fontWeight: 400 }}>Înregistrează-te</Link>
        </p>
      </div>
    </main>
  )
}
