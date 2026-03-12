import type { Metadata } from 'next'
import { ConditionalNav } from '@/components/layout/ConditionalNav'
import { AuthProvider } from '@/lib/auth'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'MONZA ARES Academy', template: '%s | MONZA ARES Academy' },
  description: 'Platforma educațională a celei mai mari rețele private integrate de cardiologie din România, dedicată formării și perfecționării continue.',
  openGraph: {
    title: 'MONZA ARES Academy',
    description: 'Platforma educațională a celei mai mari rețele private de cardiologie din România.',
    locale: 'ro_RO', type: 'website',
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
        </AuthProvider>
      </body>
    </html>
  )
}