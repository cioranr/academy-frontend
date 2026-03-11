'use client'
import { useEffect, useState } from 'react'
import { getEvents } from '@/lib/api'
import type { BackendEvent } from '@/types'
import { FeaturedWorkshop } from '@/components/sections/FeaturedWorkshop'

export default function CalendarPage() {
  const [events, setEvents] = useState<BackendEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getEvents().then(setEvents).catch(console.error).finally(() => setLoading(false)) }, [])

  return (
    <main style={{ background: '#ecffff', fontFamily: '"Roboto",sans-serif', minHeight: '100vh' }}>
      <div className="max-w-[1000px] mx-auto px-4 pt-12 pb-6">
        <h1 style={{ fontFamily: '"Roboto",sans-serif', fontWeight: 300, fontSize: '32px', color: '#6D6E71', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Calendar</h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6D6E71', fontWeight: 300 }}>Se încarcă evenimentele...</div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6D6E71', fontWeight: 300 }}>Niciun eveniment disponibil momentan.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
          {events.map(ev => (
            // FeaturedWorkshop has marginTop: -60px designed to overlap the Hero.
            // paddingTop: 60px on the wrapper counteracts it so cards stack normally.
            <div key={ev.id} style={{ paddingTop: '60px' }}>
              <FeaturedWorkshop event={ev} />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
