import type { BackendEvent } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export function icsUrl(event: BackendEvent): string {
  return `${API_BASE}/events/${event.slug}/ics`
}

function icsDate(dateStr: string, timeStr: string | null): string {
  const d = dateStr.substring(0, 10).replace(/-/g, '')
  if (!timeStr) return d
  const t = timeStr.substring(0, 8).replace(/:/g, '')
  return `${d}T${t}`
}

export function outlookCalendarUrl(event: BackendEvent): string {
  const start = icsDate(event.date, event.time_start).replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6')
  const end   = icsDate(event.date, event.time_end ?? event.time_start).replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6')
  const location = [event.location, event.venue].filter(Boolean).join(', ')

  const params = new URLSearchParams({
    rru:     'addevent',
    path:    '/calendar/action/compose',
    subject: event.title,
    startdt: start,
    enddt:   end,
    ...(location          && { location }),
    ...(event.description && { body: event.description }),
  })
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`
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
