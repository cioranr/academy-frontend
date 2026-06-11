'use client'
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getQuestionnaire, updateQuestionnaire } from '@/lib/api'
import { QuestionnaireForm } from '@/components/admin/QuestionnaireForm'
import type { Questionnaire, QuestionnaireQuestion } from '@/types'

export default function EditQuestionnairePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getQuestionnaire(Number(id)).then(setQuestionnaire).finally(() => setLoading(false))
  }, [id])

  const handleSave = async (title: string, description: string, questions: Partial<QuestionnaireQuestion>[]) => {
    setSaving(true)
    try {
      await updateQuestionnaire(Number(id), { title, description, questions })
      router.push('/admin/questionnaires')
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Eroare la salvare')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ color: '#6D6E71', fontWeight: 300 }}>Se încarcă...</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link href="/admin/questionnaires" style={{ color: '#6D6E71', textDecoration: 'none', fontSize: '0.9rem' }}>← Înapoi</Link>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#000', margin: 0 }}>Editează chestionar</h1>
      </div>
      {questionnaire && <QuestionnaireForm questionnaire={questionnaire} onSave={handleSave} saving={saving} />}
    </div>
  )
}
