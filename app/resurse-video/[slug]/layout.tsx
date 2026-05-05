import type { Metadata } from 'next'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  let title = 'Resursă video'
  let description: string | undefined

  try {
    const res = await fetch(`${API_BASE}/video-resources/${slug}`, { cache: 'no-store' })
    if (res.ok) {
      const r = await res.json()
      title = r.title || title
      description = r.short_description || undefined
    }
  } catch { /* keep defaults */ }

  // Always noindex/nofollow — these pages are private/QR-shared.
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false, noimageindex: true, 'max-snippet': -1, 'max-image-preview': 'none', 'max-video-preview': -1 },
    },
  }
}

export default function VideoResourceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
