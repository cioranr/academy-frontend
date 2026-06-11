'use client'
import { useState } from 'react'
import type { Questionnaire, QuestionnaireQuestion } from '@/types'

const inp = { padding: '0.65rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem', background: '#fff', fontFamily: '"Roboto",sans-serif', color: '#000', width: '100%', outline: 'none' }
const Label = ({ children }: { children: React.ReactNode }) => (
  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{children}</label>
)

const QUESTION_TYPES = [
  { value: 'text', label: 'Text liber' },
  { value: 'radio', label: 'Alegere unică' },
  { value: 'checkbox', label: 'Alegere multiplă' },
  { value: 'rating', label: 'Notă (1-5)' },
]

interface QuestionDraft {
  question: string
  type: 'text' | 'radio' | 'checkbox' | 'rating'
  options: string[]
  required: boolean
  order: number
}

interface Props {
  questionnaire?: Questionnaire
  onSave: (title: string, description: string, questions: Partial<QuestionnaireQuestion>[]) => Promise<void>
  saving: boolean
}

export function QuestionnaireForm({ questionnaire, onSave, saving }: Props) {
  const [title, setTitle] = useState(questionnaire?.title ?? '')
  const [description, setDescription] = useState(questionnaire?.description ?? '')
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    questionnaire?.questions?.map(q => ({
      question: q.question,
      type: q.type,
      options: q.options ?? [],
      required: q.required,
      order: q.order,
    })) ?? []
  )

  const addQuestion = () => {
    setQuestions(prev => [...prev, { question: '', type: 'text', options: [], required: true, order: prev.length }])
  }

  const removeQuestion = (i: number) => {
    setQuestions(prev => prev.filter((_, idx) => idx !== i))
  }

  const updateQuestion = (i: number, patch: Partial<QuestionDraft>) => {
    setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, ...patch } : q))
  }

  const addOption = (qi: number) => {
    setQuestions(prev => prev.map((q, idx) => idx === qi ? { ...q, options: [...q.options, ''] } : q))
  }

  const updateOption = (qi: number, oi: number, value: string) => {
    setQuestions(prev => prev.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, oidx) => oidx === oi ? value : o) } : q))
  }

  const removeOption = (qi: number, oi: number) => {
    setQuestions(prev => prev.map((q, idx) => idx === qi ? { ...q, options: q.options.filter((_, oidx) => oidx !== oi) } : q))
  }

  const handleSave = () => {
    if (!title.trim()) { alert('Titlul chestionarului este obligatoriu.'); return }
    onSave(title, description, questions.map((q, i) => ({ ...q, order: i, options: q.options.length ? q.options : null })))
  }

  return (
    <div>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 500, fontSize: '1rem', color: '#000', margin: '0 0 1.25rem' }}>Informații generale</h2>
        <div style={{ marginBottom: '1rem' }}>
          <Label>Titlu *</Label>
          <input style={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Feedback eveniment" />
        </div>
        <div>
          <Label>Descriere</Label>
          <textarea style={{ ...inp, minHeight: '80px', resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Descriere opțională..." />
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontWeight: 500, fontSize: '1rem', color: '#000', margin: 0 }}>Întrebări ({questions.length})</h2>
          <button onClick={addQuestion} style={{ padding: '0.4rem 1rem', background: '#065EA6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontWeight: 500 }}>+ Adaugă întrebare</button>
        </div>

        {questions.length === 0 && (
          <div style={{ color: '#6D6E71', fontWeight: 300, textAlign: 'center', padding: '2rem' }}>Nicio întrebare adăugată. Apasă butonul de mai sus pentru a adăuga.</div>
        )}

        {questions.map((q, qi) => (
          <div key={qi} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <Label>Întrebarea {qi + 1}</Label>
                <input style={inp} value={q.question} onChange={e => updateQuestion(qi, { question: e.target.value })} placeholder="Introduceți întrebarea..." />
              </div>
              <button onClick={() => removeQuestion(qi)} style={{ marginTop: '1.5rem', padding: '0.5rem 0.75rem', background: '#fde8e8', color: '#991b1b', border: 'none', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', whiteSpace: 'nowrap' }}>Șterge</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <Label>Tip răspuns</Label>
                <select style={inp} value={q.type} onChange={e => updateQuestion(qi, { type: e.target.value as QuestionDraft['type'], options: [] })}>
                  {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                <input type="checkbox" id={`req-${qi}`} checked={q.required} onChange={e => updateQuestion(qi, { required: e.target.checked })} />
                <label htmlFor={`req-${qi}`} style={{ fontSize: '0.85rem', color: '#374151', cursor: 'pointer' }}>Obligatoriu</label>
              </div>
            </div>

            {(q.type === 'radio' || q.type === 'checkbox') && (
              <div>
                <Label>Opțiuni</Label>
                {q.options.map((opt, oi) => (
                  <div key={oi} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <input style={{ ...inp, flex: 1 }} value={opt} onChange={e => updateOption(qi, oi, e.target.value)} placeholder={`Opțiunea ${oi + 1}`} />
                    <button onClick={() => removeOption(qi, oi)} style={{ padding: '0.5rem 0.65rem', background: '#fde8e8', color: '#991b1b', border: 'none', borderRadius: '6px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>✕</button>
                  </div>
                ))}
                <button onClick={() => addOption(qi)} style={{ padding: '0.35rem 0.75rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', marginTop: '0.25rem' }}>+ Adaugă opțiune</button>
              </div>
            )}

            {q.type === 'rating' && (
              <div style={{ fontSize: '0.8rem', color: '#6D6E71', fontStyle: 'italic' }}>Participantul va alege o notă de la 1 la 5 stele.</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button onClick={handleSave} disabled={saving} style={{ padding: '0.65rem 2rem', background: saving ? '#9ca3af' : '#065EA6', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9rem', cursor: saving ? 'default' : 'pointer', fontFamily: '"Roboto",sans-serif', fontWeight: 500 }}>
          {saving ? 'Se salvează...' : 'Salvează chestionar'}
        </button>
      </div>
    </div>
  )
}
