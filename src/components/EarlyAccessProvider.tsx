import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { trackEvent } from '../lib/analytics'
import EarlyAccessModal from './EarlyAccessModal'

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

const initialForm: EarlyAccessFormState = {
  name: '',
  email: '',
  location: '',
  posSystem: '',
  storeCount: '',
  monthlyRevenue: '',
  biggestChallenge: '',
  feedbackPartner: '',
  notes: '',
}

export default function EarlyAccessProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false)
  const [earlyAccessStep, setEarlyAccessStep] = useState(0)
  const [earlyAccessSubmitting, setEarlyAccessSubmitting] = useState(false)
  const [earlyAccessSubmitted, setEarlyAccessSubmitted] = useState(false)
  const [earlyAccessError, setEarlyAccessError] = useState('')
  const [earlyAccessSubmitError, setEarlyAccessSubmitError] = useState('')
  const [earlyAccessForm, setEarlyAccessForm] = useState<EarlyAccessFormState>(initialForm)

  const showIntro = () => {
    setEarlyAccessError('')
    setEarlyAccessSubmitError('')
    setEarlyAccessSubmitted(false)
    setEarlyAccessStep(0)
    setShowEarlyAccessModal(true)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('early-access') === '1') {
      window.localStorage.removeItem('coodra_early_access_dismissed_v1')
      showIntro()
      params.delete('early-access')
      const nextSearch = params.toString()
      const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`
      window.history.replaceState({}, '', nextUrl)
      return
    }

    if (location.pathname !== '/') return

    const submitted = window.localStorage.getItem('coodra_early_access_submitted_v1') === '1'
    const dismissed = window.localStorage.getItem('coodra_early_access_dismissed_v1') === '1'
    if (submitted || dismissed) return

    const timer = window.setTimeout(() => setShowEarlyAccessModal(true), 900)
    return () => window.clearTimeout(timer)
  }, [location.pathname, location.search])

  useEffect(() => {
    const onOpenEarlyAccess = () => {
      window.localStorage.removeItem('coodra_early_access_dismissed_v1')
      showIntro()
    }

    window.addEventListener('coodra:open-early-access', onOpenEarlyAccess)
    return () => window.removeEventListener('coodra:open-early-access', onOpenEarlyAccess)
  }, [])

  const handleEarlyAccessInput = (field: keyof EarlyAccessFormState, value: string) => {
    setEarlyAccessForm((prev) => ({ ...prev, [field]: value }))
    if (earlyAccessSubmitError) {
      setEarlyAccessSubmitError('')
    }
  }

  const closeEarlyAccessModal = () => {
    window.localStorage.setItem('coodra_early_access_dismissed_v1', '1')
    setEarlyAccessStep(0)
    setEarlyAccessError('')
    setEarlyAccessSubmitError('')
    setShowEarlyAccessModal(false)
  }

  const goToEarlyAccessStep1 = () => {
    setEarlyAccessError('')
    setEarlyAccessSubmitError('')
    setEarlyAccessStep(1)
  }

  const goToEarlyAccessStep2 = () => {
    if (!earlyAccessForm.name.trim() || !earlyAccessForm.email.trim() || !earlyAccessForm.posSystem.trim()) {
      setEarlyAccessError('Please complete name, email, and POS system.')
      return
    }
    setEarlyAccessError('')
    setEarlyAccessSubmitError('')
    setEarlyAccessStep(2)
  }

  const goToEarlyAccessStep1From2 = () => {
    setEarlyAccessError('')
    setEarlyAccessSubmitError('')
    setEarlyAccessStep(1)
  }

  const submitEarlyAccess = async (event: FormEvent) => {
    event.preventDefault()
    if (!earlyAccessForm.name.trim() || !earlyAccessForm.email.trim() || !earlyAccessForm.posSystem.trim()) {
      setEarlyAccessError('Please complete name, email, and POS system.')
      return
    }

    setEarlyAccessSubmitting(true)
    setEarlyAccessError('')
    setEarlyAccessSubmitError('')

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'early_access_modal',
          name: earlyAccessForm.name.trim(),
          email: earlyAccessForm.email.trim().toLowerCase(),
          location: earlyAccessForm.location.trim(),
          pos_system: earlyAccessForm.posSystem.trim(),
          store_count: earlyAccessForm.storeCount.trim(),
          monthly_revenue_band: earlyAccessForm.monthlyRevenue.trim(),
          biggest_challenge: earlyAccessForm.biggestChallenge.trim(),
          feedback_partner: earlyAccessForm.feedbackPartner.trim(),
          notes: earlyAccessForm.notes.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      window.localStorage.setItem('coodra_early_access_submitted_v1', '1')
      setEarlyAccessSubmitted(true)
      setEarlyAccessStep(3)
      trackEvent('form_submit', { form_name: 'early_access_waitlist', form_state: 'success' })
    } catch {
      setEarlyAccessSubmitError('Could not submit right now. Please try again in a moment.')
      trackEvent('form_submit', { form_name: 'early_access_waitlist', form_state: 'error' })
    } finally {
      setEarlyAccessSubmitting(false)
    }
  }

  return (
    <>
      {children}
      <EarlyAccessModal
        show={showEarlyAccessModal}
        step={earlyAccessStep}
        submitted={earlyAccessSubmitted}
        submitting={earlyAccessSubmitting}
        validationError={earlyAccessError}
        submitError={earlyAccessSubmitError}
        form={earlyAccessForm}
        onClose={closeEarlyAccessModal}
        onStart={goToEarlyAccessStep1}
        onContinueToStep2={goToEarlyAccessStep2}
        onBackToStep1={goToEarlyAccessStep1From2}
        onInput={handleEarlyAccessInput}
        onSubmit={submitEarlyAccess}
      />
    </>
  )
}
