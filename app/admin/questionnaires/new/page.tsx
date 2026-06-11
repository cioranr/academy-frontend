'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createQuestionnaire } from '@/lib/api'
import { QuestionnaireForm } from '@/components/admin/QuestionnaireForm'
import type { QuestionnaireQuestion } from '@/types'

export default function NewQuestionnairePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const handleSave = async (title: string, description: string, questions: Partial<QuestionnaireQuestion>[]) => {
    setSaving(true)
    try {
      await createQuestionnaire({ title, description, questions })
      router.push('/admin/questionnaires')
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Eroare la salvare')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link href="/admin/questionnaires" style={{ color: '#6D6E71', textDecoration: 'none', fontSize: '0.9rem' }}>← Înapoi</Link>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#000', margin: 0 }}>Chestionar nou</h1>
      </div>
      <QuestionnaireForm onSave={handleSave} saving={saving} />
    </div>
  )
}
