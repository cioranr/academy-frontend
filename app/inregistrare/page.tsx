'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function InregistrarePage() {
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

  const inp = { width: '100%', padding: '1rem 1.25rem', border: '2px solid #065ea6', borderRadius: '20px', fontSize: '0.95rem', color: '#000', background: 'transparent', outline: 'none', fontFamily: '"Roboto", sans-serif', fontWeight: 300 }
  const sel = { ...inp, appearance: 'none' as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23065ea6' d='M1 1L6 6L11 1' stroke='%23065ea6' stroke-width='2'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '12px', paddingRight: '3rem', cursor: 'pointer' }

  return (
    <main style={{ background: 'linear-gradient(to bottom, #ecffff 30%, #ffffff 30%)', fontFamily: '"Roboto", sans-serif' }}>

      <div className="max-w-[1000px] mx-auto px-4 pt-12 pb-6">
        <h1 style={{ fontWeight: 300, fontSize: '32px', color: '#6D6E71', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
          Înregistrare
        </h1>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 pb-16">
        <div style={{ background: '#F7F7F7', borderRadius: '0 0 50px 50px', padding: '3rem 2rem' }}>

          <p className="text-center" style={{ fontWeight: 300, fontSize: '14px', color: '#000', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto 2rem' }}>
            Creează-ți un cont pentru a accesa platforma educațională MONZA ARES Academy,
            a te înscrie la evenimente și a urmări diplomele și certificatele obținute.
          </p>

          {error && (
            <div style={{ background: '#fde8e8', color: '#c53030', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.9rem', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '1rem' }}>
              <input placeholder="Prenume *" required style={inp} value={form.first_name} onChange={set('first_name')} />
              <input placeholder="Nume *" required style={inp} value={form.last_name} onChange={set('last_name')} />
              <input type="email" placeholder="Email *" required style={inp} value={form.email} onChange={set('email')} />
              <input type="tel" placeholder="Telefon" style={inp} value={form.phone} onChange={set('phone')} />
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
              <input type="password" placeholder="Parolă *" required style={inp} value={form.password} onChange={set('password')} />
              <input type="password" placeholder="Confirmă parola *" required style={inp} value={form.password_confirmation} onChange={set('password_confirmation')} />
            </div>

            <p style={{ fontWeight: 300, fontSize: '0.85rem', color: '#666', lineHeight: 1.5, margin: '1rem 0 1.5rem' }}>
              Prin crearea contului ești de acord cu prelucrarea datelor tale cu caracter personal de către MONZA ARES.
              Pentru mai multe informații, accesați pagina cu{' '}
              <Link href="/politica-confidentialitate" style={{ color: '#065ea6' }}>Nota de informare</Link>.
            </p>

            <div className="flex justify-center">
              <button type="submit" disabled={loading} className="transition-all hover:-translate-y-px"
                style={{ background: '#065EA6', border: 'none', borderRadius: '50px', color: '#fff', padding: '0.5rem 2rem', fontSize: '1.1rem', fontWeight: 300, cursor: 'pointer', minWidth: '200px', fontFamily: '"Roboto", sans-serif', boxShadow: '0 4px 15px rgba(6,94,166,0.3)', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Se creează contul...' : 'Creează cont'}
              </button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6D6E71', fontWeight: 300 }}>
              Ai deja cont?{' '}
              <Link href="/login" style={{ color: '#065EA6', textDecoration: 'none', fontWeight: 400 }}>Autentifică-te</Link>
            </p>
          </form>

        </div>
      </div>

    </main>
  )
}
