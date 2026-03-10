// src/app/page.tsx
// Server Component — fetch-uieste datele pe server, nu pe client

import { Hero }            from '@/components/sections/Hero'
import { About }           from '@/components/sections/About'
import { EventsCarousel }  from '@/components/sections/EventsCarousel'
import { Testimonial }     from '@/components/sections/Testimonial'
import { FeaturedWorkshop } from '@/components/sections/FeaturedWorkshop'
import {
  getEvents,
  getFeaturedWorkshop,
  getTestimonial,
} from '@/lib/api'

export default async function HomePage() {
  // Toate fetch-urile se fac în paralel pe server
  const [events, featuredWorkshop, testimonial] = await Promise.all([
    getEvents(),
    getFeaturedWorkshop(),
    getTestimonial(),
  ])

  return (
    <>
      <Hero featuredWorkshop={featuredWorkshop} />
      <FeaturedWorkshop />
      <About />
      <EventsCarousel events={events} />
      <Testimonial data={testimonial} />
    </>
  )
}
