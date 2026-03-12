// components/layout/Footer.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth'

const NAV_LINKS = [
  { label: 'Despre noi', href: '/despre-noi' },
  { label: 'Calendar',   href: '/calendar' },
  { label: 'Arhivă',     href: '/arhiva' },
  { label: 'Contact',    href: '/contact' },
]

const LEGAL_LINKS = [
  { label: 'Termeni și condiții',           href: '/termeni-si-conditii' },
  { label: 'Politica de confidențialitate', href: '/politica-confidentialitate' },
  { label: 'Regulament GDPR',               href: '/gdpr' },
  { label: 'Politica cookies',              href: '/politica-cookies' },
]

export function Footer() {
  const { user } = useAuth()

  return (
    <footer style={{ backgroundColor: '#ecffff', fontFamily: '"Roboto", sans-serif' }}>
      <div className="w-full max-w-[1000px] mx-auto px-4 pt-10 pb-6">

        {/* Rândul principal: logo stânga + nav dreapta */}
        <div className="flex flex-row items-start justify-between gap-8">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.svg" alt="Monza Ares Academy" width={80} height={40} quality={90} />
          </Link>

          {/* Dreapta: top bar + nav unul sub altul */}
          <div className="flex flex-col items-end gap-4">

            {/* Top bar înregistrare / contul meu */}
            <div className="flex items-center gap-2 border border-[#ED3224] rounded-[20px] px-3 py-[5px] text-[13px] font-light">
              {user ? (
                <Link href="/dashboard" className="text-black no-underline hover:text-[#ED3224] transition-colors">
                  {user.first_name || user.name}
                </Link>
              ) : (
                <>
                  <Link href="/inregistrare" className="text-black no-underline hover:text-[#ED3224] transition-colors">înregistrare</Link>
                  <span className="text-black font-extrabold">|</span>
                  <Link href="/login" className="text-black no-underline hover:text-[#ED3224] transition-colors">contul meu</Link>
                </>
              )}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#ED3224" className="flex-shrink-0 ml-1">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>

            {/* Nav links — unul sub altul, aliniate dreapta */}
            <ul className="flex flex-col items-end m-0 p-0 list-none gap-2">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] no-underline font-light uppercase hover:text-[#065EA6] transition-colors"
                    style={{ color: '#6D6E71', fontFamily: '"Roboto", sans-serif' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-300 mt-8 mb-4" />

        {/* Legal links + copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">

          {/* Legal links */}
          <ul className="flex flex-wrap items-center justify-center md:justify-start m-0 p-0 list-none gap-x-1 gap-y-1">
            {LEGAL_LINKS.map((link, i) => (
              <li key={link.href} className="flex items-center">
                <Link
                  href={link.href}
                  className="no-underline hover:text-[#065EA6] transition-colors"
                  style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '11px', color: '#6D6E71' }}
                >
                  {link.label}
                </Link>
                {i < LEGAL_LINKS.length - 1 && (
                  <span className="ml-1 text-[#6D6E71]" style={{ fontSize: '11px' }}>|</span>
                )}
              </li>
            ))}
          </ul>

          {/* Copyright */}
          <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '12px', color: '#414042', margin: 0, whiteSpace: 'nowrap' }}>
            © {new Date().getFullYear()} Monza Ares Academy. Toate drepturile rezervate.
          </p>

        </div>

      </div>
    </footer>
  )
}
