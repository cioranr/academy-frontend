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

export function Footer() {
  const { user } = useAuth()

  return (
    <footer style={{ backgroundColor: '#ecffff', fontFamily: '"Roboto", sans-serif' }}>
      <div className="w-full max-w-[1000px] mx-auto px-4 pb-6">
        <div className="flex items-end justify-center gap-0">

          {/* Logo — mai mic, aliniat sus */}
          <div className="hidden md:flex items-start w-[280px] lg:w-[300px] flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="Monza Ares Academy"
              width={80}
              height={40}
              quality={90}
            />
          </div>

          {/* Coloana dreapta — meniul aliniat jos la nivelul textului "Academy" */}
          <div className="flex-1 max-w-[700px] flex flex-col justify-end">
            {/* Top bar cu înregistrare + contul meu */}
            <div className="flex justify-end items-center gap-4 mb-4">
              <div className="flex items-center gap-2 border border-monza-red rounded-[20px] px-3 py-[5px] text-[13px] font-light">
                {user ? (
                  <Link href="/dashboard" className="text-black no-underline hover:text-monza-red transition-colors">
                    {user.first_name || user.name}
                  </Link>
                ) : (
                  <>
                    <Link href="/inregistrare" className="text-black no-underline hover:text-monza-red transition-colors">
                      înregistrare
                    </Link>
                    <span className="text-black font-extrabold">|</span>
                    <Link href="/login" className="text-black no-underline hover:text-monza-red transition-colors">
                      contul meu
                    </Link>
                  </>
                )}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ED3224" className="flex-shrink-0 ml-1">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
            {/* Nav links */}
            <div className="flex justify-end">
              <ul className="flex items-center m-0 p-0 list-none">
                {NAV_LINKS.map((link, i) => (
                  <li key={link.href} className="flex items-center">
                    <Link
                      href={link.href}
                      className="text-[13px] no-underline text-black px-1 font-light uppercase hover:text-monza-blue transition-colors"
                      style={{ fontFamily: '"Roboto", sans-serif' }}
                    >
                      {link.label}
                    </Link>
                    {i < NAV_LINKS.length - 1 && (
                      <span className="text-black font-extrabold ml-2 text-[13px]">|</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
<div className="border-t border-gray-300 mt-6 mb-4" />
        {/* Copyright */}
        <div className="mt-6 text-center">
          <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '12px', color: '#414042' }}>
            © {new Date().getFullYear()} Monza Ares Academy. Toate drepturile rezervate.
          </p>
        </div>

      </div>
    </footer>
  )
}
