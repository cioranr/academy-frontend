'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getQuestionnaires, deleteQuestionnaire } from '@/lib/api'
import type { Questionnaire } from '@/types'

export default function QuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getQuestionnaires().then(setQuestionnaires).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (q: Questionnaire) => {
    if (!confirm(`Ștergi chestionarul "${q.title}"? Această acțiune nu poate fi anulată.`)) return
    await deleteQuestionnaire(q.id)
    setQuestionnaires(prev => prev.filter(x => x.id !== q.id))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#000', margin: 0, flex: 1 }}>Chestionare</h1>
        <Link href="/admin/questionnaires/new" style={{ padding: '0.5rem 1.25rem', background: '#065EA6', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
          + Chestionar nou
        </Link>
      </div>

      {loading ? (
        <div style={{ color: '#6D6E71', fontWeight: 300 }}>Se încarcă...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Titlu', 'Descriere', 'Întrebări', 'Data creării', 'Acțiuni'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 500, color: '#6D6E71', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {questionnaires.map((q, i) => (
                <tr key={q.id} style={{ borderBottom: i < questionnaires.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 500 }}>{q.title}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#6D6E71', maxWidth: '300px' }}>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{q.description || '—'}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#374151' }}>{q.questions?.length ?? 0}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#6D6E71', whiteSpace: 'nowrap' }}>{new Date(q.created_at).toLocaleDateString('ro-RO')}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <Link href={`/admin/questionnaires/${q.id}`} style={{ padding: '0.3rem 0.6rem', background: '#ecffff', color: '#065EA6', border: '1px solid #065EA6', borderRadius: '6px', fontSize: '0.75rem', textDecoration: 'none', fontFamily: '"Roboto",sans-serif' }}>Editează</Link>
                      <button onClick={() => handleDelete(q)} style={{ padding: '0.3rem 0.6rem', background: '#1f2937', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Șterge</button>
                    </div>
                  </td>
                </tr>
              ))}
              {questionnaires.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#6D6E71', fontWeight: 300 }}>Niciun chestionar creat.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
