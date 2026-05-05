'use client'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { getVideoResources, updateVideoResource } from '@/lib/api'
import type { VideoResource } from '@/types'
import { VideoResourceForm } from '@/components/admin/VideoResourceForm'

export default function EditVideoResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [resource, setResource] = useState<VideoResource | null>(null)

  useEffect(() => {
    getVideoResources().then(list => {
      const r = list.find(x => x.id === Number(id)) || null
      setResource(r)
    })
  }, [id])

  if (!resource) return <div style={{ color: '#6D6E71', fontWeight: 300 }}>Se încarcă...</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link href="/admin/video-resources" style={{ color: '#6D6E71', textDecoration: 'none', fontSize: '0.9rem' }}>← Înapoi</Link>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#000', margin: 0, flex: 1 }}>{resource.title}</h1>
        {resource.active && (
          <Link href={`/resurse-video/${resource.slug}`} target="_blank" style={{ padding: '0.4rem 0.85rem', background: '#ecffff', color: '#065EA6', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem' }}>↗ Previzualizare</Link>
        )}
      </div>

      <VideoResourceForm
        resource={resource}
        onResourceUpdate={r => setResource(r)}
        initial={{
          title:             resource.title,
          slug:              resource.slug,
          short_description: resource.short_description ?? '',
          content:           resource.content ?? '',
          video_embed:       resource.video_embed ?? '',
          active:            !!resource.active,
          doctor_ids:        (resource.doctors || []).map(d => d.id),
        }}
        submitLabel="Salvează modificările"
        onSubmit={async state => {
          try {
            const updated = await updateVideoResource(resource.id, {
              title: state.title,
              slug: state.slug,
              short_description: state.short_description,
              content: state.content,
              video_embed: state.video_embed,
              active: state.active,
              doctor_ids: state.doctor_ids,
            })
            setResource(updated)
            alert('Resursă salvată.')
          } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Eroare la salvare')
          }
        }}
      />
    </div>
  )
}
