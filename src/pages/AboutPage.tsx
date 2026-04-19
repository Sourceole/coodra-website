import { useEffect } from 'react'
import { Link } from 'react-router'
import { Compass, Sparkles, Target, Users } from 'lucide-react'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './AboutPage.css'

const principles = [
  {
    icon: Users,
    title: 'Built with operators',
    body: 'We design by watching how store teams actually work, then remove friction from daily decisions.',
  },
  {
    icon: Target,
    title: 'Action over noise',
    body: 'Coodra focuses on clear next moves, not endless dashboards. Teams should know what to do now.',
  },
  {
    icon: Compass,
    title: 'Practical AI',
    body: 'Recommendations stay understandable and reviewable so teams can move fast with confidence.',
  },
]

const leadership = [
  {
    initials: 'MS',
    name: 'Michael Shahid',
    role: 'Founder',
    body: 'Leads Coodra product direction and operational strategy for independent retail teams.',
    image: '/images/michael.jpg',
  },
  {
    initials: 'PE',
    name: 'Platform Leadership',
    role: 'Product & Engineering',
    body: 'Owns recommendation quality, reliability, and the day-to-day operator experience.',
    image: '',
  },
  {
    initials: 'CO',
    name: 'Customer Leadership',
    role: 'Implementation & Success',
    body: 'Partners with stores to launch quickly and operationalize outcomes with minimal lift.',
    image: '',
  },
]

export default function AboutPage() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.about-reveal'))
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="about-v2-page">
      <MarketingHeader />

      <main className="about-v2-main">
        <section className="about-v2-hero about-reveal is-visible" aria-label="About hero">
          <div className="about-v2-hero__bg" aria-hidden="true" />
          <div className="about-v2-section-inner">
            <p className="about-v2-badge">
              <Sparkles size={14} aria-hidden="true" />
              About Coodra
            </p>
            <h1>
              OPERATIONS CLARITY FOR
              <br />
              <em>INDEPENDENT RETAIL.</em>
            </h1>
            <p className="about-v2-hero__sub">
              Coodra helps store teams move from scattered signals to clear, reviewable decisions in one workflow.
            </p>
          </div>
          <div className="about-v2-hero-scroll" aria-hidden="true">
            <span>Scroll to explore</span>
            <div className="about-v2-hero-scroll-line" />
          </div>
        </section>

        <section className="about-v2-manifesto about-reveal" aria-label="Manifesto">
          <div className="about-v2-section-inner">
            <p className="about-v2-eyebrow about-v2-eyebrow--teal">Our Belief</p>
            <blockquote>
              "Every <span>jeweler</span>, every <span>grocery owner</span>, every <span>pharmacist</span> deserves the same AI
              muscle that runs <em>Walmart</em>."
            </blockquote>
            <p>
              Independent retailers are not small because they lack intelligence. They are underserved because big-tech built tools
              for enterprises first. Coodra flips that - starting with the independent retailer, building outward.
            </p>
          </div>
        </section>

        <section className="about-v2-founding about-reveal" aria-label="Founding story">
          <div className="about-v2-section-inner about-v2-founding__inner">
            <div className="about-v2-founding__media" aria-hidden="true">
              <img src="/images/coodra_dashboard_1.png" alt="" className="about-v2-founding__image" loading="lazy" />
            </div>
            <div className="about-v2-founding__copy">
              <p className="about-v2-eyebrow">Founding Story</p>
              <h2>Built to support the pace of real stores.</h2>
              <p>
                Coodra started with one focus: help independent retailers make stronger operational decisions without extra
                complexity. The product direction has stayed the same, practical workflows, clear rationale, measurable outcomes.
              </p>
              <p>
                Instead of replacing operators, Coodra gives teams a better operating layer for inventory, margin, and decision
                approvals.
              </p>
            </div>
          </div>
        </section>

        <section className="about-v2-principles about-reveal" aria-label="Principles">
          <div className="about-v2-section-inner">
            <header>
              <p className="about-v2-eyebrow">Principles</p>
              <h2>How we build product at Coodra.</h2>
            </header>
            <div className="about-v2-principles__grid">
              {principles.map((item) => (
                <article key={item.title}>
                  <div className="about-v2-principles__icon" aria-hidden="true">
                    <item.icon size={18} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-v2-leadership about-reveal" aria-label="Leadership">
          <div className="about-v2-section-inner">
            <header>
              <p className="about-v2-eyebrow">The People</p>
              <h2>LEADERSHIP</h2>
            </header>
            <div className="about-v2-leadership__grid">
              {leadership.map((person) => (
                <article key={person.name}>
                  <div className="about-v2-leadership__avatar" aria-hidden="true">
                    {person.image ? (
                      <img src={person.image} alt={`${person.name} portrait`} loading="lazy" />
                    ) : (
                      person.initials
                    )}
                  </div>
                  <h3>{person.name}</h3>
                  <p className="about-v2-leadership__role">{person.role}</p>
                  <p>{person.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-v2-cta about-reveal" aria-label="Call to action">
          <div className="about-v2-section-inner">
            <h2>READY TO RUN YOUR STORE ON AUTOPILOT?</h2>
            <p>Join independent retailers who use Coodra to protect margin and make smarter decisions every day.</p>
            <div className="about-v2-cta__actions">
              <Link to="/signup" className="about-v2-btn about-v2-btn--primary">
                Start For Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
