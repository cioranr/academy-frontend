import type { Metadata } from 'next'
import { ConditionalNav } from '@/components/layout/ConditionalNav'
import { AuthProvider } from '@/lib/auth'
import CookieConsent from '@/components/ui/CookieConsent'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://monza-ares-academy.ro'),
  title: { default: 'MONZA ARES Academy', template: '%s | MONZA ARES Academy' },
  description: 'Platforma educațională a celei mai mari rețele private integrate de cardiologie din România, dedicată formării și perfecționării continue.',
  openGraph: {
    title: 'MONZA ARES Academy',
    description: 'Platforma educațională a celei mai mari rețele private de cardiologie din România.',
    locale: 'ro_RO', type: 'website',
    images: [{ url: '/monza-ares-academy-og.png', width: 1200, height: 630, alt: 'MONZA ARES Academy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MONZA ARES Academy',
    description: 'Platforma educațională a celei mai mari rețele private de cardiologie din România.',
    images: ['/monza-ares-academy-og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>
        <AuthProvider>
          <ConditionalNav>
            <main>{children}</main>
          </ConditionalNav>
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  )
}