import type { MetaFunction } from 'react-router'
import BlogPostPage from '../pages/BlogPostPage'
import { getBlogPostBySlug } from '../data/blogPosts'

const datePublishedBySlug: Record<string, string> = {
  'inventory-mistakes-that-kill-margin': '2026-04-13',
  'pos-data-trust-guide': '2026-04-13',
  'dead-inventory-signs': '2026-04-17',
  'reorder-points-without-excel': '2026-04-17',
  'coodra-vs-netstock': '2026-04-17',
  'how-to-read-pos-data': '2026-04-17',
  'stock-to-sales-ratio-guide': '2026-04-17',
}

const publisher = {
  '@type': 'Organization',
  name: 'Coodra',
  url: 'https://www.coodra.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.coodra.com/favicon.svg',
  },
}

export const meta: MetaFunction = ({ params }) => {
  const post = getBlogPostBySlug(params.slug || '')
  const title = post ? `${post.title} | Coodra` : 'Blog Article | Coodra'
  const description = post ? post.excerpt : 'Retail decision intelligence article from Coodra.'
  const url = post ? `https://www.coodra.com/blog/${post.slug}` : 'https://www.coodra.com/blog'
  const isoDate = post ? (datePublishedBySlug[post.slug] ?? '2026-04-17') : '2026-04-17'

  const articleSchema = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        author: { '@type': 'Person', name: post.author },
        datePublished: isoDate,
        dateModified: isoDate,
        image: [`https://www.coodra.com${post.coverImage}`],
        publisher,
        url,
        description: post.excerpt,
      }
    : null

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'Coodra' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
    { name: 'robots', content: 'index, follow' },
    { tagName: 'link', rel: 'canonical', href: url },
    ...(articleSchema
      ? [{ 'script:ld+json': articleSchema }]
      : []),
  ]
}

export default BlogPostPage
