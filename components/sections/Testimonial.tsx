// components/sections/Testimonial.tsx
import Image from 'next/image'
import Link from 'next/link'
import type { BackendTestimonial } from '@/types'
import { storageUrl } from '@/lib/api'

interface TestimonialProps {
  data?: BackendTestimonial | null
}

export function Testimonial({ data }: TestimonialProps) {
  const subtitle      = data?.subtitle     ?? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet quam eu tortor molestie consectetur. Proin ullamcorper nisi eget dolor fermentum, a tempus enim luctus.'
  const doctorName    = data?.doctor_name  ?? 'Dr. Ionescu Popescu'
  const quote         = data?.quote        ?? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet quam eu tortor molestie consectetur. Proin ullamcorper nisi eget dolor fermentum, a tempus enim luctus.'
  const workshopTitle = data?.workshop_title ?? 'Workshop Interactiv X'
  const workshopHref  = data?.workshop_href  ?? '/workshop'
  const imageSrc      = storageUrl(data?.image) ?? '/testimonial.png'
  return (
    <section className="bg-white py-16">
      <div className="max-w-[900px] mx-auto px-4">

        {/* Titlu + subtitle */}
        <h2
         className="text-center mb-4"
        style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '28px', color: '#000' }} >
          Testimonial
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
              src={imageSrc}
              alt={doctorName}
              fill
              quality={90}
              loading="eager"
              className="object-cover object-top"
              unoptimized={imageSrc.startsWith('http')}
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
