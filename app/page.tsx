import { Hero }             from '@/components/sections/Hero'
import { About }            from '@/components/sections/About'
import { EventsCarousel }   from '@/components/sections/EventsCarousel'
import { Testimonial }      from '@/components/sections/Testimonial'
import { FeaturedWorkshop } from '@/components/sections/FeaturedWorkshop'
import type { BackendEvent, BackendTestimonial } from '@/types'

export const dynamic = 'force-dynamic'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

async function fetchEvents(): Promise<BackendEvent[]> {
  try {
    const res = await fetch(`${API}/events`)
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

async function fetchTestimonials(): Promise<BackendTestimonial[]> {
  try {
    const res = await fetch(`${API}/testimonials`)
    if (!res.ok) return []
    const list: BackendTestimonial[] = await res.json()
    return list.filter(t => t.active)
  } catch { return [] }
}

// An event is over once its last day (end_date, or date for one-day events) has passed.
function isPast(ev: BackendEvent, today: string): boolean {
  return (ev.end_date ?? ev.date).substring(0, 10) < today
}

export default async function HomePage() {
  const [events, testimonials] = await Promise.all([fetchEvents(), fetchTestimonials()])
  const featured = events[0] ?? null

  const today    = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Bucharest' })
  const upcoming = events.filter(ev => !isPast(ev, today)).sort((a, b) => a.date.localeCompare(b.date))
  const past     = events.filter(ev => isPast(ev, today))

  return (
    <>
      <Hero />
      <FeaturedWorkshop event={featured} />
      <About />
      {upcoming.length > 0 && <EventsCarousel events={upcoming} title="Următoarele evenimente" />}
      {past.length > 0 && <EventsCarousel events={past} title="Evenimente anterioare" />}
      <Testimonial data={testimonials} />
    </>
  )
}
