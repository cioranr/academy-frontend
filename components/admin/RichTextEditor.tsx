'use client'

import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useState } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  height?: number
  placeholder?: string
}

/**
 * Self-hosted TinyMCE 8 (GPL). All assets are served from /public/tinymce/
 * (copied there by scripts/copy-tinymce.mjs on postinstall). No cloud API key,
 * no external network calls.
 */
export function RichTextEditor({ value, onChange, height = 280, placeholder }: RichTextEditorProps) {
  // Render only after mount to avoid SSR hydration mismatch.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) {
    return <div style={{ height, border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f8fafc' }} />
  }

  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      value={value}
      onEditorChange={onChange}
      init={{
        height,
        menubar: false,
        skin_url: '/tinymce/skins/ui/oxide',
        content_css: '/tinymce/skins/content/default/content.min.css',
        plugins: 'lists link autolink image code charmap searchreplace wordcount preview table',
        toolbar:
          'undo redo | blocks | bold italic underline | bullist numlist | link image table | alignleft aligncenter alignright | removeformat code preview',
        block_formats: 'Paragraf=p; Titlu 2=h2; Titlu 3=h3; Citat=blockquote',
        placeholder,
        branding: false,
        promotion: false,
        content_style:
          'body { font-family: Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #000; } a { color: #065ea6; }',
      }}
    />
  )
}
