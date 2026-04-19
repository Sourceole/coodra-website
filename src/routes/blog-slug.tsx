import type { MetaFunction } from 'react-router'
import BlogPostPage from '../pages/BlogPostPage'
import { getBlogPostBySlug } from '../data/blogPosts'

const SITE_URL = 'https://www.coodra.com'

const authorPerson = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Michael Shahid',
  jobTitle: 'CEO',
  url: SITE_URL,
  sameAs: ['https://www.linkedin.com/company/coodra/'],
}

export const meta: MetaFunction = ({ params }) => {
  const post = getBlogPostBySlug(params.slug || '')
  if (!post) return [{ title: 'Blog Article | Coodra' }]

  const title = `${post.title} | Coodra`
  const description = post.excerpt
  const url = `${SITE_URL}/blog/${post.slug}`

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}/og-image.png`,
    datePublished: post.isoPublishedAt,
    author: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    url,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: `${SITE_URL}/og-image.png` },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'Coodra' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: `${SITE_URL}/og-image.png` },
    { name: 'robots', content: 'index, follow' },
    { tagName: 'link', rel: 'canonical', href: url },
    { tagName: 'script', type: 'application/ld+json', children: JSON.stringify(authorPerson) },
    { tagName: 'script', type: 'application/ld+json', children: JSON.stringify(articleJsonLd) },
  ]
}

export default BlogPostPage
