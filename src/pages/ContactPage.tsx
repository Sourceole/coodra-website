import { Form, Link, useActionData, useNavigation } from 'react-router'
import './LegalPages.css'
import { useEffect } from 'react'
import { trackEvent } from '../lib/analytics'
import MarketingHeader from '../components/MarketingHeader'

type ContactActionData = {
  ok?: boolean
  message?: string
  errors?: Record<string, string>
  values?: Record<string, string>
}

export default function ContactPage() {
  const actionData = useActionData<ContactActionData>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  useEffect(() => {
    if (actionData?.ok) {
      trackEvent('contact_form_submit', { page_path: '/contact' })
    }
  }, [actionData?.ok])

  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <MarketingHeader />

        <div className="legal-page__shell">
          <aside className="legal-page__sidebar">
            <p className="legal-page__sidebarTitle">Company</p>
            <nav className="legal-page__sidebarLinks" aria-label="Company pages">
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/integrations">Integrations</Link>
              <Link to="/security">Security</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </nav>
          </aside>

          <article className="legal-page__card">
            <p className="legal-page__eyebrow">Company</p>
            <h1>Contact</h1>

            <p>
              Product questions, support issues, partnerships, or press requests.
              We reply within <strong>1 business day</strong>.
            </p>

            {actionData?.ok ? (
              <p className="legal-page__highlight">{actionData.message}</p>
            ) : null}

            <Form method="post" className="legal-page__form" noValidate>
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  defaultValue={actionData?.values?.name || ''}
                  required
                />
                {actionData?.errors?.name ? <span className="legal-page__error">{actionData.errors.name}</span> : null}
              </label>

              <label>
                Business name
                <input
                  type="text"
                  name="businessName"
                  defaultValue={actionData?.values?.businessName || ''}
                  required
                />
                {actionData?.errors?.businessName ? <span className="legal-page__error">{actionData.errors.businessName}</span> : null}
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  defaultValue={actionData?.values?.email || ''}
                  required
                />
                {actionData?.errors?.email ? <span className="legal-page__error">{actionData.errors.email}</span> : null}
              </label>

              <label>
                Subject
                <select name="subject" defaultValue={actionData?.values?.subject || 'Sales'} required>
                  <option value="Sales">Sales</option>
                  <option value="Support">Support</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Press">Press</option>
                </select>
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  rows={6}
                  defaultValue={actionData?.values?.message || ''}
                  required
                />
                {actionData?.errors?.message ? <span className="legal-page__error">{actionData.errors.message}</span> : null}
              </label>

              <button type="submit" className="legal-page__submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send message'}
              </button>
            </Form>

            <h2>Direct contact</h2>
            <p>
              Email fallback: <a href="mailto:admin@coodra.com">admin@coodra.com</a>
            </p>
            <p>Office coverage: Canada and United States</p>

            <h2>Social</h2>
            <div className="legal-page__socials">
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
              <a href="#" aria-label="X">X</a>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
