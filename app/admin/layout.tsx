'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

const MENU = [
  { label: 'Sumar', href: '/admin', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { label: 'Evenimente', href: '/admin/events', icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
  { label: 'Testimoniale', href: '/admin/testimonials', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
  { label: 'Utilizatori', href: '/admin/users', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'admin' && user.role !== 'events_manager'))) router.replace('/login')
  }, [user, loading, router])

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}><div style={{ color: '#065EA6', fontFamily: '"Roboto",sans-serif', fontWeight: 300 }}>Se încarcă...</div></div>
  if (!user) return null

  const isActive = (href: string) => href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '"Roboto",sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100, transform: sidebarOpen ? 'translateX(0)' : undefined, transition: 'transform 0.3s' }} className="hidden md:flex flex-col">
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#065EA6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>MONZA ARES</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#065EA6' }}>Academy Admin</div>
          </Link>
        </div>
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {MENU.map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: isActive(item.href) ? 500 : 400, background: isActive(item.href) ? '#ecffff' : 'transparent', color: isActive(item.href) ? '#065EA6' : '#6D6E71', transition: 'all 0.15s' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '10px', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#000' }}>{user.first_name || user.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#6D6E71', fontWeight: 300 }}>{user.role === 'admin' ? 'Administrator' : 'Manager'}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href="/" style={{ flex: 1, padding: '0.5rem', background: '#ecffff', color: '#065EA6', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem', textAlign: 'center', fontWeight: 400 }}>Site</Link>
            <button onClick={() => { logout(); router.push('/') }} style={{ flex: 1, padding: '0.5rem', background: '#fde8e8', color: '#ED3224', borderRadius: '8px', border: 'none', fontSize: '0.8rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontWeight: 400 }}>Ieșire</button>
          </div>
        </div>
      </aside>
      {/* Mobile sidebar toggle */}
      <div className="md:hidden" style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 200 }}>
        <button onClick={() => setSidebarOpen(v => !v)} style={{ background: '#065EA6', border: 'none', borderRadius: '8px', color: '#fff', padding: '0.5rem 0.75rem', cursor: 'pointer' }}>☰</button>
      </div>
      {/* Main content */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '2rem', minHeight: '100vh' }} className="md:ml-[240px] ml-0">
        {children}
      </div>
    </div>
  )
}
