import type { BackendEvent } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export function addToCalendar(event: BackendEvent): void {
  // webcal:// is intercepted by the OS before the browser can download it,
  // so Calendar.app / Outlook opens directly on macOS & Windows
  const httpUrl = `${API_BASE}/events/${event.slug}/ics`
  const webcalUrl = httpUrl.replace(/^https?:\/\//, 'webcal://')
  window.location.href = webcalUrl
}

function icsDate(dateStr: string, timeStr: string | null): string {
  const d = dateStr.substring(0, 10).replace(/-/g, '')
  if (!timeStr) return d
  const t = timeStr.substring(0, 8).replace(/:/g, '')
  return `${d}T${t}`
}

export function googleCalendarUrl(event: BackendEvent): string {
  const fmt   = (s: string) => s.replace(/[-:T]/g, '').substring(0, 15)
  const start = fmt(icsDate(event.date, event.time_start))
  const end   = fmt(icsDate(event.date, event.time_end ?? event.time_start))
  const location = [event.location, event.venue].filter(Boolean).join(', ')

  const params = new URLSearchParams({
    action:  'TEMPLATE',
    text:    event.title,
    dates:   `${start}/${end}`,
    ...(location          && { location }),
    ...(event.description && { details: event.description }),
  })
  return `https://calendar.google.com/calendar/render?${params}`
}
