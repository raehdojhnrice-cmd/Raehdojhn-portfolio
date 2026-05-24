import { useEffect, useRef, useState } from 'react'

const SYSTEM_LINES = [
  `Last login: ${new Date().toDateString()} on ttys001`,
  'nodear@MacBook-Pro ~ % ./init_contact.sh',
  '> INITIALIZING SECURE RELAY...',
  '> ESTABLISHING CONNECTION TO NODE_06...',
  '> CONNECTION ESTABLISHED. AES-256-GCM ENCRYPTION ACTIVE.',
  '',
  'Enter your details below to route a message to Raehdojhn.',
  '',
]

export default function V4ContactTerminal() {
  const [lines, setLines] = useState([])
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const termRef = useRef(null)
  const hasBooted = useRef(false)

  useEffect(() => {
    if (hasBooted.current) return
    hasBooted.current = true

    let idx = 0
    const interval = setInterval(() => {
      if (idx < SYSTEM_LINES.length) {
        setLines((prev) => [...prev, SYSTEM_LINES[idx]])
        idx++
      } else {
        clearInterval(interval)
      }
    }, 120)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight
    }
  }, [lines])

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setLines((prev) => [...prev, 'nodear@MacBook-Pro ~ % ./transmit.sh', '> ERROR: Missing required parameters.'])
      return
    }

    setStatus('sending')
    setLines((prev) => [
      ...prev,
      'nodear@MacBook-Pro ~ % ./transmit.sh',
      `> PACKET: FROM ${form.name} <${form.email}>`,
      `> PAYLOAD: ${form.message.slice(0, 40)}${form.message.length > 40 ? '...' : ''}`,
      '> ENCRYPTING AND DISPATCHING...',
    ])

    setTimeout(() => {
      setLines((prev) => [
        ...prev,
        '> PACKET DELIVERED ✓',
        '> CONNECTION CLOSED.',
        '',
      ])
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 3000)
    }, 1400)
  }

  return (
    <section id="contact" className="v4-contact-term" data-v4-animate style={{ marginTop: '40px', marginBottom: '40px' }}>
      <div className="mac-terminal" style={{ 
        border: '1px solid rgba(128,128,128,0.3)', 
        borderRadius: '10px',
        background: 'rgba(20, 20, 20, 0.95)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        color: '#e0e0e0',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
      }}>
        {/* Title bar */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          borderBottom: '1px solid rgba(128,128,128,0.2)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '10px 16px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', gap: '8px', position: 'absolute', left: '16px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F56' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C93F' }}></div>
          </div>
          <span style={{ fontSize: '13px', color: '#999', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            nodear — -zsh — 80x24
          </span>
        </div>

        <div className="v4-contact-term__output" ref={termRef} style={{ flex: 1, padding: '16px', fontSize: '13px', overflowY: 'auto', minHeight: '200px', lineHeight: 1.6 }}>
          {lines.map((line, i) => (
            <p key={i} style={{ margin: 0, color: line.startsWith('nodear') ? '#4af626' : line.startsWith('Last login') ? '#999' : '#e0e0e0' }}>
              {line || '\u00A0'}
            </p>
          ))}
          {status === 'sending' && (
            <p style={{ color: '#e0e0e0', margin: 0 }}>Processing connection...</p>
          )}
        </div>

        <form className="v4-contact-term__form" onSubmit={handleSubmit} style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ width: '180px', color: '#4af626', fontSize: '13px', display: 'flex', gap: '8px' }}>
              nodear@MacBook-Pro ~ % <span style={{color: '#e0e0e0'}}>name=</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              autoComplete="off"
              spellCheck={false}
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#e0e0e0', fontFamily: 'inherit', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ width: '180px', color: '#4af626', fontSize: '13px', display: 'flex', gap: '8px' }}>
              nodear@MacBook-Pro ~ % <span style={{color: '#e0e0e0'}}>email=</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              autoComplete="off"
              spellCheck={false}
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#e0e0e0', fontFamily: 'inherit', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <label style={{ width: '180px', color: '#4af626', fontSize: '13px', display: 'flex', gap: '8px', paddingTop: '2px' }}>
              nodear@MacBook-Pro ~ % <span style={{color: '#e0e0e0'}}>msg=</span>
            </label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              spellCheck={false}
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#e0e0e0', fontFamily: 'inherit', fontSize: '13px', outline: 'none', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <label style={{ width: '180px', color: '#4af626', fontSize: '13px' }}>nodear@MacBook-Pro ~ %</label>
            <button type="submit" disabled={status === 'sending'} style={{ background: 'transparent', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '4px 12px', fontFamily: 'inherit', fontSize: '13px', cursor: 'pointer', outline: 'none' }}>
              {status === 'sending' ? './transmit.sh' : status === 'sent' ? 'Message Sent' : './transmit.sh'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

