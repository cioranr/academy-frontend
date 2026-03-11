'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', password_confirmation: '', phone: '', specialty: '', professional_grade: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    if (form.password !== form.password_confirmation) { setError('Parolele nu coincid'); setLoading(false); return }
    try {
      await register({ ...form, name: `${form.first_name} ${form.last_name}` })
      router.push('/dashboard')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Eroare la înregistrare') } finally { setLoading(false) }
  }

  const inp = { padding: '0.9rem 1.25rem', border: '2px solid #065ea6', borderRadius: '20px', fontSize: '0.9rem', background: 'transparent', outline: 'none', fontFamily: '"Roboto",sans-serif', fontWeight: 300, width: '100%' }
  const sel = { ...inp, appearance: 'none' as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23065ea6' d='M1 1L6 6L11 1' stroke='%23065ea6' stroke-width='2'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '12px', paddingRight: '3rem', cursor: 'pointer' }

  return (
    <main style={{ background: '#ecffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Roboto",sans-serif', padding: '2rem 1rem' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '3rem 2.5rem', width: '100%', maxWidth: '520px', boxShadow: '0 4px 30px rgba(6,94,166,0.12)' }}>
        <h1 style={{ fontWeight: 300, fontSize: '1.8rem', color: '#065EA6', marginBottom: '0.5rem', textAlign: 'center' }}>Cont nou</h1>
        <p style={{ fontSize: '0.9rem', color: '#6D6E71', textAlign: 'center', marginBottom: '2rem', fontWeight: 300 }}>Creează-ți un cont pe platformă</p>
        {error && <div style={{ background: '#fde8e8', color: '#c53030', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input placeholder="Prenume *" required style={inp} value={form.first_name} onChange={set('first_name')} />
            <input placeholder="Nume *" required style={inp} value={form.last_name} onChange={set('last_name')} />
          </div>
          <div style={{ marginBottom: '1rem' }}><input type="email" placeholder="Email *" required style={inp} value={form.email} onChange={set('email')} /></div>
          <div style={{ marginBottom: '1rem' }}><input type="tel" placeholder="Telefon" style={inp} value={form.phone} onChange={set('phone')} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <select style={sel} value={form.professional_grade} onChange={set('professional_grade')}>
              <option value="">Grad profesional</option>
              <option value="medic-primar">Medic primar</option>
              <option value="medic-specialist">Medic specialist</option>
              <option value="medic-rezident">Medic rezident</option>
              <option value="student">Student</option>
            </select>
            <select style={sel} value={form.specialty} onChange={set('specialty')}>
              <option value="">Specialitate</option>
              <option value="cardiologie">Cardiologie</option>
              <option value="chirurgie">Chirurgie cardiovasculară</option>
              <option value="rezidenti">Rezidenți</option>
              <option value="alta">Altă specialitate</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}><input type="password" placeholder="Parolă *" required style={inp} value={form.password} onChange={set('password')} /></div>
          <div style={{ marginBottom: '1.5rem' }}><input type="password" placeholder="Confirmă parola *" required style={inp} value={form.password_confirmation} onChange={set('password_confirmation')} /></div>
          <button type="submit" disabled={loading} style={{ width: '100%', background: '#065EA6', border: 'none', borderRadius: '50px', color: '#fff', padding: '0.85rem', fontSize: '1rem', fontWeight: 300, cursor: 'pointer', fontFamily: '"Roboto",sans-serif', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Se creează contul...' : 'Creează cont'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6D6E71', fontWeight: 300 }}>
          Ai deja cont?{' '}<Link href="/login" style={{ color: '#065EA6', textDecoration: 'none', fontWeight: 400 }}>Autentifică-te</Link>
        </p>
      </div>
    </main>
  )
}
