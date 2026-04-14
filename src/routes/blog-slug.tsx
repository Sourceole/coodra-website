import type { MetaFunction } from 'react-router'
import BlogPostPage from '../pages/BlogPostPage'
import { getBlogPostBySlug } from '../data/blogPosts'

export const meta: MetaFunction = ({ params }) => {
  const post = getBlogPostBySlug(params.slug || '')
  const title = post ? `${post.title} - Coodra Blog` : 'Blog Article - Coodra'
  const description = post ? post.excerpt : 'Retail decision intelligence article from Coodra.'
  const url = post ? `https://www.coodra.com/blog/${post.slug}` : 'https://www.coodra.com/blog'

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
  ]
}

export default BlogPostPage

