import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const initial = {
  name: '',
  email: '',
  role: '',
  company: '',
  budget: '',
  publication: '',
  summary: ''
}

const steps = [
  { id: 'identity', label: 'Step 01: Identity Discovery' },
  { id: 'context',  label: 'Step 02: Archive Context' },
  { id: 'intent',   label: 'Step 03: Intent & Brief' },
  { id: 'transmit', label: 'Step 04: Transmission' }
]

const errStyle = {
  color: 'var(--v4-alert)',
  fontSize: '9px',
  letterSpacing: '0.1em',
  fontFamily: 'var(--font-mono, monospace)',
  textTransform: 'uppercase',
  marginTop: 3,
}

export default function V4MembershipForm() {
  const [form, setForm] = useState(initial)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')
  const [currentStep, setCurrentStep] = useState(0)

  const needsCompany = form.role === 'studio'
  const needsBudget = form.role === 'collector'
  const needsPublication = form.role === 'press'
  const needsBrief = form.role === 'studio' || form.role === 'collector'

  const isValidEmail = useMemo(() => /\S+@\S+\.\S+/.test(form.email), [form.email])

  const errors = {
    name: form.name.trim().length === 0 ? 'Required' : form.name.trim().length < 2 ? 'Too short' : null,
    email: !isValidEmail ? 'Invalid email' : null,
    role: !form.role ? 'Required' : null,
    company: needsCompany && !form.company.trim() ? 'Required' : null,
    budget: needsBudget && !form.budget.trim() ? 'Required' : null,
    publication: needsPublication && !form.publication.trim() ? 'Required' : null,
    summary: needsBrief && form.summary.trim().length < 20 ? 'Min 20 chars' : null,
  }

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
  const touch = (key) => setTouched(prev => ({ ...prev, [key]: true }))
  const showErr = (key) => touched[key] && errors[key]

  const nextStep = () => {
    // Validate current step fields
    let fieldsToValidate = []
    if (currentStep === 0) fieldsToValidate = ['name', 'email', 'role']
    if (currentStep === 1) fieldsToValidate = ['company', 'budget', 'publication']
    
    const stepErrors = fieldsToValidate.some(f => errors[f])
    if (stepErrors) {
      setTouched(prev => ({ ...prev, ...Object.fromEntries(fieldsToValidate.map(f => [f, true])) }))
      return
    }
    setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => setCurrentStep(prev => prev - 1)

  const onSubmit = (event) => {
    event.preventDefault()
    if (errors.summary && needsBrief) {
      setTouched(prev => ({ ...prev, summary: true }))
      return
    }

    setStatus('sending')
    setCurrentStep(3) // Final step
    window.setTimeout(() => {
      setStatus('sent')
      window.setTimeout(() => {
        setStatus('idle')
        setCurrentStep(0)
        setForm(initial)
        setTouched({})
      }, 3000)
    }, 1800)
  }

  return (
    <section id="membership" className="relative py-32 bg-void overflow-hidden" data-v4-animate>
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-16">
          <p className="form__overline">MEMBERSHIP / INTAKE</p>
          <h2 className="form__title">JOIN THE ARCHIVE</h2>
        </div>

        <div className="flex gap-4 mb-20 overflow-x-auto pb-4 scrollbar-hide">
          {steps.map((s, i) => (
            <div key={s.id} className="flex flex-col gap-3 min-w-[120px]">
              <div className={`h-1 transition-colors duration-500 ${currentStep >= i ? 'bg-accent' : 'bg-white/5'}`} />
              <span className={`form__step-label ${currentStep === i ? 'text-text-primary' : 'text-text-muted'}`}>
                {s.label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        <form className="bg-surface-dark border border-border p-8 md:p-12 relative overflow-hidden" onSubmit={onSubmit} noValidate>
          {/* Technical Corner Accents */}
          <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-white/5 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-white/5 pointer-events-none" />

          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div 
                key="step0"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="font-mono text-[9px] text-accent-red tracking-widest">01 / IDENTITY_DISCOVERY</p>
                  <span className="font-mono text-[8px] text-text-muted opacity-50">CORE_AUTH_0x42</span>
                </div>

                <div className="space-y-6">
                  <div className="group">
                    <label className="block font-mono text-[9px] text-text-muted mb-2 uppercase tracking-widest">Field_01: Name</label>
                    <input 
                      value={form.name} 
                      onChange={e => update('name', e.target.value)} 
                      onBlur={() => touch('name')} 
                      className="form__input"
                      required 
                    />
                    {showErr('name') && <span className="form__error">{errors.name}</span>}
                  </div>

                  <div className="group">
                    <label className="block font-mono text-[9px] text-text-muted mb-2 uppercase tracking-widest">Field_02: Email</label>
                    <input 
                      type="email" 
                      value={form.email} 
                      onChange={e => update('email', e.target.value)} 
                      onBlur={() => touch('email')} 
                      className="form__input"
                      required 
                    />
                    {showErr('email') && <span className="form__error">{errors.email}</span>}
                  </div>

                  <div className="group">
                    <label className="block font-mono text-[9px] text-text-muted mb-2 uppercase tracking-widest">Field_03: Role</label>
                    <select 
                      value={form.role} 
                      onChange={e => update('role', e.target.value)} 
                      onBlur={() => touch('role')} 
                      className="w-full bg-void border border-border p-4 font-mono text-sm text-text-primary focus:border-nodear-red outline-none transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select one</option>
                      <option value="studio">Studio / Brand Team</option>
                      <option value="collector">Collector / Client</option>
                      <option value="press">Press / Editorial</option>
                    </select>
                    {showErr('role') && <span className="block font-mono text-[9px] text-accent-red mt-2 uppercase tracking-widest">{errors.role}</span>}
                  </div>
                </div>

                <div className="pt-8">
                  <button type="button" onClick={nextStep} className="btn btn--primary w-full md:w-auto">
                    NEXT STEP →
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8"
              >
                <p className="font-mono text-[9px] text-accent-red tracking-widest">02 / ARCHIVE_CONTEXT</p>
                
                <div className="space-y-6">
                  {!needsCompany && !needsBudget && !needsPublication && (
                    <p className="nodear-lyric text-lg text-text-secondary opacity-60">No additional context required for this role. Proceed to brief.</p>
                  )}
                  {needsCompany && (
                    <div className="group">
                      <label className="block font-mono text-[9px] text-text-muted mb-2 uppercase tracking-widest">Field_04: Company</label>
                      <input 
                        value={form.company} 
                        onChange={e => update('company', e.target.value)} 
                        onBlur={() => touch('company')} 
                        className="w-full bg-void border border-border p-4 font-mono text-sm text-text-primary focus:border-nodear-red outline-none transition-all"
                      />
                    </div>
                  )}
                  {needsBudget && (
                    <div className="group">
                      <label className="block font-mono text-[9px] text-text-muted mb-2 uppercase tracking-widest">Field_05: Budget Band</label>
                      <input 
                        placeholder="$15k - $30k" 
                        value={form.budget} 
                        onChange={e => update('budget', e.target.value)} 
                        onBlur={() => touch('budget')} 
                        className="w-full bg-void border border-border p-4 font-mono text-sm text-text-primary focus:border-nodear-red outline-none transition-all"
                      />
                    </div>
                  )}
                  {needsPublication && (
                    <div className="group">
                      <label className="block font-mono text-[9px] text-text-muted mb-2 uppercase tracking-widest">Field_06: Publication</label>
                      <input 
                        value={form.publication} 
                        onChange={e => update('publication', e.target.value)} 
                        onBlur={() => touch('publication')} 
                        className="w-full bg-void border border-border p-4 font-mono text-sm text-text-primary focus:border-nodear-red outline-none transition-all"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={prevStep} className="font-mono text-[9px] px-8 py-4 border border-border hover:bg-white/5 tracking-widest transition-all">
                    BACK
                  </button>
                  <button type="button" onClick={nextStep} className="btn btn--primary flex-1">
                    CONTINUE →
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8"
              >
                <p className="font-mono text-[9px] text-accent-red tracking-widest">03 / INTENT_AND_BRIEF</p>
                <div className="group">
                  <label className="block font-mono text-[9px] text-text-muted mb-2 uppercase tracking-widest">Field_07: Project Brief</label>
                  <textarea 
                    rows="6" 
                    value={form.summary} 
                    onChange={e => update('summary', e.target.value)} 
                    onBlur={() => touch('summary')} 
                    placeholder={needsBrief ? 'Min 20 characters...' : 'Optional comments...'} 
                    className="w-full bg-void border border-border p-4 font-mono text-sm text-text-primary focus:border-nodear-red outline-none transition-all resize-none"
                  />
                  {showErr('summary') && <span className="block font-mono text-[9px] text-accent-red mt-2 uppercase tracking-widest">{errors.summary}</span>}
                </div>
                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={prevStep} className="font-mono text-[9px] px-8 py-4 border border-border hover:bg-white/5 tracking-widest transition-all">
                    BACK
                  </button>
                  <button type="submit" className="btn btn--primary flex-1" style={{ background: 'var(--accent-red)' }}>
                    REQUEST ACCESS_
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 space-y-12 text-center"
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="px-4 py-1.5 border border-nodear-red rounded-full">
                    <span className="font-mono text-[10px] text-nodear-red tracking-widest uppercase">STATUS: {status}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="nodear-heading text-2xl md:text-3xl tracking-tight">
                      {status === 'sending' ? 'TRANSMITTING TO THE VAULT' : 'ACCESS PENDING REVIEW'}
                    </p>
                    <p className="nodear-lyric text-text-secondary max-w-md mx-auto opacity-60">
                      {status === 'sending' ? 'ENCRYPTING AND DISPATCHING...' : `A verification signal has been sent to ${form.email}. Archive response time is 24-48h.`}
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                
                <p className="font-mono text-[8px] text-text-muted tracking-[0.5em] uppercase">INTAKE_PROTOCOL_0x82... COMPLETED</p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  )
}
