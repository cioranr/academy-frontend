'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => { if (!loading && !user) router.replace('/login') }, [user, loading, router])
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ecffff' }}><div style={{ color: '#065EA6', fontSize: '1.1rem', fontFamily: '"Roboto",sans-serif', fontWeight: 300 }}>Se încarcă...</div></div>
  if (!user) return null
  return <>{children}</>
}
