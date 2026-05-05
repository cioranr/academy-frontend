'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createVideoResource } from '@/lib/api'
import { VideoResourceForm } from '@/components/admin/VideoResourceForm'

export default function NewVideoResourcePage() {
  const router = useRouter()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link href="/admin/video-resources" style={{ color: '#6D6E71', textDecoration: 'none', fontSize: '0.9rem' }}>← Înapoi</Link>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#000', margin: 0 }}>Resursă video nouă</h1>
      </div>

      <VideoResourceForm
        initial={{ title: '', slug: '', short_description: '', content: '', video_embed: '', active: false, doctor_ids: [] }}
        submitLabel="Creează resursa"
        onSubmit={async state => {
          try {
            const created = await createVideoResource({
              title: state.title,
              slug: state.slug || undefined,
              short_description: state.short_description || undefined,
              content: state.content || undefined,
              video_embed: state.video_embed || undefined,
              active: state.active,
              doctor_ids: state.doctor_ids,
            })
            router.push(`/admin/video-resources/${created.id}`)
          } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Eroare la salvare')
          }
        }}
      />
    </div>
  )
}
