// src/types/index.ts

export interface Event {
  id: string
  title: string
  subtitle?: string
  date: string
  location: string
  tag: 'Workshop' | 'Conferință' | 'Curs'
  coverImage: string
  slug: string
}

export interface Workshop {
  id: string
  title: string
  subtitle: string
  description: string
  date: string
  location: string
  emcPoints: number
  trainingCenter: string
  coverImage: string
  slug: string
}

export interface Testimonial {
  id: string
  quote: string
  authorName: string
  authorTitle: string
  authorSpecialty: string
  workshopTitle: string
  photo: string
}

export interface HeroData {
  headline: string
  subheadline: string
  description: string
  featuredWorkshop: Workshop
}
