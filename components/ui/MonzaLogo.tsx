// src/components/ui/MonzaLogo.tsx

interface MonzaLogoProps {
  size?: 'sm' | 'md'
}

export function MonzaLogo({ size = 'md' }: MonzaLogoProps) {
  const box = size === 'sm' ? 44 : 52
  const fontSize = size === 'sm' ? 10 : 12
  const iconW = size === 'sm' ? 16 : 20

  return (
    <div className="flex items-center gap-2">
      <div
        className="bg-monza-blue rounded-sm flex flex-col items-center justify-center p-[6px]"
        style={{ minWidth: box, minHeight: box }}
      >
        <span
          className="text-white font-black leading-none tracking-[1px]"
          style={{ fontSize }}
        >
          MONZA
        </span>
        <span
          className="text-white font-black leading-none tracking-[1px]"
          style={{ fontSize }}
        >
          ARES
        </span>
        <svg viewBox="0 0 24 12" width={iconW} className="mt-[2px]">
          <path
            d="M12 2 C8 2 4 5 4 8 C4 11 8 13 12 11 C16 13 20 11 20 8 C20 5 16 2 12 2Z"
            fill="#E8003D"
          />
        </svg>
      </div>
      <span className="text-monza-blue font-black tracking-[0.18em] text-[9px] uppercase">
        A C A D E M Y
      </span>
    </div>
  )
}
