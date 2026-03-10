'use client'

import { useState } from 'react'
import Link from 'next/link'

const SPECIALITATI = [
  { value: 'cardiologie', label: 'Cardiologie' },
  { value: 'chirurgie', label: 'Chirurgie cardiovasculară' },
  { value: 'rezidenti', label: 'Rezidenți' },
  { value: 'alta', label: 'Altă specialitate' },
]

export function InscriereForm() {
  const [formData, setFormData] = useState({ prenume: '', nume: '', email: '', telefon: '', departament: '', specialitate: '', mesaj: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!formData.prenume.trim()) e.prenume = 'Prenumele este obligatoriu'
    if (!formData.nume.trim()) e.nume = 'Numele este obligatoriu'
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Email invalid'
    if (!formData.telefon.trim()) e.telefon = 'Telefonul este obligatoriu'
    if (!formData.departament) e.departament = 'Selectează o specialitate'
    return e
  }

  function handleSubmit(e: React.MouseEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSuccess(true)
    setFormData({ prenume: '', nume: '', email: '', telefon: '', departament: '', specialitate: '', mesaj: '' })
    setTimeout(() => setSuccess(false), 5000)
  }

  const inputStyle = {
    width: '100%',
    padding: '1rem 1.25rem',
    border: '2px solid #065ea6',
    borderRadius: '20px',
    fontSize: '0.95rem',
    color: '#000',
    background: 'transparent',
    outline: 'none',
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 300,
    marginBottom: '4px',
  }

  const selectStyle = {
    ...inputStyle,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23065ea6' d='M1 1L6 6L11 1' stroke='%23065ea6' stroke-width='2'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1.25rem center',
    backgroundSize: '12px',
    paddingRight: '3rem',
    cursor: 'pointer',
  }

  return (
    <div style={{ background: 'transparent', padding: '2.5rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h3 style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#000', marginBottom: '2rem', textAlign: 'center' }}>
        Înscrie-te
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input style={{ ...inputStyle, borderColor: errors.prenume ? '#dc3545' : '#065ea6' }} placeholder="Prenume *" value={formData.prenume} onChange={e => setFormData(p => ({ ...p, prenume: e.target.value }))} />
          {errors.prenume && <span style={{ color: '#dc3545', fontSize: '0.8rem' }}>{errors.prenume}</span>}
        </div>
        <div>
          <input style={{ ...inputStyle, borderColor: errors.nume ? '#dc3545' : '#065ea6' }} placeholder="Nume *" value={formData.nume} onChange={e => setFormData(p => ({ ...p, nume: e.target.value }))} />
          {errors.nume && <span style={{ color: '#dc3545', fontSize: '0.8rem' }}>{errors.nume}</span>}
        </div>
        <div>
          <input type="email" style={{ ...inputStyle, borderColor: errors.email ? '#dc3545' : '#065ea6' }} placeholder="E-Mail *" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
          {errors.email && <span style={{ color: '#dc3545', fontSize: '0.8rem' }}>{errors.email}</span>}
        </div>
        <div>
          <input type="tel" style={{ ...inputStyle, borderColor: errors.telefon ? '#dc3545' : '#065ea6' }} placeholder="Telefon *" value={formData.telefon} onChange={e => setFormData(p => ({ ...p, telefon: e.target.value }))} />
          {errors.telefon && <span style={{ color: '#dc3545', fontSize: '0.8rem' }}>{errors.telefon}</span>}
        </div>
        <div className="col-span-1 md:col-span-2">
          <select style={selectStyle} value={formData.specialitate} onChange={e => setFormData(p => ({ ...p, specialitate: e.target.value }))}>
            <option value="">Grad profesional</option>
            <option value="medic-primar">Medic primar</option>
            <option value="medic-specialist">Medic specialist</option>
            <option value="medic-rezident">Medic rezident</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div className="col-span-1 md:col-span-2">
          <select style={{ ...selectStyle, borderColor: errors.departament ? '#dc3545' : '#065ea6' }} value={formData.departament} onChange={e => setFormData(p => ({ ...p, departament: e.target.value }))}>
            <option value="">Specialitate</option>
            {SPECIALITATI.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          {errors.departament && <span style={{ color: '#dc3545', fontSize: '0.8rem' }}>{errors.departament}</span>}
        </div>
      </div>

      <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '0.85rem', color: '#666', lineHeight: 1.5, margin: '1rem 0 1.5rem' }}>
        Prin apăsarea butonului <strong style={{ color: '#000' }}>Trimite</strong>, sunt de acord cu prelucrarea datelor mele cu caracter personal (ce pot include și date cu caracter medical) în vederea furnizării serviciilor de către MONZA ARES. Pentru mai multe informații, accesați pagina cu <Link href="/politica-confidentialitate" style={{ color: '#065ea6' }}>Nota de informare</Link>.
      </p>

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="transition-all hover:-translate-y-px"
          style={{ background: '#065EA6', border: 'none', borderRadius: '50px', color: '#fff', padding: '0.5rem 2rem', fontSize: '1.1rem', fontWeight: 300, cursor: 'pointer', minWidth: '200px', fontFamily: '"Roboto", sans-serif', boxShadow: '0 4px 15px rgba(6,94,166,0.3)' }}
        >
          Trimite
        </button>
      </div>

      {success && (
        <div style={{ background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '25px', padding: '1rem', marginTop: '1.5rem', textAlign: 'center', fontFamily: '"Roboto", sans-serif' }}>
          Cererea ta a fost înregistrată cu succes!
        </div>
      )}
    </div>
  )
}
