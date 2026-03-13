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
      <div className="w-full max-w-[1000px] mx-auto px-4 pb-6">

        {/* ── DESKTOP ── logo stânga + nav dreapta pe rând */}
        <div className="hidden md:flex items-end justify-center gap-0">

          <div className="items-start w-[280px] lg:w-[300px] flex-shrink-0 flex">
            <Image src="/logo.svg" alt="Monza Ares Academy" width={80} height={40} quality={90} />
          </div>

          <div className="flex-1 max-w-[700px] flex flex-col justify-end">
            <div className="flex justify-end items-center gap-4 mb-4">
              <div className="flex items-center gap-2 border border-monza-red rounded-[20px] px-3 py-[5px] text-[13px] font-light">
                {user ? (
                  <Link href="/dashboard" className="text-black no-underline hover:text-monza-red transition-colors">
                    {user.first_name || user.name}
                  </Link>
                ) : (
                  <>
                    <Link href="/inregistrare" className="text-black no-underline hover:text-monza-red transition-colors">înregistrare</Link>
                    <span className="text-black font-extrabold">|</span>
                    <Link href="/login" className="text-black no-underline hover:text-monza-red transition-colors">contul meu</Link>
                  </>
                )}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ED3224" className="flex-shrink-0 ml-1">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
            <div className="flex justify-end">
              <ul className="flex items-center m-0 p-0 list-none">
                {NAV_LINKS.map((link, i) => (
                  <li key={link.href} className="flex items-center">
                    <Link href={link.href} className="text-[13px] no-underline text-black px-1 font-light uppercase hover:text-monza-blue transition-colors" style={{ fontFamily: '"Roboto", sans-serif' }}>
                      {link.label}
                    </Link>
                    {i < NAV_LINKS.length - 1 && <span className="text-black font-extrabold ml-2 text-[13px]">|</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── MOBILE ── logo stânga + nav dreapta unul sub altul */}
        <div className="flex md:hidden items-start justify-between pt-6 gap-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.svg" alt="Monza Ares Academy" width={70} height={35} quality={90} />
          </Link>

          {/* Dreapta: top bar + nav unul sub altul */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2 border border-[#ED3224] rounded-[20px] px-3 py-[5px] text-[13px] font-light">
              {user ? (
                <Link href="/dashboard" className="text-black no-underline" style={{ color: '#414042' }}>
                  {user.first_name || user.name}
                </Link>
              ) : (
                <>
                  <Link href="/inregistrare" style={{ color: '#414042', textDecoration: 'none', fontSize: '13px', fontWeight: 300 }}>înregistrare</Link>
                  <span className="text-black font-extrabold">|</span>
                  <Link href="/login" style={{ color: '#414042', textDecoration: 'none', fontSize: '13px', fontWeight: 300 }}>contul meu</Link>
                </>
              )}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#ED3224" className="flex-shrink-0 ml-1">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>

            <ul className="flex flex-col items-end m-0 p-0 list-none gap-2">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} style={{ color: '#6D6E71', fontWeight: 300, fontSize: '13px', textDecoration: 'none', textTransform: 'uppercase', fontFamily: '"Roboto", sans-serif' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── SEPARATOR ── */}
        <div className="border-t border-gray-300 mt-6 mb-4" />

        {/* ── LEGAL + COPYRIGHT ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <ul className="flex flex-wrap items-center justify-center md:justify-start m-0 p-0 list-none gap-x-1 gap-y-1">
            {LEGAL_LINKS.map((link, i) => (
              <li key={link.href} className="flex items-center">
                <Link href={link.href} style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '11px', color: '#6D6E71', textDecoration: 'none' }}
                  className="hover:text-[#065EA6] transition-colors">
                  {link.label}
                </Link>
                {i < LEGAL_LINKS.length - 1 && <span className="ml-1" style={{ fontSize: '11px', color: '#6D6E71' }}>|</span>}
              </li>
            ))}
          </ul>
          <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '12px', color: '#414042', margin: 0, whiteSpace: 'nowrap' }}>
            © {new Date().getFullYear()} Monza Ares Academy. Toate drepturile rezervate.
          </p>
        </div>

      </div>
    </footer>
  )
}
