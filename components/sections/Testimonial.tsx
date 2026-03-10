// components/sections/Testimonial.tsx
import Image from 'next/image'
import Link from 'next/link'

interface TestimonialProps {
  title?: string
  subtitle?: string
  doctorName?: string
  quote?: string
  workshopTitle?: string
  workshopHref?: string
  image?: string
}

export function Testimonial({
  title = 'Testimonial',
  subtitle = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet quam eu tortor molestie consectetur. Proin ullamcorper nisi eget dolor fermentum, a tempus enim luctus.',
  doctorName = 'Dr. Ionescu Popescu',
  quote = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet quam eu tortor molestie consectetur. Proin ullamcorper nisi eget dolor fermentum, a tempus enim luctus.',
  workshopTitle = 'Workshop Interactiv X',
  workshopHref = '/workshop',
  image = '/testimonial.png',
}: TestimonialProps) {
  return (
    <section className="bg-white py-16">
      <div className="max-w-[900px] mx-auto px-4">

        {/* Titlu + subtitle */}
        <h2
          className="text-center mb-4"
          style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '28px', color: '#000' }}
        >
          {title}
        </h2>
        <p
          className="text-center mb-10"
          style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '16px', color: '#000' }}
        >
          {subtitle}
        </p>

        {/* Card */}
        <div style={{ borderRadius: '20px 20px 0 0', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

          {/* Imagine */}
          <div className="relative w-full" style={{ height: '380px' }}>
            <Image
              src={image}
              alt={doctorName}
              fill
              quality={90}
              loading="eager"
              className="object-cover object-top"
            />
          </div>

          {/* Text */}
          <div className="px-8 py-8" style={{ background: '#f7f7f7' }}>
            <p
              className="mb-3"
              style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 500, fontSize: '16px', color: '#065EA6' }}
            >
              {doctorName}
            </p>
            <p
              className="mb-6"
              style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '16px', color: '#000', lineHeight: 1.6 }}
            >
              {quote}
            </p>
            <Link
              href={workshopHref}
              className="flex items-center gap-2 no-underline"
              style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: '16px', color: '#000' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5 2L11 8L5 14" stroke="#000" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {workshopTitle}
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
