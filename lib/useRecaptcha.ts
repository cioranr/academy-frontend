'use client'
import { useEffect, useCallback } from 'react'

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

export function useRecaptcha() {
  useEffect(() => {
    if (!SITE_KEY || SITE_KEY === 'your-recaptcha-v3-site-key') return
    if (document.getElementById('recaptcha-script')) return
    const script = document.createElement('script')
    script.id = 'recaptcha-script'
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
    script.async = true
    document.head.appendChild(script)
  }, [])

  const getToken = useCallback((action: string): Promise<string> => {
    if (!SITE_KEY || SITE_KEY === 'your-recaptcha-v3-site-key') return Promise.resolve('')
    return new Promise(resolve => {
      window.grecaptcha.ready(async () => {
        const token = await window.grecaptcha.execute(SITE_KEY, { action })
        resolve(token)
      })
    })
  }, [])

  return { getToken }
}
