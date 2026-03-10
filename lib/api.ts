// src/lib/api.ts
// Când API-ul e gata: înlocuiești funcțiile mock cu fetch-urile reale
// Structura rămâne identică — componentele nu se schimbă

import type { Event, Workshop, Testimonial } from '@/types'
import {
  MOCK_EVENTS,
  MOCK_FEATURED_WORKSHOP,
  MOCK_TESTIMONIAL,
} from './mock-data'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''
const USE_MOCK = !API_BASE

// ── Events ──────────────────────────────────────────────

export async function getEvents(): Promise<Event[]> {
  if (USE_MOCK) return MOCK_EVENTS

  const res = await fetch(`${API_BASE}/events`, {
    next: { revalidate: 3600 }, // ISR: revalidare la fiecare oră
  })

  if (!res.ok) throw new Error('Failed to fetch events')
  return res.json()
}

// ── Featured Workshop (hero card) ───────────────────────

export async function getFeaturedWorkshop(): Promise<Workshop> {
  if (USE_MOCK) return MOCK_FEATURED_WORKSHOP

  const res = await fetch(`${API_BASE}/workshops/featured`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error('Failed to fetch featured workshop')
  return res.json()
}

// ── Testimonial ─────────────────────────────────────────

export async function getTestimonial(): Promise<Testimonial> {
  if (USE_MOCK) return MOCK_TESTIMONIAL

  const res = await fetch(`${API_BASE}/testimonials/featured`, {
    next: { revalidate: 86400 }, // 24h — se schimbă rar
  })

  if (!res.ok) throw new Error('Failed to fetch testimonial')
  return res.json()
}
