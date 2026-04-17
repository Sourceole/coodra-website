import type { MetaFunction } from 'react-router'
import BlogPostPage from '../pages/BlogPostPage'
import { getBlogPostBySlug } from '../data/blogPosts'

const dateModified = '2026-04-17'
const datePublishedBySlug: Record<string, string> = {
  'inventory-mistakes-that-kill-margin': '2026-04-13',
  'pos-data-trust-guide': '2026-04-13',
}

export const meta: MetaFunction = ({ params }) => {
  const post = getBlogPostBySlug(params.slug || '')
  const title = post ? `${post.title} | Coodra` : 'Blog Article | Coodra'
  const description = post ? post.excerpt : 'Retail decision intelligence article from Coodra.'
  const url = post ? `https://www.coodra.com/blog/${post.slug}` : 'https://www.coodra.com/blog'

  const headline = post?.title.replace(/^Coodra\s*\|\s*/i, '')
  const datePublished = post ? datePublishedBySlug[post.slug] : undefined

  const articleSchema = post && datePublished
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        author: { '@type': 'Person', name: 'Coodra Team' },
        datePublished,
        dateModified,
        image: 'https://www.coodra.com/og-image.png',
        publisher: {
          '@type': 'Organization',
          name: 'Coodra',
          logo: { '@type': 'ImageObject', url: 'https://www.coodra.com/og-image.png' },
        },
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
      ? [
          {
            tagName: 'script',
            type: 'application/ld+json',
            props: {
              dangerouslySetInnerHTML: {
                __html: JSON.stringify(articleSchema),
              },
            },
          },
        ]
      : []),
  ]
}

export default BlogPostPage
