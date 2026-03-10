// src/components/ui/EventCard.tsx
import Image from 'next/image'
import type { Event } from '@/types'

// Blur placeholder generic (10x10 gri deschis)
const BLUR_PLACEHOLDER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARC' +
  'AAKAAUDASIAABEBAXEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUEB//EAB8QAAIBBAMBAAAAAAAAAAAAAAECAwQREiFBUf/EABUBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAABEB/9oADAMBAAIRAxEAPwCw1OpWlpZyTNUt55I05FaRRgqOW3kejvS3OI6axSHULWaWNORWkUYKjlt5Ho70tz' +
  'iOmsUh1C1mljTkVpFGCo5beR6O9Lc4jprFIdQtZpY05FaRRgqOW3kej/9k='

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="event-card">
      {/* Image */}
      <div className="event-card__image">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          quality={75}
          loading="lazy"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          sizes="224px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-monza-blue-dark/60 to-transparent" />
        {/* Tag */}
        <span className="absolute top-3 left-3 bg-white/90 text-monza-blue text-[10px] font-bold px-2 py-1 rounded-full tracking-wider uppercase">
          {event.tag}
        </span>
      </div>

      {/* Info */}
      <div>
        <h3 className="text-monza-blue-dark font-bold text-sm leading-tight mb-1 group-hover:text-monza-red transition-colors duration-200">
          {event.title}
        </h3>
        {event.subtitle && (
          <p className="text-monza-subtle text-xs mb-1">{event.subtitle}</p>
        )}
        <p className="text-monza-red text-xs font-semibold flex items-center gap-1">
          <span className="w-3 h-px bg-monza-red inline-block" />
          {event.date}, {event.location}
        </p>
      </div>

      {/* CTA */}
      <button className="mt-2 text-monza-blue text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all duration-200">
        <span>Detalii</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
