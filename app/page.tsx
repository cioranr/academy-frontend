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

async function fetchTestimonial(): Promise<BackendTestimonial | null> {
  try {
    const res = await fetch(`${API}/testimonials`)
    if (!res.ok) return null
    const list: BackendTestimonial[] = await res.json()
    return list.find(t => t.active) ?? null
  } catch { return null }
}

export default async function HomePage() {
  const [events, testimonial] = await Promise.all([fetchEvents(), fetchTestimonial()])
  const featured = events[0] ?? null

  return (
    <>
      <Hero />
      <FeaturedWorkshop event={featured} />
      <About />
      <EventsCarousel events={events} />
      <Testimonial data={testimonial} />
    </>
  )
}
