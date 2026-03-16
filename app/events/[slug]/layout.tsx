import type { Metadata } from 'next'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const event = await fetch(`${API_BASE}/events/${slug}`, { cache: 'no-store' }).then(r => r.json())
    const title       = event.meta_title       || event.title
    const description = event.meta_description || event.description?.substring(0, 160) || undefined
    return {
      title:       event.meta_title ? { absolute: title } : title,
      description,
      openGraph: {
        title,
        description,
        locale: 'ro_RO',
        type:   'website',
      },
      twitter: {
        card:        'summary_large_image',
        title,
        description,
      },
    }
  } catch {
    return {}
  }
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
