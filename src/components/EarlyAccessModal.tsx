import { useEffect, useRef, type FormEvent } from 'react'
import './EarlyAccessModal.css'

type EarlyAccessFormState = {
  name: string
  email: string
  location: string
  posSystem: string
  storeCount: string
  monthlyRevenue: string
  biggestChallenge: string
  feedbackPartner: string
  notes: string
}

type Props = {
  show: boolean
  step: number
  submitted: boolean
  submitting: boolean
  validationError: string
  submitError: string
  form: EarlyAccessFormState
  onClose: () => void
  onStart: () => void
  onContinueToStep2: () => void
  onBackToStep1: () => void
  onInput: (field: keyof EarlyAccessFormState, value: string) => void
  onSubmit: (event: FormEvent) => void
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function EarlyAccessModal({
  show,
  step,
  submitted,
  submitting,
  validationError,
  submitError,
  form,
  onClose,
  onStart,
  onContinueToStep2,
  onBackToStep1,
  onInput,
  onSubmit,
}: Props) {
  const modalRef = useRef<HTMLElement | null>(null)
  const lastActiveRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!show) return

    lastActiveRef.current = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusables = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    focusables?.[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !modalRef.current) return
      const nodes = Array.from(modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
      lastActiveRef.current?.focus?.()
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="early-access-modal-overlay" role="presentation" onClick={onClose}>
      <section ref={modalRef} className="early-access-modal" role="dialog" aria-modal="true" aria-label="Early access application" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="early-access-close" onClick={onClose} aria-label="Close early access form">
          ×
        </button>
        <div className="early-access-layout">
          <div className="early-access-left">
            {step > 0 && step < 4 && (
              <div className="early-access-progress" aria-hidden="true">
                <span className={step >= 1 ? 'is-active' : ''}>1</span>
                <span className={step >= 2 ? 'is-active' : ''}>2</span>
                <span className={step >= 3 ? 'is-active' : ''}>3</span>
              </div>
            )}

            {step === 0 && (
              <>
                <p className="early-access-eyebrow">Early Access</p>
                <p className="early-access-title early-access-intro-title">
                  Help shape Coodra
                  <br />
                  with real store feedback.
                </p>
                <p className="early-access-intro">
                  We are onboarding a small group of retailers to validate integrations, improve chat quality, and prioritize the features that matter most.
                </p>
                <p className="early-access-offer">Accepted pilot retailers get free access during testing, plus 3 months after launch.</p>
                <div className="early-access-badges" aria-hidden="true">
                  <span>Retailer-only</span>
                  <span>2-minute application</span>
                  <span>Free pilot access</span>
                </div>
                <div className="early-access-actions">
                  <button type="button" className="btn btn-primary" onClick={onStart}>
                    Start application
                  </button>
                  <button type="button" className="early-access-skip" onClick={onClose}>
                    Continue to website
                  </button>
                </div>
              </>
            )}

            {step > 0 && step < 3 && !submitted && (
              <form className="early-access-form" onSubmit={step === 2 ? onSubmit : (event) => event.preventDefault()}>
                {step === 1 && (
                  <>
                    <p className="early-access-step-label step-label-1"><span className="step-label-text">Step 1 of 3</span></p>
                    <p className="early-access-title early-access-step-title">Tell us about your store.</p>
                    <label>
                      Full name
                      <input type="text" value={form.name} onChange={(e) => onInput('name', e.target.value)} required />
                    </label>
                    <label>
                      Email
                      <input type="email" value={form.email} onChange={(e) => onInput('email', e.target.value)} required />
                    </label>
                    <label>
                      Store location
                      <input type="text" placeholder="City, State/Province, Country" value={form.location} onChange={(e) => onInput('location', e.target.value)} />
                    </label>
                    <label>
                      POS system
                      <select value={form.posSystem} onChange={(e) => onInput('posSystem', e.target.value)} required>
                        <option value="">Select one</option>
                        <option value="Shopify POS">Shopify POS</option>
                        <option value="Square">Square</option>
                        <option value="Lightspeed">Lightspeed</option>
                        <option value="Clover">Clover</option>
                        <option value="Moneris">Moneris</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                  </>
                )}

                {step === 2 && (
                  <>
                    <p className="early-access-step-label step-label-2"><span className="step-label-text">Step 2 of 3</span></p>
                    <p className="early-access-title early-access-step-title early-access-step-title-step2">What should we know before onboarding?</p>
                    <label>
                      Number of stores
                      <select value={form.storeCount} onChange={(e) => onInput('storeCount', e.target.value)}>
                        <option value="">Select one</option>
                        <option value="1">1</option>
                        <option value="2-5">2-5</option>
                        <option value="6-10">6-10</option>
                        <option value="11+">11+</option>
                      </select>
                    </label>
                    <label>
                      Monthly revenue range
                      <select value={form.monthlyRevenue} onChange={(e) => onInput('monthlyRevenue', e.target.value)}>
                        <option value="">Select one</option>
                        <option value="<25k">Under $25k</option>
                        <option value="25k-100k">$25k-$100k</option>
                        <option value="100k-500k">$100k-$500k</option>
                        <option value="500k+">$500k+</option>
                      </select>
                    </label>
                    <label className="is-full">
                      Biggest ops challenge right now
                      <textarea rows={3} value={form.biggestChallenge} onChange={(e) => onInput('biggestChallenge', e.target.value)} />
                    </label>
                    <label className="is-full">
                      Open to short feedback calls during pilot?
                      <select value={form.feedbackPartner} onChange={(e) => onInput('feedbackPartner', e.target.value)}>
                        <option value="">Select one</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </label>
                    <label className="is-full">
                      Anything else we should know? (optional)
                      <textarea rows={2} value={form.notes} onChange={(e) => onInput('notes', e.target.value)} />
                    </label>
                  </>
                )}

                {validationError && <p className="early-access-error">{validationError}</p>}
                {submitError && <p className="early-access-error">{submitError}</p>}
                <div className="early-access-actions">
                  {step === 1 ? (
                    <>
                      <button type="button" className="btn btn-primary" onClick={onContinueToStep2}>
                        Continue
                      </button>
                      <button type="button" className="early-access-skip" onClick={onClose}>
                        Continue to website
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit application'}
                      </button>
                      <button type="button" className="early-access-skip" onClick={onBackToStep1}>
                        Back
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}

            {step === 3 && submitted && (
              <div className="early-access-complete">
                <p className="early-access-step-label step-label-3"><span className="step-label-text">Step 3 of 3</span></p>
                <p className="early-access-title">Application received.</p>
                <p className="early-access-intro">
                  Thanks for applying. If selected for this early cohort, you will receive an email with next steps and onboarding instructions.
                </p>
                <p className="early-access-offer">You will keep free access for the full pilot period plus 3 additional months.</p>
                <div className="early-access-actions">
                  <button type="button" className="btn btn-primary" onClick={onClose}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
          <aside className="early-access-right" aria-hidden="true">
            <img src="/images/landing/early-access-help.png" alt="" />
          </aside>
        </div>
      </section>
    </div>
  )
}


