'use client'
import { useEffect, useState } from 'react'
import { getContactMessages, markContactMessageRead, deleteContactMessage } from '@/lib/api'
import type { ContactMessage } from '@/lib/api'

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => { getContactMessages().then(setMessages).finally(() => setLoading(false)) }, [])

  const handleRead = async (msg: ContactMessage) => {
    if (msg.read) return
    const updated = await markContactMessageRead(msg.id)
    setMessages(prev => prev.map(m => m.id === updated.id ? updated : m))
  }

  const handleDelete = async (msg: ContactMessage) => {
    if (!confirm(`Ștergi mesajul de la ${msg.first_name} ${msg.last_name}?`)) return
    await deleteContactMessage(msg.id)
    setMessages(prev => prev.filter(m => m.id !== msg.id))
  }

  const unread = messages.filter(m => !m.read).length

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontWeight: 300, fontSize: '1.8rem', color: '#000', margin: 0 }}>
          Mesaje contact {unread > 0 && <span style={{ fontSize: '1rem', background: '#ED3224', color: '#fff', borderRadius: '50px', padding: '2px 10px', marginLeft: '8px', fontWeight: 500 }}>{unread} noi</span>}
        </h1>
      </div>

      {loading ? (
        <div style={{ color: '#6D6E71', fontWeight: 300 }}>Se încarcă...</div>
      ) : messages.length === 0 ? (
        <div style={{ color: '#6D6E71', fontWeight: 300 }}>Nu există mesaje.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', border: msg.read ? '1px solid #e5e7eb' : '1px solid #065EA6', overflow: 'hidden' }}
            >
              {/* Header row */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', cursor: 'pointer', flexWrap: 'wrap' }}
                onClick={() => { setExpanded(expanded === msg.id ? null : msg.id); handleRead(msg) }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: msg.read ? 400 : 600, fontSize: '0.95rem', color: '#000' }}>
                      {msg.first_name} {msg.last_name}
                    </span>
                    {!msg.read && (
                      <span style={{ fontSize: '0.7rem', background: '#065EA6', color: '#fff', borderRadius: '50px', padding: '1px 8px', fontWeight: 500 }}>Nou</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6D6E71', fontWeight: 300 }}>
                    <a href={`mailto:${msg.email}`} style={{ color: '#065EA6', textDecoration: 'none' }} onClick={e => e.stopPropagation()}>{msg.email}</a>
                    {msg.phone && <> &nbsp;·&nbsp; {msg.phone}</>}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 300, whiteSpace: 'nowrap' }}>
                  {new Date(msg.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(msg) }}
                  style={{ background: '#fde8e8', color: '#ED3224', border: 'none', borderRadius: '8px', padding: '0.35rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer', fontFamily: '"Roboto",sans-serif', fontWeight: 400 }}
                >
                  Șterge
                </button>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded === msg.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Expanded message */}
              {expanded === msg.id && msg.message && (
                <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #f3f4f6' }}>
                  <p style={{ margin: '1rem 0 0', fontSize: '0.9rem', color: '#374151', fontWeight: 300, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {msg.message}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
