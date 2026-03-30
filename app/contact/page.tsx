'use client'
import { useState } from 'react'

const inp: React.CSSProperties = {
  width: '100%',
  padding: '1rem 1.25rem',
  border: '2px solid #065EA6',
  borderRadius: '50px',
  fontSize: '0.95rem',
  background: 'transparent',
  outline: 'none',
  fontFamily: '"Roboto", sans-serif',
  fontWeight: 300,
  color: '#000',
}

export default function ContactPage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // TODO Radu: înlocuiește cu endpoint real
      await new Promise(r => setTimeout(r, 1000))
      setSubmitted(true)
    } catch {
      setError('A apărut o eroare. Vă rugăm încercați din nou.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main style={{
      fontFamily: '"Roboto", sans-serif',
      background: 'linear-gradient(to bottom, #ecffff 340px, #ffffff 340px)',
      minHeight: '100vh',
    }}>
      <div className="max-w-[1000px] mx-auto px-4">

        {/* Titlu pe #ecffff */}
        <div style={{ paddingTop: '60px', paddingBottom: '40px' }}>
          <h1 style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '32px', color: '#6D6E71', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 16px', textAlign: 'left' }}>
            Contact
          </h1>
          
        </div>

        {/* Card gri */}
        <div style={{ background: '#F7F7F7', borderRadius: '0 0 80px 80px', padding: '3rem 2rem', marginBottom: '60px' }}>
<p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '15px', color: '#414042', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            Ai întrebări despre evenimentele noastre, înscrieri sau colaborări?
            Echipa Monza Ares Academy îți stă la dispoziție cu informații complete și suport rapid.
            Completează formularul de mai jos, iar noi te vom contacta în cel mai scurt timp.
          </p>
          <div style={{ maxWidth: '560px', margin: '0 auto', marginTop:'50px' }}>

            {submitted ? (
              <div style={{ background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '25px', padding: '2rem', textAlign: 'center',  }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 400, marginBottom: '0.5rem' }}>Mesajul tău a fost trimis cu succes!</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 300 }}>Te vom contacta în cel mai scurt timp.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{ background: '#fde8e8', color: '#c53030', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input style={inp} placeholder="Prenume *" required value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} />
                  <input style={inp} placeholder="Nume *" required value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))} />
                  <input type="email" style={inp} placeholder="E-Mail *" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                  <input type="tel" style={inp} placeholder="Telefon" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>

                <textarea
                  style={{ ...inp, borderRadius: '25px', height: '120px', resize: 'vertical', display: 'block', marginBottom: '16px' }}
                  placeholder="Cu ce informații te putem ajuta?"
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                />

                <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '12px', color: '#6D6E71', lineHeight: 1.6, marginBottom: '24px', textAlign: 'center' }}>
                  Prin apăsarea butonului Trimite, sunt de acord cu prelucrarea datelor mele cu caracter personal
                  (ce pot include și date cu caracter medical) în vederea furnizării serviciilor de către MONZA ARES.
                  Pentru mai multe informații, accesați pagina{' '}
                  <a href="/politica-confidentialitate" style={{ color: '#065EA6' }}>notei de informare</a>.
                </p>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 text-white rounded-full px-8 py-2 transition-all hover:-translate-y-px"
                    style={{    padding: '0.5rem 4rem', background: '#065EA6', border: 'none', cursor: submitting ? 'default' : 'pointer', fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '13px', opacity: submitting ? 0.7 : 1 }}
                  >
                    {submitting ? 'Se trimite...' : 'Trimite'}
                  </button>
                </div>
              </form>
            )}

           

          </div>
          
        </div>
{/* Contact direct */}
<div style={{ marginTop: '12px', textAlign: 'center', marginBottom:'3rem',}}>
  <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '14px', color: '#6D6E71', marginBottom: '12px' }}>
    Dacă preferi contactul direct, ne poți scrie la:
  </p>
  
   <a href="mailto:academy@monza-ares.ro"
    style={{
      display: 'inline-block',
      color: '#ED3224',
      fontWeight: 400,
      fontSize: '15px',
      textDecoration: 'none',
      border: '1px solid #ED3224',
      borderRadius: '50px',
      padding: '8px 24px',
    }}
  >
    academy@monza-ares.ro
  </a>
</div>
      </div>
    </main>
  )
}
