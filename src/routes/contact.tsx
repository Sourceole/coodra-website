import ContactPage from '../pages/ContactPage'
import type { ActionFunctionArgs, MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'Contact Coodra — Support, Sales & Partnerships | Coodra' },
  { name: 'description', content: 'Reach the Coodra team for support, sales, partnerships, or product questions. We reply within 1 business day.' },
  { property: 'og:title', content: 'Contact Coodra — Support, Sales & Partnerships' },
  { property: 'og:description', content: 'Reach the Coodra team for support, sales, partnerships, or product questions. We reply within 1 business day.' },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/contact' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Contact Coodra — Support, Sales & Partnerships' },
  { name: 'twitter:description', content: 'Reach the Coodra team for support, sales, partnerships, or product questions. We reply within 1 business day.' },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/contact' },
]

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email)
const MAX_CONTACT_BODY_BYTES = 32 * 1024
const CONTACT_RATE_WINDOW_MS = 10 * 60 * 1000
const CONTACT_RATE_LIMIT = 5
const contactBuckets = new Map<string, { count: number; resetAt: number }>()

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const field = (value: unknown, maxLength: number) =>
  String(value || '').trim().slice(0, maxLength)

const clientIp = (headers: Headers) =>
  String(headers.get('x-forwarded-for') || '').split(',')[0]?.trim()
    || String(headers.get('x-real-ip') || headers.get('cf-connecting-ip') || 'unknown')

function isRateLimited(bucketKey: string) {
  const now = Date.now()
  const bucket = contactBuckets.get(bucketKey)
  if (!bucket || bucket.resetAt <= now) {
    contactBuckets.set(bucketKey, { count: 1, resetAt: now + CONTACT_RATE_WINDOW_MS })
    return false
  }
  bucket.count += 1
  return bucket.count > CONTACT_RATE_LIMIT
}

function securityError(message: string) {
  return {
    ok: false,
    message,
    errors: {},
    values: {
      name: '',
      businessName: '',
      email: '',
      subject: 'Sales',
      message: '',
    },
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_CONTACT_BODY_BYTES) {
    return securityError('Your message is too large. Please shorten it and try again.')
  }

  if (isRateLimited(`contact:${clientIp(request.headers)}`)) {
    return securityError('Too many messages were submitted. Please wait a few minutes and try again.')
  }

  const formData = await request.formData()

  const values = {
    name: field(formData.get('name'), 120),
    businessName: field(formData.get('businessName'), 160),
    email: field(formData.get('email'), 254).toLowerCase(),
    subject: field(formData.get('subject') || 'Sales', 120),
    message: field(formData.get('message'), 2000),
  }

  const errors: Record<string, string> = {}
  if (!values.name) errors.name = 'Please enter your name.'
  if (!values.businessName) errors.businessName = 'Please enter your business name.'
  if (!values.email || !isValidEmail(values.email)) errors.email = 'Please enter a valid email.'
  if (!values.message || values.message.length < 8) errors.message = 'Please enter a short message (8+ characters).'

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: 'Please fix the highlighted fields and try again.',
      errors,
      values,
    }
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Coodra <onboarding@resend.dev>'
  const toEmail = process.env.CONTACT_TO_EMAIL || 'admin@coodra.com'

  if (!resendApiKey) {
    return {
      ok: false,
      message: 'Contact delivery is not configured yet. Please email admin@coodra.com directly.',
      errors: {},
      values,
    }
  }

  const emailText = [
    'New contact request from coodra.com',
    `Name: ${values.name}`,
    `Business: ${values.businessName}`,
    `Email: ${values.email}`,
    `Subject: ${values.subject}`,
    '',
    'Message:',
    values.message,
  ].join('\n')

  const emailHtml = `
    <div style="font-family: 'Nunito', 'Segoe UI', sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin: 0 0 12px;">New contact request from coodra.com</h2>
      <p><strong>Name:</strong> ${escapeHtml(values.name)}</p>
      <p><strong>Business:</strong> ${escapeHtml(values.businessName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(values.subject)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(values.message)}</p>
    </div>
  `

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: values.email,
      subject: `[Coodra Contact] ${values.subject} - ${values.businessName}`,
      text: emailText,
      html: emailHtml,
    }),
  })

  if (!resendRes.ok) {
    return {
      ok: false,
      message: 'We could not send your message right now. Please email admin@coodra.com directly.',
      errors: {},
      values,
    }
  }

  return {
    ok: true,
    message: "Thanks, your message was submitted. We'll reply within 1 business day.",
    errors: {},
    values: {
      name: '',
      businessName: '',
      email: '',
      subject: 'Sales',
      message: '',
    },
  }
}

export default ContactPage
