'use client'
import { useEffect, useState, use } from 'react'
import Image from 'next/image'
import { getFeedbackForm, submitFeedbackForm } from '@/lib/api'
import type { PublicFeedbackForm } from '@/lib/api'
import type { QuestionnaireQuestion } from '@/types'

export default function FeedbackFormPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [form, setForm] = useState<PublicFeedbackForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    getFeedbackForm(token)
      .then(data => { setForm(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [token])

  const setAnswer = (questionId: number, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const toggleCheckbox = (questionId: number, option: string) => {
    const current = (answers[questionId] as string[]) ?? []
    const updated = current.includes(option) ? current.filter(v => v !== option) : [...current, option]
    setAnswer(questionId, updated)
  }

  const handleSubmit = async () => {
    if (!form) return

    // Validate required questions
    const missing = form.questionnaire.questions?.filter(q => {
      if (!q.required) return false
      const a = answers[q.id]
      if (!a) return true
      if (Array.isArray(a)) return a.length === 0
      return a.trim() === ''
    })

    if (missing && missing.length > 0) {
      alert(`Vă rugăm să răspundeți la toate întrebările obligatorii (${missing.length} rămasă).`)
      return
    }

    setSubmitting(true)
    try {
      await submitFeedbackForm(token, answers)
      setDone(true)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Eroare la trimitere')
    } finally {
      setSubmitting(false)
    }
  }

  const renderQuestion = (q: QuestionnaireQuestion) => {
    const inp = { padding: '0.65rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem', fontFamily: '"Roboto",sans-serif', color: '#000', width: '100%', outline: 'none', background: '#fff' }

    if (q.type === 'text') {
      return (
        <textarea
          style={{ ...inp, minHeight: '100px', resize: 'vertical' }}
          placeholder="Răspunsul dvs..."
          value={(answers[q.id] as string) ?? ''}
          onChange={e => setAnswer(q.id, e.target.value)}
        />
      )
    }

    if (q.type === 'rating') {
      const val = Number(answers[q.id]) || 0
      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => setAnswer(q.id, String(star))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '2rem', color: star <= val ? '#f59e0b' : '#d1d5db', padding: '0.25rem' }}
            >★</button>
          ))}
        </div>
      )
    }

    if (q.type === 'radio') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(q.options ?? []).map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
              <input type="radio" name={`q-${q.id}`} value={opt} checked={(answers[q.id] as string) === opt} onChange={() => setAnswer(q.id, opt)} />
              {opt}
            </label>
          ))}
        </div>
      )
    }

    if (q.type === 'checkbox') {
      const selected = (answers[q.id] as string[]) ?? []
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(q.options ?? []).map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggleCheckbox(q.id, opt)} />
              {opt}
            </label>
          ))}
        </div>
      )
    }

    return null
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ color: '#6D6E71', fontFamily: '"Roboto",sans-serif' }}>Se încarcă formularul...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ maxWidth: '480px', background: '#fff', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center', fontFamily: '"Roboto",sans-serif' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontWeight: 500, fontSize: '1.25rem', color: '#000', marginBottom: '0.75rem' }}>Formular indisponibil</h1>
          <p style={{ color: '#6D6E71', fontWeight: 300 }}>{error}</p>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ maxWidth: '480px', background: '#fff', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center', fontFamily: '"Roboto",sans-serif' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <h1 style={{ fontWeight: 500, fontSize: '1.5rem', color: '#065EA6', marginBottom: '0.75rem' }}>Mulțumim!</h1>
          <p style={{ color: '#374151', fontWeight: 300, marginBottom: '1.5rem' }}>Feedback-ul dvs. a fost înregistrat. Diploma de participare a fost trimisă pe adresa de email și este disponibilă și în secțiunea <strong>Contul meu</strong>.</p>
          <a href="/" style={{ display: 'inline-block', padding: '0.65rem 2rem', background: '#065EA6', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Înapoi la site</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '"Roboto",sans-serif' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Image src="/logo.svg" alt="Monza Ares Academy" width={100} height={50} style={{ margin: '0 auto 1rem' }} />
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#065EA6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Formular de feedback</div>
          <h1 style={{ fontWeight: 500, fontSize: '1.4rem', color: '#000', margin: '0 0 0.5rem' }}>{form?.event.title}</h1>
          <p style={{ color: '#6D6E71', fontWeight: 300, margin: 0, fontSize: '0.9rem' }}>
            {form?.event.date ? new Date(form.event.date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
            {form?.event.location ? ` · ${form.event.location}` : ''}
          </p>
          {form?.registration && (
            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem', color: '#374151' }}>
              Bună ziua, <strong>{form.registration.first_name} {form.registration.last_name}</strong>! Vă rugăm să completați formularul de feedback.
            </div>
          )}
        </div>

        {form?.questionnaire.description && (
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#78350f' }}>
            {form.questionnaire.description}
          </div>
        )}

        {form?.questionnaire.questions?.map((q, i) => (
          <div key={q.id} style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6D6E71', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>Întrebarea {i + 1}</div>
            <p style={{ fontWeight: 500, fontSize: '0.95rem', color: '#000', margin: '0 0 1rem' }}>
              {q.question}
              {q.required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
            </p>
            {renderQuestion(q)}
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ padding: '0.75rem 2.5rem', background: submitting ? '#9ca3af' : '#065EA6', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', cursor: submitting ? 'default' : 'pointer', fontFamily: '"Roboto",sans-serif', fontWeight: 500 }}
          >
            {submitting ? 'Se trimite...' : 'Trimite feedback'}
          </button>
        </div>
      </div>
    </div>
  )
}
