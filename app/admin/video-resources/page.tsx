'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getVideoResources, deleteVideoResource } from '@/lib/api'
import type { VideoResource } from '@/types'

export default function AdminVideoResourcesPage() {
  const [items, setItems] = useState<VideoResource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getVideoResources().then(setItems).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (item: VideoResource) => {
    if (!confirm(`Ștergi definitiv resursa „${item.title}”?`)) return
    await deleteVideoResource(item.id)
    setItems(prev => prev.filter(i => i.id !== item.id))
  }

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/resurse-video/${slug}`
    navigator.clipboard.writeText(url).then(() => alert('Link copiat: ' + url))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#000', margin: 0, flex: 1 }}>Resurse video</h1>
        <Link href="/admin/video-resources/new" style={{ padding: '0.65rem 1.5rem', background: '#065EA6', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem' }}>+ Resursă nouă</Link>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#6D6E71', fontWeight: 300, marginBottom: '1.5rem' }}>
        Resursele video sunt accesibile doar prin link direct sau cod QR. Nu apar în liste publice, în search și sunt marcate <code>noindex</code>.
      </p>

      {loading ? <div style={{ color: '#6D6E71', fontWeight: 300 }}>Se încarcă...</div> : (
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {items.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6D6E71', fontWeight: 300 }}>Nicio resursă încă.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Titlu', 'Slug', 'Doctori', 'Status', 'Actualizat', 'Acțiuni'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 500, color: '#6D6E71', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={it.id} style={{ borderBottom: i < items.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', fontWeight: 400 }}>{it.title}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#6D6E71', fontFamily: 'monospace' }}>/{it.slug}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>{it.doctors?.length || 0}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ background: it.active ? '#d1fae5' : '#f3f4f6', color: it.active ? '#065f46' : '#6b7280', borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 500 }}>
                        {it.active ? 'Activ' : 'Inactiv'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#6D6E71', whiteSpace: 'nowrap' }}>{new Date(it.updated_at).toLocaleDateString('ro-RO')}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button onClick={() => copyLink(it.slug)} style={{ padding: '0.3rem 0.6rem', background: '#ecffff', color: '#065EA6', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Copiază link</button>
                        <Link href={`/admin/video-resources/${it.id}`} style={{ padding: '0.3rem 0.6rem', background: '#f3f4f6', color: '#374151', borderRadius: '6px', fontSize: '0.75rem', textDecoration: 'none' }}>Editează</Link>
                        <button onClick={() => handleDelete(it)} style={{ padding: '0.3rem 0.6rem', background: '#fde8e8', color: '#991b1b', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif' }}>Șterge</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
