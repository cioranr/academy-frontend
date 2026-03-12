'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Acasă',      href: '/' },
  { label: 'Despre noi', href: '/despre-noi' },
  { label: 'Calendar',   href: '/calendar' },
  { label: 'Arhivă',     href: '/arhiva' },
  { label: 'Contact',    href: '/contact' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleLogout = async () => { await logout(); router.push('/') }

  return (
    <>
      <header style={{ backgroundColor: '#ecffff', fontFamily: '"Roboto", sans-serif' }}>
        <div className="w-full max-w-[1000px] mx-auto px-4">
          <div className="flex items-start justify-center gap-0">

            {/* Logo desktop */}
            <div className="hidden md:flex items-center w-[280px] lg:w-[300px] flex-shrink-0">
              <Link href="/">
                <Image src="/logo.svg" alt="Monza Ares Academy" width={120} height={60} quality={90} />
              </Link>
            </div>

            <div className="flex-1 max-w-[700px] pt-3">

              {/* Top bar */}
              <div className="flex justify-end items-center gap-4 text-sm mb-3">
                <div className="flex items-center gap-2 border border-[#ED3224] rounded-[20px] px-3 py-[5px] text-[13px] font-light">
                  {!loading && (
                    <>
                      {user ? (
                        <>
                          <Link href={user.role === 'admin' || user.role === 'events_manager' ? '/admin' : '/dashboard'} className="no-underline hover:text-[#065EA6] transition-colors" style={{ color: '#414042' }}>
                            {user.first_name || user.name}
                          </Link>
                          <span className="text-black font-extrabold">|</span>
                          <button onClick={handleLogout} className="bg-transparent border-none cursor-pointer text-[13px] font-light hover:text-[#ED3224] transition-colors" style={{ color: '#414042', padding: 0 }}>
                            Deconectare
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href="/inregistrare" className="no-underline hover:text-[#ED3224] transition-colors" style={{ color: '#414042' }}>înregistrare</Link>
                          <span className="text-black font-extrabold">|</span>
                          <Link href="/login" className="no-underline hover:text-[#ED3224] transition-colors" style={{ color: '#414042' }}>contul meu</Link>
                        </>
                      )}
                    </>
                  )}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#ED3224" className="flex-shrink-0 ml-1">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>

              {/* Nav row */}
              <nav className="flex items-center justify-between pt-2">

                {/* Logo mobile */}
                <Link href="/" className="block md:hidden">
                  <Image src="/logo.svg" alt="Monza Ares Academy" width={75} height={38} quality={90} />
                </Link>

                {/* Burger */}
                <button
                  className="md:hidden border-none bg-transparent p-2 focus:outline-none ml-auto"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Deschide meniul"
                >
                  <div className="burger">
                    <span />
                    <span />
                  </div>
                </button>

                {/* Nav desktop — fara Acasa */}
                <div className="hidden md:flex items-end w-full justify-end">
                  <ul className="flex items-center m-0 p-0 list-none">
                    {NAV_LINKS.filter(l => l.href !== '/').map((link, i, arr) => (
                      <li key={link.href} className="flex items-center">
                        <Link href={link.href} className="text-[13px] no-underline px-1 font-light uppercase hover:text-[#065EA6] transition-colors" style={{ color: '#6D6E71' }}>
                          {link.label}
                        </Link>
                        {i < arr.length - 1 && <span className="text-black font-extrabold ml-2 text-[13px]">|</span>}
                      </li>
                    ))}
                    {!loading && user && (user.role === 'admin' || user.role === 'events_manager') && (
                      <li className="flex items-center">
                        <span className="text-black font-extrabold ml-2 text-[13px]">|</span>
                        <Link href="/admin" className="text-[13px] no-underline px-1 font-light uppercase hover:text-[#065EA6] transition-colors" style={{ color: '#ED3224' }}>Admin</Link>
                      </li>
                    )}
                  </ul>
                </div>

              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Meniu mobil fullscreen */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            width: '100vw', height: '100vh',
            zIndex: 99999,
            backgroundColor: '#ecffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Roboto", sans-serif',
          }}
        >
          {/* Logo in meniu — stanga sus */}
          <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <Image src="/logo.svg" alt="Monza Ares Academy" width={70} height={35} quality={90} />
            </Link>
          </div>

          {/* Buton inchide — dreapta sus */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '24px', right: '20px',
              border: '1px solid #ED3224',
              borderRadius: '20px',
              padding: '6px 16px',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: '"Roboto", sans-serif',
              fontWeight: 300,
              fontSize: '13px',
              color: '#ED3224',
            }}
          >
            închide meniul
          </button>

          {/* Links — toate, inclusiv Acasa */}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{ color: '#6D6E71', fontWeight: 300, fontSize: '18px', textDecoration: 'none', textTransform: 'uppercase', display: 'block', padding: '10px 0', fontFamily: '"Roboto", sans-serif' }}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li style={{ width: '100px', borderTop: '1px solid #e0e0e0', margin: '16px 0' }} />

            {!loading && (user ? (
              <>
                <li>
                  <Link
                    href={user.role === 'admin' || user.role === 'events_manager' ? '/admin' : '/dashboard'}
                    onClick={() => setMenuOpen(false)}
                    style={{ color: '#6D6E71', fontWeight: 300, fontSize: '18px', textDecoration: 'none', textTransform: 'uppercase', display: 'block', padding: '10px 0', fontFamily: '"Roboto", sans-serif' }}
                  >
                    Contul meu
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false) }}
                    style={{ color: '#ED3224', fontWeight: 300, fontSize: '18px', textTransform: 'uppercase', background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px 0', fontFamily: '"Roboto", sans-serif' }}
                  >
                    Deconectare
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    style={{ color: '#6D6E71', fontWeight: 300, fontSize: '18px', textDecoration: 'none', textTransform: 'uppercase', display: 'block', padding: '10px 0', fontFamily: '"Roboto", sans-serif' }}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/inregistrare"
                    onClick={() => setMenuOpen(false)}
                    style={{ color: '#6D6E71', fontWeight: 300, fontSize: '18px', textDecoration: 'none', textTransform: 'uppercase', display: 'block', padding: '10px 0', fontFamily: '"Roboto", sans-serif' }}
                  >
                    Înregistrare
                  </Link>
                </li>
              </>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .burger { width: 30px; height: 10px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; }
        .burger span { display: block; width: 100%; height: 2px; background: #065EA6; border-radius: 2px; }
      `}</style>
    </>
  )
}
