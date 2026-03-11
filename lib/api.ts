import type { BackendEvent, BackendUser, EventRegistration, Degree, EventSpeaker, EventSession, EventSessionItem, Doctor, BackendTestimonial } from '@/types'
import type { Event, Workshop, Testimonial } from '@/types'
import { MOCK_EVENTS, MOCK_FEATURED_WORKSHOP, MOCK_TESTIMONIAL } from './mock-data'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
const STORAGE_BASE = API_BASE.replace(/\/api$/, '')

/** Convert a backend relative path like /storage/events/x.jpg to an absolute URL */
export function storageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${STORAGE_BASE}${path}`
}

// ── Token ──────────────────────────────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('academy_token')
}
export function setToken(token: string): void { localStorage.setItem('academy_token', token) }
export function removeToken(): void { localStorage.removeItem('academy_token') }

// ── Fetch helper ───────────────────────────────────────────────────────────
async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken()
  const isFormData = options.body instanceof FormData
  const headers: Record<string, string> = { Accept: 'application/json', ...(options.headers as Record<string, string>) }
  if (!isFormData) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })
  if (res.status === 401) { removeToken(); window.location.href = '/login' }
  return res
}

async function apiJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(endpoint, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Server error' }))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  return res.json()
}

// ── Auth ──────────────────────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<{ user: BackendUser; token: string }> {
  return apiJson('/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}
export async function register(data: { name: string; first_name?: string; last_name?: string; email: string; password: string; password_confirmation: string; phone?: string; specialty?: string; professional_grade?: string }): Promise<{ user: BackendUser; token: string }> {
  return apiJson('/register', { method: 'POST', body: JSON.stringify(data) })
}
export async function logout(): Promise<void> {
  await apiFetch('/logout', { method: 'POST' }).catch(() => {})
  removeToken()
}
export async function getMe(): Promise<BackendUser> { return apiJson('/me') }
export async function updateProfile(data: Partial<BackendUser>): Promise<BackendUser> {
  return apiJson('/me', { method: 'PATCH', body: JSON.stringify(data) })
}

// ── Events ─────────────────────────────────────────────────────────────────
export async function getEvents(): Promise<BackendEvent[]> { return apiJson('/events') }
export async function getEvent(slug: string): Promise<BackendEvent> { return apiJson(`/events/${slug}`) }
export async function createEvent(data: Partial<BackendEvent>): Promise<BackendEvent> {
  return apiJson('/events', { method: 'POST', body: JSON.stringify(data) })
}
export async function updateEvent(id: number, data: Partial<BackendEvent>): Promise<BackendEvent> {
  return apiJson(`/events/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
}
export async function deleteEvent(id: number): Promise<void> {
  await apiFetch(`/events/${id}`, { method: 'DELETE' })
}

// ── Event sessions ─────────────────────────────────────────────────────────
export async function createSession(eventId: number, data: { time_label: string; title: string; order?: number }): Promise<EventSession> {
  return apiJson(`/events/${eventId}/sessions`, { method: 'POST', body: JSON.stringify(data) })
}
export async function updateSession(sessionId: number, data: Partial<EventSession>): Promise<EventSession> {
  return apiJson(`/event-sessions/${sessionId}`, { method: 'PATCH', body: JSON.stringify(data) })
}
export async function deleteSession(sessionId: number): Promise<void> {
  await apiFetch(`/event-sessions/${sessionId}`, { method: 'DELETE' })
}
export async function createSessionItem(sessionId: number, data: { content: string; order?: number }): Promise<EventSessionItem> {
  return apiJson(`/event-sessions/${sessionId}/items`, { method: 'POST', body: JSON.stringify(data) })
}
export async function deleteSessionItem(itemId: number): Promise<void> {
  await apiFetch(`/event-session-items/${itemId}`, { method: 'DELETE' })
}

export async function uploadEventImage(eventId: number, file: File, type: 'main' | 'small' | 'big' = 'main'): Promise<{ field: 'image' | 'image_small' | 'image_big'; url: string }> {
  const fd = new FormData(); fd.append('image', file)
  const suffix = type !== 'main' ? `?type=${type}` : ''
  const field = type === 'main' ? 'image' : type === 'small' ? 'image_small' : 'image_big'
  const data = await apiJson<Record<string, string>>(`/events/${eventId}/image${suffix}`, { method: 'POST', body: fd })
  return { field: field as 'image' | 'image_small' | 'image_big', url: data[field] }
}

