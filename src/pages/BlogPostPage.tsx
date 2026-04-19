import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { blogPosts, getBlogPostBySlug } from '../data/blogPosts'
import { trackEvent } from '../lib/analytics'
import MarketingHeader from '../components/MarketingHeader'
import './BlogPages.css'

export default function BlogPostPage() {
  const { slug = '' } = useParams()
  const post = getBlogPostBySlug(slug)
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null)

  useEffect(() => {
    if (!post) return
    const timer = window.setTimeout(() => {
      trackEvent('blog_article_read', {
        article_slug: post.slug,
        page_path: `/blog/${post.slug}`,
        seconds_on_page: 30,
      })
    }, 30_000)

    return () => window.clearTimeout(timer)
  }, [post])

  if (!post) {
    return (
      <div className="blog-page">
        <div className="blog-page__container">
          <MarketingHeader />

          <article className="blog-article">
            <p className="blog-breadcrumbs">Home {'>'} Blog</p>
            <h1>Article not found</h1>
            <p className="blog-article__lede">We could not find this blog article.</p>
            <div className="blog-cta">
              <Link to="/blog">Back to blog</Link>
            </div>
          </article>
        </div>
      </div>
    )
  }

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2)

  const SITE_URL = 'https://www.coodra.com'
  const authorPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: post.author,
    jobTitle: 'CEO',
    url: SITE_URL,
    sameAs: ['https://www.linkedin.com/company/coodra/'],
  }
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}/og-image.png`,
    datePublished: post.isoPublishedAt,
    author: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    url: `${SITE_URL}/blog/${post.slug}`,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
  }

  return (
    <div className="blog-page">
      <div className="blog-page__container">
        <MarketingHeader />

        <article className="blog-article">
          <p className="blog-breadcrumbs">
            <Link to="/">Home</Link> {'>'} <Link to="/blog">Blog</Link> {'>'} {post.title}
          </p>
          <h1>{post.title}</h1>
          <p className="blog-article__meta">
            {post.category} - {post.readingTime} - {post.author} - {post.publishedAt}
          </p>
          <p className="blog-article__lede">{post.excerpt}</p>

          <div className="blog-content">
            {post.content.map((block, i) => {
              if (block.type === 'paragraph') {
                return (
                  <div
                    key={i}
                    className="blog-content__paragraph"
                    dangerouslySetInnerHTML={{ __html: block.text }}
                  />
                )
              }
              if (block.type === 'image') {
                return (
                  <figure key={i} className="blog-content__image">
                    <img
                      src={block.src}
                      alt={block.alt}
                      loading="lazy"
                    />
                    {block.caption && (
                      <figcaption>{block.caption}</figcaption>
                    )}
                  </figure>
                )
              }
              if (block.type === 'callout') {
                return (
                  <div key={i} className="blog-content__callout">
                    {block.text}
                  </div>
                )
              }
              return null
            })}
          </div>

          <div className="blog-helpful">
            <p>Was this helpful?</p>
            <div className="blog-helpful__actions">
              <button
                type="button"
                onClick={() => {
                  setFeedback('yes')
                  trackEvent('blog_feedback', { article_slug: post.slug, helpful: true })
                }}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => {
                  setFeedback('no')
                  trackEvent('blog_feedback', { article_slug: post.slug, helpful: false })
                }}
              >
                No
              </button>
            </div>
            {feedback ? <p>Thanks for the feedback.</p> : null}
          </div>

          <div className="blog-cta">
            <Link to="/signup" className="btn">Start Free</Link>
          </div>

          <section className="blog-related">
            <h2>Related articles</h2>
            <ul>
              {related.map((item) => (
                <li key={item.slug}>
                  <Link to={`/blog/${item.slug}`}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        </article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(authorPerson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      </div>
    </div>
  )
}
