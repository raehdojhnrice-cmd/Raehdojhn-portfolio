import { useState } from 'react'
import { motion } from 'framer-motion'
import ArchiveSectionChrome from './ui/ArchiveSectionChrome'

const anim = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  })
}

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(e.target.action, {
        method: 'POST',
        body: new FormData(e.target),
        headers: { 'Accept': 'application/json' }
      })
      if (res.ok) {
        setStatus('sent')
        e.target.reset()
        setTimeout(() => setStatus('idle'), 3000)
      } else throw new Error()
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const copyEmail = () => {
    navigator.clipboard.writeText('raehdojhn@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="section" id="contact">
      <div className="section__container">
        <ArchiveSectionChrome 
          index="03" 
          label="CONTACT" 
          title="Let's Talk" 
          subtitle="Currently available for new projects and opportunities."
        />

        <div className="contact-grid">
          <motion.div className="contact-info" variants={anim} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="contact-info__block">
              <h4 className="mono-tag">EMAIL</h4>
              <span className="contact-info__email">
                raehdojhn@gmail.com
                <button className="copy-btn" onClick={copyEmail} aria-label="Copy email">
                  {copied ? <span className="mono-tag">COPIED</span> : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="9" y="9" width="13" height="13" rx="1"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  )}
                </button>
              </span>
            </div>
            <div className="contact-info__block">
              <h4 className="mono-tag">AVAILABILITY</h4>
              <div className="contact-info__badges">
                <span className="badge badge--active"><span className="badge__dot badge__dot--green" /> AVAILABLE</span>
                <span className="badge">FULL-TIME</span>
                <span className="badge">CONTRACT</span>
                <span className="badge">FREELANCE</span>
              </div>
            </div>
            <div className="contact-info__block">
              <h4 className="mono-tag">LOCATION</h4>
              <p className="contact-info__text">Los Angeles, CA</p>
            </div>

          </motion.div>

          <motion.div className="contact-form-wrapper" variants={anim} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <form className="contact-form" onSubmit={handleSubmit} action={import.meta.env.VITE_FORMSPREE_ENDPOINT || "https://formspree.io/f/unknown"} method="POST">
              <div className="form-group">
                <label htmlFor="name" className="form-label mono-tag">NAME</label>
                <input type="text" id="name" name="name" className="form-input" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label mono-tag">EMAIL</label>
                <input type="email" id="email" name="email" className="form-input" placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="type" className="form-label mono-tag">PROJECT TYPE</label>
                <select id="type" name="project_type" className="form-input form-select">
                  <option value="" disabled>Select project type</option>
                  <option value="creative-direction">Creative Direction</option>
                  <option value="brand-systems">Brand Systems</option>
                  <option value="technical-design">Technical Design</option>
                  <option value="ai-workflows">AI Workflows</option>
                  <option value="full-time">Full-Time Position</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label mono-tag">MESSAGE</label>
                <textarea id="message" name="message" className="form-input form-textarea" placeholder="Tell me about your project..." rows="5" required />
              </div>
              <button type="submit" className="btn btn--primary btn--full" disabled={status === 'sending'}>
                {status === 'idle' && 'SEND MESSAGE'}
                {status === 'sending' && 'SENDING...'}
                {status === 'sent' && 'SENT ✓'}
                {status === 'error' && 'ERROR — TRY AGAIN'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
