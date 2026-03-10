// src/lib/mock-data.ts
// TODO: înlocuiește cu fetch-uri reale când API-ul e gata

import type { Event, Workshop, Testimonial } from '@/types'

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Workshop TEE',
    subtitle: 'Ecografie Transesofagiană',
    date: '13 Martie',
    location: 'Cluj',
    tag: 'Workshop',
    coverImage: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&q=80',
    slug: 'workshop-tee-cluj',
  },
  {
    id: '2',
    title: 'Conferința MONZA ARES',
    subtitle: '',
    date: '2–3 Aprilie',
    location: 'București',
    tag: 'Conferință',
    coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
    slug: 'conferinta-monza-ares-aprilie',
  },
  {
    id: '3',
    title: 'Conferință Afecțiuni Cardiace Congenitale',
    subtitle: '',
    date: '14 Mai',
    location: 'București',
    tag: 'Conferință',
    coverImage: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&q=80',
    slug: 'conferinta-afectiuni-cardiace-congenitale',
  },
  {
    id: '4',
    title: 'Workshop Interactiv TAVI',
    subtitle: 'Abordare avansată',
    date: '21 Iunie',
    location: 'București',
    tag: 'Workshop',
    coverImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&q=80',
    slug: 'workshop-tavi',
  },
]

export const MOCK_FEATURED_WORKSHOP: Workshop = {
  id: 'w1',
  title: 'Workshop Interactiv',
  subtitle: 'Implantare stimulator cardiac',
  description: 'Abordare avansată și optimizarea rezultatelor, de la anatomie la implantare',
  date: '31 Octombrie',
  location: 'Spitalul Monza',
  emcPoints: 6,
  trainingCenter: 'Centrul de Training Spitalul Monza',
  coverImage: '',
  slug: 'workshop-stimulator-cardiac',
}

export const MOCK_TESTIMONIAL: Testimonial = {
  id: 't1',
  quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet quam eu tortor molestie consectetur. Proin ullamcorper nisi eget dolor fermentum, a tempus enim luctus.',
  authorName: 'Dr. Ionescu Popescu',
  authorTitle: 'Cardiolog intervenționist',
  authorSpecialty: 'Cardiologie intervențională',
  workshopTitle: 'Workshop Interactiv X',
  photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
}
