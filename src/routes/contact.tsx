import ContactPage from '../pages/ContactPage'
import type { ActionFunctionArgs, MetaFunction } from 'react-router'

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.coodra.com/' },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://www.coodra.com/contact' },
  ],
}

export const meta: MetaFunction = () => [
  { title: 'Contact | Coodra' },
  { name: 'description', content: 'Contact Coodra for support, privacy requests, partnerships, and product questions.' },
  { property: 'og:title', content: 'Contact | Coodra' },
  { property: 'og:description', content: 'Contact Coodra for support, privacy requests, partnerships, and product questions.' },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/contact' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Contact | Coodra' },
  { name: 'twitter:description', content: 'Contact Coodra for support, privacy requests, partnerships, and product questions.' },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/contact' },
  {
    tagName: 'script',
    type: 'application/ld+json',
    props: {
      dangerouslySetInnerHTML: {
        __html: JSON.stringify(breadcrumbSchema),
      },
    },
  },
]

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email)
const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  const values = {
    name: String(formData.get('name') || '').trim(),
    businessName: String(formData.get('businessName') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    subject: String(formData.get('subject') || 'Sales').trim(),
    message: String(formData.get('message') || '').trim(),
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
