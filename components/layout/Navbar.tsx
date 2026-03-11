'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

const NAV_LINKS = [
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
  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [menuOpen])

  const handleLogout = async () => { await logout(); router.push('/') }

  return (
    <header className="monza-header">
      <div className="w-full max-w-[1000px] mx-auto px-4">
        <div className="flex items-start justify-center gap-0">
          <div className="hidden md:flex items-center w-[280px] lg:w-[300px] flex-shrink-0 relative">
            <Link href="/"><Image src="/logo.svg" alt="Monza Ares Academy" width={120} height={60} quality={90} /></Link>
          </div>
          <div className="flex-1 max-w-[700px] pt-3 relative z-[3]">
            {/* Top bar */}
            <div className="flex justify-end items-center gap-4 text-sm mb-3">
              <div className="flex items-center gap-2 border border-monza-red rounded-[20px] px-3 py-[5px] text-[13px] font-light">
                {!loading && (
                  <>
                    {user ? (
                      <>
                        <Link href={user.role === 'admin' || user.role === 'events_manager' ? '/admin' : '/dashboard'} className="no-underline hover:text-monza-blue transition-colors" style={{ color: '#414042' }}>
                          {user.first_name || user.name}
                        </Link>
                        <span className="text-black font-extrabold">|</span>
                        <button onClick={handleLogout} className="bg-transparent border-none cursor-pointer text-[13px] font-light hover:text-monza-red transition-colors" style={{ color: '#414042', padding: 0 }}>
                          Deconectare
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/inregistrare" className="no-underline hover:text-monza-red transition-colors" style={{ color: '#414042' }}>înregistrare</Link>
                        <span className="text-black font-extrabold">|</span>
                        <Link href="/login" className="no-underline hover:text-monza-red transition-colors" style={{ color: '#414042' }}>contul meu</Link>
                      </>
                    )}
                  </>
                )}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ED3224" className="flex-shrink-0 ml-1">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
            {/* Nav */}
            <div className="pt-2 relative z-[1]">
              <nav className="flex items-center justify-between">
                <Link href="/" className="block md:hidden">
                  <div className="w-[120px] h-[44px] bg-monza-blue rounded flex items-center justify-center">
                    <span className="text-white font-bold text-[10px] tracking-widest text-center leading-tight">MONZA ARES<br/><span className="text-[8px]">ACADEMY</span></span>
                  </div>
                </Link>
                <button className="md:hidden border-none bg-transparent p-2 z-[10000] relative focus:outline-none ml-auto" onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} aria-label="Toggle navigation">
                  <span className={`burger-icon ${menuOpen ? 'open' : ''}`} />
                </button>
                <div className="hidden md:flex flex-col items-end w-full">
                  <ul className="flex items-center m-0 p-0 list-none">
                    {NAV_LINKS.map((link, i) => (
                      <li key={link.href} className="flex items-center">
                        <Link href={link.href} className="text-[13px] no-underline px-1 font-light uppercase hover:text-monza-blue transition-colors" style={{ color: '#6D6E71' }}>{link.label}</Link>
                        {i < NAV_LINKS.length - 1 && <span className="text-black font-extrabold ml-2 text-[13px]">|</span>}
                      </li>
                    ))}
                    {!loading && user && (user.role === 'admin' || user.role === 'events_manager') && (
                      <li className="flex items-center">
                        <span className="text-black font-extrabold ml-2 text-[13px]">|</span>
                        <Link href="/admin" className="text-[13px] no-underline px-1 font-light uppercase hover:text-monza-blue transition-colors" style={{ color: '#ED3224' }}>Admin</Link>
                      </li>
                    )}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={['fixed top-0 left-0 w-screen h-screen z-[9999]','flex flex-col justify-center px-5 py-16','transition-transform duration-400 ease-in-out md:hidden',menuOpen ? 'translate-y-0' : '-translate-y-full'].join(' ')} style={{ background: '#ecffff' }}>
        <ul className="list-none p-0 m-0 flex flex-col items-center gap-2">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setMenuOpen(false)} className="text-2xl py-4 text-center no-underline text-black font-medium uppercase hover:text-monza-blue transition-colors block">{link.label}</Link>
            </li>
          ))}
          {!loading && (user ? (
            <>
              <li><Link href={user.role === 'admin' || user.role === 'events_manager' ? '/admin' : '/dashboard'} onClick={() => setMenuOpen(false)} className="text-2xl py-4 text-center no-underline font-medium uppercase block" style={{ color: '#065EA6' }}>Contul meu</Link></li>
              <li><button onClick={() => { handleLogout(); setMenuOpen(false) }} className="text-2xl py-4 bg-transparent border-none cursor-pointer font-medium uppercase" style={{ color: '#ED3224' }}>Deconectare</button></li>
            </>
          ) : (
            <>
              <li><Link href="/login" onClick={() => setMenuOpen(false)} className="text-2xl py-4 text-center no-underline font-medium uppercase block" style={{ color: '#065EA6' }}>Login</Link></li>
              <li><Link href="/inregistrare" onClick={() => setMenuOpen(false)} className="text-2xl py-4 text-center no-underline font-medium uppercase block" style={{ color: '#065EA6' }}>Înregistrare</Link></li>
            </>
          ))}
        </ul>
      </div>
      <style>{`.monza-header{background-color:#ecffff;font-family:"Roboto",sans-serif}.burger-icon,.burger-icon::before,.burger-icon::after{content:'';display:block;width:35px;height:3px;background:#065EA6;margin:0;border-radius:2px;position:relative;transition:all .3s ease}.burger-icon::before{top:-8px}.burger-icon::after{top:8px}.burger-icon.open{background:transparent}.burger-icon.open::before{transform:rotate(45deg);top:0;background:#ED3224}.burger-icon.open::after{transform:rotate(-45deg);top:0;background:#ED3224}`}</style>
    </header>
  )
}
