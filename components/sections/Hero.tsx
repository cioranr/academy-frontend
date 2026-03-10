// components/sections/Hero.tsx
import Image from 'next/image'


export function Hero() {
  return (
    <section className="bg-[#ecffff] relative overflow-hidden">
      
      {/* Background imagine mâini */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/maini.png"
          alt=""
          fill
          quality={90}
          loading="eager"
          fetchPriority="high"
          className="object-contain object-center"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-[1000px] mx-auto px-4 py-5 relative z-10" style={{ height: '450px' }}>
        <div className="flex justify-start items-center h-full">
          <div className="relative ">
            
            <h1
  className="leading-tight mb-4 max-w-lg"
  style={{
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 300,
    color: '#000000',
    fontSize: '23px',
  }}
>
  Alătură-te comunității care modelează<br /> cardiologia de vârf în România!
</h1>

          </div>
        </div>
      </div>

    </section>
  )
}