// ── Speakers ───────────────────────────────────────────────────────────────
export async function createSpeaker(slug: string, data: Partial<EventSpeaker>): Promise<EventSpeaker> {
  return apiJson(`/events/${slug}/speakers`, { method: 'POST', body: JSON.stringify(data) })
}
export async function updateSpeaker(id: number, data: Partial<EventSpeaker>): Promise<EventSpeaker> {
  return apiJson(`/speakers/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
}
export async function uploadSpeakerImage(speakerId: number, file: File): Promise<string> {
  const fd = new FormData(); fd.append('image', file)
  const data = await apiJson<{ image: string }>(`/speakers/${speakerId}/image`, { method: 'POST', body: fd })
  return data.image
}
export async function deleteSpeaker(id: number): Promise<void> {
  await apiFetch(`/speakers/${id}`, { method: 'DELETE' })
}

// ── Doctors pool ────────────────────────────────────────────────────────────
export async function getDoctors(): Promise<Doctor[]> { return apiJson('/doctors') }
export async function createDoctor(data: Partial<Doctor>): Promise<Doctor> {
  return apiJson('/doctors', { method: 'POST', body: JSON.stringify(data) })
}
export async function updateDoctor(id: number, data: Partial<Doctor>): Promise<Doctor> {
  return apiJson(`/doctors/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
}
export async function uploadDoctorImage(id: number, file: File): Promise<string> {
  const fd = new FormData(); fd.append('image', file)
  const data = await apiJson<{ image: string }>(`/doctors/${id}/image`, { method: 'POST', body: fd })
  return data.image
}
export async function deleteDoctor(id: number): Promise<void> {
  await apiFetch(`/doctors/${id}`, { method: 'DELETE' })
}

// ── Registrations ──────────────────────────────────────────────────────────
export async function registerForEvent(slug: string, data: { first_name: string; last_name: string; email: string; phone?: string; specialty?: string; professional_grade?: string; message?: string }): Promise<EventRegistration> {
  return apiJson(`/events/${slug}/register`, { method: 'POST', body: JSON.stringify(data) })
}
export async function getEventRegistrations(slug: string): Promise<EventRegistration[]> {
  return apiJson(`/events/${slug}/registrations`)
}
export async function updateRegistrationStatus(id: number, status: EventRegistration['status']): Promise<EventRegistration> {
  return apiJson(`/registrations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
}
export async function getMyRegistrations(): Promise<EventRegistration[]> { return apiJson('/my-registrations') }
export async function cancelRegistration(id: number): Promise<void> {
  await apiFetch(`/registrations/${id}`, { method: 'DELETE' })
}
export async function deleteRegistration(id: number): Promise<void> {
  await apiFetch(`/registrations/${id}/force`, { method: 'DELETE' })
}

// ── Users (admin) ──────────────────────────────────────────────────────────
export async function getUsers(): Promise<BackendUser[]> { return apiJson('/users') }
export async function getUser(id: number): Promise<BackendUser> { return apiJson(`/users/${id}`) }
export async function updateUserRole(id: number, role: BackendUser['role']): Promise<BackendUser> {
  return apiJson(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) })
}
export async function deleteUser(id: number): Promise<void> {
  await apiFetch(`/users/${id}`, { method: 'DELETE' })
}

// ── Degrees ────────────────────────────────────────────────────────────────
export async function getUserDegrees(userId: number): Promise<Degree[]> {
  return apiJson(`/users/${userId}/degrees`)
}
export async function uploadDegree(userId: number, formData: FormData): Promise<Degree> {
  return apiJson(`/users/${userId}/degrees`, { method: 'POST', body: formData })
}
export async function deleteDegree(id: number): Promise<void> {
  await apiFetch(`/degrees/${id}`, { method: 'DELETE' })
}
export async function downloadDegree(id: number, fileName: string): Promise<void> {
  const res = await apiFetch(`/degrees/${id}/download`)
  if (!res.ok) throw new Error('Download failed')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = fileName; a.click()
  URL.revokeObjectURL(url)
}

// ── Testimonials ────────────────────────────────────────────────────────────
export async function getTestimonials(): Promise<BackendTestimonial[]> { return apiJson('/testimonials') }
export async function createTestimonial(data: Partial<BackendTestimonial>): Promise<BackendTestimonial> {
  return apiJson('/testimonials', { method: 'POST', body: JSON.stringify(data) })
}
export async function updateTestimonial(id: number, data: Partial<BackendTestimonial>): Promise<BackendTestimonial> {
  return apiJson(`/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
}
export async function uploadTestimonialImage(id: number, file: File): Promise<string> {
  const fd = new FormData(); fd.append('image', file)
  const data = await apiJson<{ image: string }>(`/testimonials/${id}/image`, { method: 'POST', body: fd })
  return data.image
}
export async function deleteTestimonial(id: number): Promise<void> {
  await apiFetch(`/testimonials/${id}`, { method: 'DELETE' })
}

// ── Legacy helpers (for existing server components) ────────────────────────
const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL
export async function getLegacyEvents(): Promise<Event[]> {
  if (USE_MOCK) return MOCK_EVENTS
  return fetch(`${API_BASE}/events`, { next: { revalidate: 3600 } }).then(r => r.json())
}
export async function getFeaturedWorkshop(): Promise<Workshop> {
  if (USE_MOCK) return MOCK_FEATURED_WORKSHOP
  return fetch(`${API_BASE}/events`, { next: { revalidate: 3600 } }).then(r => r.json()).then(events => {
    const e = events[0]; if (!e) return MOCK_FEATURED_WORKSHOP
    return { id: String(e.id), title: e.title, subtitle: e.subtitle || '', description: e.description || '', date: e.date, location: e.location || '', emcPoints: e.credits || 0, trainingCenter: e.venue || '', coverImage: e.image || '/calendar-1.png', slug: e.slug } as Workshop
  }).catch(() => MOCK_FEATURED_WORKSHOP)
}
export async function getTestimonial(): Promise<Testimonial> { return MOCK_TESTIMONIAL }
