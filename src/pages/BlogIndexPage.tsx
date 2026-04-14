import { Link } from 'react-router'
import { blogPosts } from '../data/blogPosts'
import MarketingHeader from '../components/MarketingHeader'
import './BlogPages.css'

export default function BlogIndexPage() {
  return (
    <div className="blog-page">
      <div className="blog-page__container">
        <MarketingHeader />

        <section className="blog-hero">
          <p className="blog-hero__eyebrow">Blog</p>
          <h1>Retail decision insights for operators.</h1>
          <p>
            Actionable breakdowns on inventory, POS signal quality, and practical operating moves
            that improve margin and reduce stock risk.
          </p>
        </section>

        <section className="blog-grid" aria-label="Blog posts">
          {blogPosts.map((post) => (
            <article key={post.slug} className="blog-card-wrap">
              <Link className="blog-card" to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                <figure className="blog-card__thumb">
                  <img src={post.coverImage} alt={post.coverImageAlt} loading="lazy" />
                </figure>
                <div className="blog-card__body">
                  <p className="blog-card__meta">{post.category} - {post.readingTime}</p>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <span className="blog-card__link">
                    Read article
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
