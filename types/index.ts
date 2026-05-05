// ── Legacy types (used by existing components) ─────────────────────────────
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
  id: string; title: string; subtitle: string; description: string
  date: string; location: string; emcPoints: number; trainingCenter: string
  coverImage: string; slug: string
}
export interface Testimonial {
  id: string; quote: string; authorName: string; authorTitle: string
  authorSpecialty: string; workshopTitle: string; photo: string
}
export interface HeroData {
  headline: string; subheadline: string; description: string; featuredWorkshop: Workshop
}

// ── Backend API types ────────────────────────────────────────────────────────
export interface BackendEvent {
  id: number; title: string; subtitle: string | null; description: string | null
  slug: string; date: string; end_date: string | null; time_start: string | null; time_end: string | null
  location: string | null; venue: string | null; credits: number | null
  credits_label: string | null; image: string | null; image_small: string | null; image_big: string | null
  status: 'draft' | 'published' | 'cancelled'; max_participants: number | null
  created_by: number | null; created_at: string; updated_at: string
  meta_title: string | null; meta_description: string | null; schema_org: string | null
  fully_booked_message: string | null; show_fully_booked_message: boolean
  cmr_address: string | null
  speakers?: EventSpeaker[]; sessions?: EventSession[]; directors?: EventSpeaker[]
}
export interface Doctor {
  id: number; name: string; specialty: string | null; image: string | null
  signature: string | null
  slug: string | null; bio: string | null; created_at: string; updated_at: string
}
export interface EventSpeaker {
  id: number; event_id: number; user_id: number | null; doctor_id: number | null; name: string
  specialty: string | null; image: string | null; slug: string | null
  speaker_role: 'speaker' | 'director'; order: number
}
export interface EventSession {
  id: number; event_id: number; time_label: string; title: string; order: number
  day_index: number
  items?: EventSessionItem[]
}
export interface EventSessionItem { id: number; event_session_id: number; content: string; order: number }
export interface EventRegistration {
  id: number; event_id: number; user_id: number | null
  first_name: string; last_name: string; email: string
  phone: string | null; specialty: string | null; professional_grade: string | null
  cuim: string | null; message: string | null; status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  registered_at: string; event?: BackendEvent; user?: BackendUser
}
export interface BackendUser {
  id: number; name: string; first_name: string | null; last_name: string | null
  email: string; phone: string | null; specialty: string | null
  professional_grade: string | null; cuim: string | null; email_verified_at: string | null
  role: 'participant' | 'doctor' | 'admin' | 'events_manager'
  created_at: string; updated_at: string
}
export interface BackendTestimonial {
  id: number; title: string; subtitle: string | null; doctor_name: string; quote: string
  workshop_title: string | null; workshop_href: string | null; image: string | null; video: string | null
  youtube_url: string | null
  active: boolean; order: number; created_at: string; updated_at: string
}
export interface Degree {
  id: number; user_id: number; event_id: number | null; title: string
  file_path: string; file_name: string; uploaded_by: number
  created_at: string; event?: BackendEvent; uploader?: BackendUser
}
export interface VideoResource {
  id: number
  title: string
  slug: string
  short_description: string | null
  content: string | null
  video_path: string | null
  video_embed: string | null
  active: boolean
  created_by: number | null
  created_at: string
  updated_at: string
  doctors?: (Doctor & { pivot?: { order: number } })[]
}
