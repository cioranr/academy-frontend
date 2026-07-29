import type { Metadata } from 'next'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
const STORAGE_BASE = API_BASE.replace(/\/api$/, '')

function absoluteImage(path: string | null | undefined): string | undefined {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  return `${STORAGE_BASE}${path}`
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const event = await fetch(`${API_BASE}/events/${slug}`, { cache: 'no-store' }).then(r => r.json())
    const title       = event.meta_title       || event.title
    const description = event.meta_description || event.description?.substring(0, 160) || undefined
    const ogImage     = absoluteImage(event.image_big || event.image) || '/monza-ares-academy-og.png'
    const images      = [{ url: ogImage, alt: event.title }]
    return {
      title:       event.meta_title ? { absolute: title } : title,
      description,
      openGraph: {
        title,
        description,
        locale: 'ro_RO',
        type:   'website',
        images,
      },
      twitter: {
        card:        'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    }
  } catch {
    return {}
  }
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
