import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { blogPosts } from '../data/blogPosts'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './BlogPages.css'

// Sort newest first
const sortedPosts = [...blogPosts].sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
)

export default function BlogIndexPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(sortedPosts.map((post) => post.category)))],
    []
  )

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return sortedPosts.filter((post) => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory
      const matchesSearch =
        q === '' ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const SITE_URL = 'https://www.coodra.com'
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
    ],
  }
  const blogPostingList = filteredPosts.map((post) => ({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.isoPublishedAt,
    dateModified: post.isoPublishedAt,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@id': `${SITE_URL}/#organization` },
    url: `${SITE_URL}/blog/${post.slug}`,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
  }))

  return (
    <div className="blog-page blog-page--index">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {blogPostingList.map((posting, i) => (
        <script
          key={filteredPosts[i].slug}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(posting) }}
        />
      ))}
      <div className="blog-page__container">
        <MarketingHeader />

        <section className="blog-hero">
          <h1>Retail Inventory Intelligence</h1>
          <p>
            Actionable breakdowns on inventory, POS signal quality, and practical operating moves
            that improve margin and reduce stock risk.
          </p>

          <nav className="blog-filter" aria-label="Blog categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`blog-filter__pill ${activeCategory === category ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
            <label className="blog-filter__search-wrap" aria-label="Search posts">
              <input
                type="search"
                className="blog-filter__search-input"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </nav>
        </section>

        <section className="blog-latest" aria-label="Latest posts">
          <h2>LATEST</h2>
          <section className="blog-grid" aria-label="Blog posts">
            {filteredPosts.map((post) => (
              <article key={post.slug} className="blog-card-wrap">
                <Link className="blog-card" to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                  <figure className="blog-card__thumb">
                    <img src={post.coverImage} alt={post.coverImageAlt} loading="lazy" />
                  </figure>
                  <div className="blog-card__body">
                    <p className="blog-card__meta">{post.category}</p>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <p className="blog-card__byline">{post.author} | {post.publishedAt}</p>
                  </div>
                </Link>
              </article>
            ))}
          </section>
        </section>

      </div>
      <MarketingFooter />
    </div>
  )
}
