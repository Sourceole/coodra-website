import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link } from 'react-router'
import Lenis from 'lenis'
import { motion, useReducedMotion } from 'framer-motion'
import { trackEvent } from '../lib/analytics'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import BackgroundPaths from '../components/BackgroundPaths'
import MarketingMedia from '../components/MarketingMedia'
import './LandingPage.css'

const integrationShowcaseItems = [
  {
    name: 'Shopify',
    iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/shopify.svg',
    logoClass: 'integration-logo-shopify',
  },
  {
    name: 'Square',
    iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/square.svg',
    logoClass: 'integration-logo-square',
  },
  {
    name: 'Lightspeed',
    iconSrc: '/images/integrations/lightspeed.png?v=20260410',
    logoClass: 'integration-logo-lightspeed',
  },
  {
    name: 'Clover',
    iconSrc: '/images/integrations/clover.png?v=20260410',
    logoClass: 'integration-logo-clover',
  },
  {
    name: 'Moneris',
    iconSrc: '/images/integrations/moneris.png?v=20260410',
    logoClass: 'integration-logo-moneris',
  },
]

const decisionParticles = [
  { x: 12, y: 28, size: 8, dur: 18, delay: 0.2, alpha: 0.52 },
  { x: 24, y: 62, size: 6, dur: 22, delay: 1.8, alpha: 0.44 },
  { x: 33, y: 40, size: 9, dur: 20, delay: 0.9, alpha: 0.48 },
  { x: 46, y: 74, size: 6, dur: 24, delay: 2.5, alpha: 0.42 },
  { x: 58, y: 32, size: 7, dur: 19, delay: 1.1, alpha: 0.5 },
  { x: 69, y: 57, size: 6, dur: 23, delay: 3.2, alpha: 0.4 },
  { x: 81, y: 36, size: 8, dur: 21, delay: 2.1, alpha: 0.46 },
  { x: 87, y: 69, size: 9, dur: 26, delay: 1.4, alpha: 0.43 },
]

const chatUserPrompt = 'Reorder 4 cases from my main distributor'
const chatAssistantIntro =
  'Oatly Barista Edition is trending 24% above normal this week. Stockout predicted by Friday. Based on distributor lead times, you should reorder now to avoid a gap.'
const chatAssistantDecisionTitle = 'Draft PO created - $186.00'
const chatAssistantDecisionBody = '4 cases of Oatly Barista Edition -> Main Street Distributors. Approve to send?'

const testimonials = [
  {
    initials: 'SJ',
    name: 'Sophie J.',
    role: 'Multi-location grocery',
    company: 'Corner Street Market',
    quote: 'Coodra flagged stockout risk two days earlier. We recovered weekend sales before it hurt us.',
  },
  {
    initials: 'ML',
    name: 'Marcus L.',
    role: 'Specialty pet retail',
    company: 'FreshMart Group',
    quote: 'Reorder recommendations are clearer than our old reports. My team moves in minutes now.',
  },
  {
    initials: 'AG',
    name: 'Ariana G.',
    role: 'Health & wellness',
    company: 'Peak Wellness',
    quote: 'We stopped over-ordering low velocity SKUs and protected margin in the same month.',
  },
  {
    initials: 'TR',
    name: 'Tyler R.',
    role: 'Convenience stores',
    company: 'Daily Grind',
    quote: 'The why behind each suggestion made approvals easy for operators and owners.',
  },
  {
    initials: 'EB',
    name: 'Elena B.',
    role: 'Beauty retail',
    company: 'Glow House',
    quote: 'Coodra highlighted weak movers we kept missing. We corrected mix faster than ever.',
  },
  {
    initials: 'DK',
    name: 'David K.',
    role: 'Electronics chain',
    company: 'Volt Retail',
    quote: 'Signal quality is strong. It feels like an operator that never sleeps.',
  },
  {
    initials: 'NP',
    name: 'Nadia P.',
    role: 'Urban convenience',
    company: 'Metro Mini',
    quote: 'Our team trusts the next-best action view. We fix risk before it becomes lost sales.',
  },
]

const howSteps = [
  {
    title: 'See what changed',
    body: 'Spot unusual demand, low stock, margin pressure, and slow movers without digging through reports or guessing where the problem started.',
  },
  {
    title: 'Understand why it matters',
    body: 'A signal on its own is not that useful. Coodra connects it to the real consequence, like a stockout, a margin leak, or cash stuck in the wrong product.',
  },
  {
    title: 'Take the next best action',
    body: 'Review what deserves attention first, along with the reasoning behind it, so you can move faster without second-guessing every call.',
  },
]

const howScenes = [
  {
    kind: 'shift',
    headline: 'First, see the shift.',
    body: 'Your store is always telling you something. A product starts moving faster. Stock cover gets thinner. A margin gap opens up. Coodra pulls that signal out of the noise so you see it before it turns into a bigger problem.',
    note: 'You should not have to babysit reports to catch what changed.',
    chips: ['Oatly +24% sell-through', 'Stock cover down 2.8 days', 'Margin pressure in dairy'],
  },
  {
    kind: 'risk',
    headline: 'Then, understand the risk.',
    body: 'A spike in demand is not just a spike in demand. Sometimes it means you are about to run out. Sometimes it means you are putting cash in the wrong place. Coodra helps make the consequence obvious.',
    note: 'Good operators already think this way. Coodra just helps them do it faster and more consistently.',
    chips: ['Risk: Stockout by Friday', 'Cash tied in slow movers', 'Gross margin impact: -3.1%'],
  },
  {
    kind: 'action',
    headline: 'Then, make the move.',
    body: 'Instead of leaving you with more charts, Coodra points to the next thing worth doing. Reorder sooner. Cut the next PO. Check a price. You still decide. You just start from a much clearer place.',
    note: 'That is the whole idea: less guesswork, fewer blind spots, better calls.',
    chips: ['Reorder 4 cases now', 'Reduce PO on low-velocity SKU', 'Review weekend price change'],
  },
]

const howSceneMedia = {
  shift: {
    posterPng: '/images/how/how-shift-illustration.svg',
    videoMp4: undefined,
    objectPosition: 'center center',
  },
  risk: {
    posterPng: '/images/how/how-risk-illustration.svg',
    videoMp4: undefined,
    objectPosition: 'center center',
  },
  action: {
    posterPng: '/images/how/how-action-illustration.svg',
    videoMp4: undefined,
    objectPosition: 'center center',
  },
} as const

export default function LandingPage() {
  const [isLiteHero, setIsLiteHero] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [, setIntroStream] = useState('')
  const [, setInputDraft] = useState('')
  const [, setIsSendingPrompt] = useState(false)
  const [, setShowUserPrompt] = useState(false)
  const [, setDecisionTitleStream] = useState('')
  const [, setDecisionBodyStream] = useState('')
  const [activeHowScene, setActiveHowScene] = useState(0)
  const [outgoingTestimonial, setOutgoingTestimonial] = useState<number | null>(null)
  const reduceMotion = useReducedMotion()
  const testimonialDeckDepth = 4
  const outgoingTimerRef = useRef<number | null>(null)
  const ctaCardRef = useRef<HTMLElement | null>(null)
  const howSectionRef = useRef<HTMLElement | null>(null)

  const transitionToTestimonial = (resolveNext: (current: number) => number) => {
    setActiveTestimonial((current) => {
      const next = ((resolveNext(current) % testimonials.length) + testimonials.length) % testimonials.length
      if (next === current) return current

      setOutgoingTestimonial(current)
      if (outgoingTimerRef.current !== null) {
        window.clearTimeout(outgoingTimerRef.current)
      }
      outgoingTimerRef.current = window.setTimeout(() => {
        setOutgoingTestimonial((prev) => (prev === current ? null : prev))
      }, 850)

      return next
    })
  }

  useEffect(() => {
    // Set theme on <html> so CSS vars cascade correctly
    document.documentElement.setAttribute('data-theme', 'light')

    // Defer landing canvas/animation script until after load to protect LCP.
    const loadScript = () => {
      if (document.getElementById('landing-app-script')) return
      const script = document.createElement('script')
      script.id = 'landing-app-script'
      script.src = '/landing/app.js?v=20260415-4'
      script.defer = true
      document.body.appendChild(script)
    }

    const scheduleScriptLoad = () => {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
        cancelIdleCallback?: (id: number) => void
      }

      if (typeof w.requestIdleCallback === 'function') {
        w.requestIdleCallback(loadScript, { timeout: 2400 })
      } else {
        window.setTimeout(loadScript, 1200)
      }
    }

    if (document.readyState === 'complete') {
      scheduleScriptLoad()
    } else {
      window.addEventListener('load', scheduleScriptLoad, { once: true })
    }

    return () => {
      window.removeEventListener('load', scheduleScriptLoad)
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  useEffect(() => {
    const section = document.getElementById('proof')
    if (!section) return

    let fired = false
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!fired && entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            fired = true
            trackEvent('testimonial_section_visible', {
              page_path: '/',
              section_id: 'proof',
            })
          }
        })
      },
      { threshold: [0.35] }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const checkLiteHero = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const isNarrowViewport = window.matchMedia('(max-width: 900px)').matches
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      const isSaveData = Boolean(connection?.saveData)
      setIsLiteHero(prefersReducedMotion || isNarrowViewport || isSaveData)
    }

    checkLiteHero()
    window.addEventListener('resize', checkLiteHero, { passive: true })
    return () => window.removeEventListener('resize', checkLiteHero)
  }, [])

  useEffect(() => {
    const sectionNode = howSectionRef.current
    if (!sectionNode) return

    const scenes = Array.from(sectionNode.querySelectorAll<HTMLElement>('[data-how-scene-index]'))
    if (!scenes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const sceneIndex = Number((entry.target as HTMLElement).dataset.howSceneIndex)
          if (!Number.isNaN(sceneIndex)) {
            setActiveHowScene(sceneIndex)
          }
        })
      },
      {
        threshold: 0.55,
        rootMargin: '-20% 0px -20% 0px',
      }
    )

    scenes.forEach((scene) => observer.observe(scene))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    const interval = window.setInterval(() => {
      transitionToTestimonial((prev) => prev + 1)
    }, 5200)
    return () => window.clearInterval(interval)
  }, [reduceMotion])

  useEffect(() => {
    return () => {
      if (outgoingTimerRef.current !== null) {
        window.clearTimeout(outgoingTimerRef.current)
      }
    }
  }, [])

  const handleCtaPointerMove = (event: MouseEvent<HTMLElement>) => {
    const node = ctaCardRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    node.style.setProperty('--cta-mx', `${Math.max(0, Math.min(100, x))}%`)
    node.style.setProperty('--cta-my', `${Math.max(0, Math.min(100, y))}%`)
  }

  const handleCtaPointerEnter = () => {
    const node = ctaCardRef.current
    if (!node) return
    node.style.setProperty('--cta-glow', '1')
  }

  const handleCtaPointerLeave = () => {
    const node = ctaCardRef.current
    if (!node) return
    node.style.setProperty('--cta-glow', '0')
    node.style.setProperty('--cta-mx', '50%')
    node.style.setProperty('--cta-my', '50%')
  }

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobileOrTablet = window.matchMedia('(max-width: 1024px)').matches
    if (prefersReducedMotion || isMobileOrTablet) return

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.08,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 0.92,
      wheelMultiplier: 0.88,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }

    rafId = window.requestAnimationFrame(raf)
    return () => {
      window.cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const sleep = (ms: number) => new Promise<void>((resolve) => {
      window.setTimeout(resolve, ms)
    })

    const streamText = async (setter: (value: string) => void, text: string, speed: number) => {
      setter('')
      for (let i = 1; i <= text.length; i += 1) {
        if (cancelled) return false
        setter(text.slice(0, i))
        await sleep(speed)
      }
      return true
    }

    const runSequence = async () => {
      setIntroStream('')
      setInputDraft('')
      setIsSendingPrompt(false)
      setShowUserPrompt(false)
      setDecisionTitleStream('')
      setDecisionBodyStream('')

      await sleep(300)
      if (!(await streamText(setIntroStream, chatAssistantIntro, 16))) return

      if (!(await streamText(setInputDraft, chatUserPrompt, 34))) return

      await sleep(260)
      if (cancelled) return
      setIsSendingPrompt(true)
      await sleep(320)
      if (cancelled) return
      setIsSendingPrompt(false)
      setShowUserPrompt(true)
      setInputDraft('')

      await sleep(420)
      if (!(await streamText(setDecisionTitleStream, chatAssistantDecisionTitle, 20))) return
      await sleep(140)
      await streamText(setDecisionBodyStream, chatAssistantDecisionBody, 15)
    }

    void runSequence()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className={`site-shell${isLiteHero ? ' is-lite-hero' : ''}`} id="top">
      <MarketingHeader />

      <main>
        {/* Hero */}
        <section className="hero-v5" id="hero">
          <div className="hero-v5-scene" aria-hidden="true">
            <div className="hero-v5-scene-fallback" />
          </div>

          <div className="hero-v5-watermark wm-a" aria-hidden="true">42.8%</div>
          <div className="hero-v5-watermark wm-b" aria-hidden="true">400+</div>
          <div className="hero-v5-watermark wm-c" aria-hidden="true">$4,200</div>
          <div className="hero-v5-watermark wm-d" aria-hidden="true">15 min</div>

          <div className="hero-v5-floating ds-1" aria-hidden="true">
            <span className="ficon-svg red">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 3.2a.9.9 0 0 1 .9.9v4.1a.9.9 0 1 1-1.8 0V4.1a.9.9 0 0 1 .9-.9Zm0 8.9a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Z" />
              </svg>
            </span>
            Stock Alert - 12 units
          </div>
          <div className="hero-v5-floating ds-2" aria-hidden="true">
            <span className="ficon-svg teal">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M6.8 10.7 3.9 7.8a.9.9 0 0 1 1.3-1.3l1.6 1.6 4.1-4.1a.9.9 0 1 1 1.3 1.3l-5.4 5.4Z" />
              </svg>
            </span>
            PO Draft - $186
          </div>
          <div className="hero-v5-floating ds-3" aria-hidden="true">
            <span className="ficon-svg amber">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2.6 8.8a2.1 2.1 0 0 1 2.1-2.1H5A3.2 3.2 0 0 1 11.2 6h.1a2.1 2.1 0 1 1 0 4.2H4.7a2.1 2.1 0 0 1-2.1-1.4ZM8 5a.8.8 0 0 1 .8.8v.3h.3a.8.8 0 1 1 0 1.6h-.3V8a.8.8 0 1 1-1.6 0v-.3h-.3a.8.8 0 1 1 0-1.6h.3v-.3A.8.8 0 0 1 8 5Z" />
              </svg>
            </span>
            $526 saved<span className="hero-v5-floating-tail"> - this week</span>
          </div>
          <div className="hero-v5-floating ds-4" aria-hidden="true"><span className="ficon arrow">&uarr;</span>+4.2% margin</div>
          <div className="hero-v5-floating ds-5" aria-hidden="true"><span className="ficon violet">&#8599;</span>Oatly +24%</div>
          <div className="hero-v5-floating ds-6" aria-hidden="true"><span className="ficon dark" />Corner Street</div>

          <div className="hero-v5-overlay container">
            <p className="hero-v5-eyebrow">
              <span className="hero-v5-pill-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M8 2.2c.3 1.7 1.6 3 3.3 3.3-1.7.3-3 1.6-3.3 3.3-.3-1.7-1.6-3-3.3-3.3 1.7-.3 3-1.6 3.3-3.3Zm4.4 6.3c.2.9.9 1.6 1.8 1.8-.9.2-1.6.9-1.8 1.8-.2-.9-.9-1.6-1.8-1.8.9-.2 1.6-.9 1.8-1.8Z" />
                </svg>
              </span>
              AI for Independent Retail
            </p>
            <h1 className="hero-v5-headline">
              Your store.
              <br />
              <span className="hero-v5-accent">On autopilot.</span>
            </h1>
            <p className="hero-v5-subhead">
              Coodra is the AI layer that knows your inventory, catches margin leaks, and knows your store better than you do - all from one dashboard.
            </p>
            <div className="hero-v5-actions">
              <Link to="/signup" className="hero-v5-cta hero-v5-cta-primary">Start For Free</Link>
              <Link to="/integrations" className="hero-v5-cta hero-v5-cta-secondary">See Integrations</Link>
            </div>

            <article className="hero-v5-mockup hero-v5-mockup-media" aria-label="Coodra dashboard preview">
              <MarketingMedia
                className="hero-v5-media-frame"
                alt="Coodra dashboard with chat, metrics, and margin alerts"
                posterPng="/images/media/landing-hero-dashboard-real-v2.png"
                videoMp4="/media/landing-hero-main-loop-v1.mp4"
                videoWebm="/media/landing-hero-main-loop-v1.webm"
                objectPosition="center center"
                priority
              />
              <div className="hero-v5-media-caption" aria-hidden="true">
                <span>Live dashboard capture</span>
                <strong>{'Signal to risk to action'}</strong>
              </div>
            </article>
          </div>

        </section>

        {/* How it works */}
        <section id="how-it-works" ref={howSectionRef} className="how-it-works container" data-aos="fade-up" data-aos-delay="150">
          <div className="how-editorial-head">
            <p className="eyebrow how-eyebrow">
              <span className="how-eyebrow-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M8 2.2c.3 1.7 1.6 3 3.3 3.3-1.7.3-3 1.6-3.3 3.3-.3-1.7-1.6-3-3.3-3.3 1.7-.3 3-1.6 3.3-3.3Zm4.4 6.3c.2.9.9 1.6 1.8 1.8-.9.2-1.6.9-1.8 1.8-.2-.9-.9-1.6-1.8-1.8.9-.2 1.6-.9 1.8-1.8Z" />
                </svg>
              </span>
              How it works
            </p>
            <h2>See the shift. Read the risk. Make the move.</h2>
            <p className="how-editorial-intro">
              Most inventory tools stop at showing you numbers. Coodra goes one step further. It shows what changed, why it matters, and what you should look at next.
            </p>
          </div>

          <div className="how-editorial-layout" aria-label="How Coodra helps operators decide faster">
            <aside className="how-editorial-steps" aria-label="How it works steps">
              {howSteps.map((step, index) => (
                <article key={step.title} className={`how-editorial-step${activeHowScene === index ? ' is-active' : ''}`}>
                  <p className="how-step-index">{index + 1}. {step.title}</p>
                  <p>{step.body}</p>
                </article>
              ))}
            </aside>

            <div className="how-editorial-scenes">
              {howScenes.map((scene, index) => (
                <article
                  key={scene.headline}
                  className={`how-editorial-scene scene-${scene.kind}${activeHowScene === index ? ' is-active' : ''}`}
                  data-how-scene-index={index}
                >
                  <div className={`how-editorial-stage stage-${scene.kind}`} aria-hidden="true">
                    {scene.kind === 'shift' ? (
                      <div className="how-stage-visual is-shift">
                        <MarketingMedia
                          className="how-stage-media"
                          alt="Coodra dashboard showing inventory signal changes"
                          posterPng={howSceneMedia.shift.posterPng}
                          videoMp4={howSceneMedia.shift.videoMp4}
                          objectPosition={howSceneMedia.shift.objectPosition}
                        />
                      </div>
                    ) : null}

                    {scene.kind === 'risk' ? (
                      <div className="how-stage-visual is-risk">
                        <MarketingMedia
                          className="how-stage-media"
                          alt="Coodra dashboard showing margin and stockout risk"
                          posterPng={howSceneMedia.risk.posterPng}
                          videoMp4={howSceneMedia.risk.videoMp4}
                          objectPosition={howSceneMedia.risk.objectPosition}
                        />
                      </div>
                    ) : null}

                    {scene.kind === 'action' ? (
                      <div className="how-stage-visual is-action">
                        <MarketingMedia
                          className="how-stage-media"
                          alt="Coodra dashboard showing approval-ready next actions"
                          posterPng={howSceneMedia.action.posterPng}
                          videoMp4={howSceneMedia.action.videoMp4}
                          objectPosition={howSceneMedia.action.objectPosition}
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="how-editorial-copy">
                    <h3>{scene.headline}</h3>
                    <p>{scene.body}</p>
                    <p className="how-scene-note">{scene.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section id="integrations" className="integrations container" data-aos="fade-up" data-aos-delay="200">
          <div className="integrations-float-layout">
            <BackgroundPaths />

            <div className="integrations-float-center">
              <p className="eyebrow eyebrow-with-icon">
                <span className="eyebrow-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="M8 2.2c.3 1.7 1.6 3 3.3 3.3-1.7.3-3 1.6-3.3 3.3-.3-1.7-1.6-3-3.3-3.3 1.7-.3 3-1.6 3.3-3.3Zm4.4 6.3c.2.9.9 1.6 1.8 1.8-.9.2-1.6.9-1.8 1.8-.2-.9-.9-1.6-1.8-1.8.9-.2 1.6-.9 1.8-1.8Z" />
                  </svg>
                </span>
                Integrations
              </p>
              <h2>Connect your stack. Let Coodra handle the signal flow.</h2>
              <p className="integrations-sub">
                Plug in the systems your team already uses and turn raw data into decisions with clear rationale and measurable impact.
              </p>
              <Link to="/integrations" className="hero-v5-cta hero-v5-cta-secondary">See Integrations</Link>
            </div>

            <div className="integrations-float-canvas" role="list" aria-label="Coodra integrations">
              {integrationShowcaseItems.map((item, index) => (
                <article key={item.name} className={`integration-float-card pos-${index + 1}`} role="listitem" aria-label={item.name}>
                  <div className="integration-float-image">
                    <img src={item.iconSrc} alt={`${item.name} logo`} className={item.logoClass} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Decision Engine */}
        <section id="decision" className="decision-band" data-aos="fade-up" data-aos-delay="250">
          <div className="decision-bg" aria-hidden="true">
            <div className="decision-particles">
              {decisionParticles.map((particle, index) => (
                <span
                  key={`decision-particle-${index}`}
                  className="decision-particle"
                  style={
                    {
                      '--px': `${particle.x}%`,
                      '--py': `${particle.y}%`,
                      '--ps': `${particle.size}px`,
                      '--pd': `${particle.dur}s`,
                      '--pdelay': `${particle.delay}s`,
                      '--pa': particle.alpha,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>
          <div className="container">
            <div className="decision-layout">
            <header className="decision-copy" data-reveal="up">
              <p className="eyebrow eyebrow-with-icon">
                <span className="eyebrow-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="M8 2.2c.3 1.7 1.6 3 3.3 3.3-1.7.3-3 1.6-3.3 3.3-.3-1.7-1.6-3-3.3-3.3 1.7-.3 3-1.6 3.3-3.3Zm4.4 6.3c.2.9.9 1.6 1.8 1.8-.9.2-1.6.9-1.8 1.8-.2-.9-.9-1.6-1.8-1.8.9-.2 1.6-.9 1.8-1.8Z" />
                  </svg>
                </span>
                Why teams switch to Coodra
              </p>
              <h2>Decisions that are fast, clear, and measurable.</h2>
              <p>
                Every recommendation includes confidence, reasoning, and expected impact so your team knows what to do next and why it matters.
              </p>
            </header>
            <div className="decision-stack-wrap">
              <div className="decision-stack display-cards-stack" aria-label="Decision rationale cards">
                <article className="display-card decision-layer-1 stack-1" aria-label="Clear rationale">
                  <header className="display-card-top">
                    <span className="display-icon">A</span>
                    <h3 className="display-title">Clear rationale</h3>
                  </header>
                  <p className="display-body">
                    See the data signals behind each recommendation.
                  </p>
                  <p className="display-date">No black-box outputs</p>
                </article>

                <article className="display-card decision-layer-2 stack-2" aria-label="Human approval">
                  <header className="display-card-top">
                    <span className="display-icon">B</span>
                    <h3 className="display-title">Human approval</h3>
                  </header>
                  <p className="display-body">
                    Your team stays in control before anything changes.
                  </p>
                  <p className="display-date">Always operator-approved</p>
                </article>

                <article className="display-card decision-layer-3 stack-3" aria-label="Measured outcomes">
                  <header className="display-card-top">
                    <span className="display-icon">C</span>
                    <h3 className="display-title">Measured outcomes</h3>
                  </header>
                  <p className="display-body">
                    Track what decisions improve sell-through, margin, and stock health.
                  </p>
                  <p className="display-date">Impact you can prove</p>
                </article>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Proof / Testimonials */}
        <section id="proof" className="proof testimonials-section container" data-aos="fade-up" data-aos-delay="300" data-reveal="up">
          <div className="testimonials-modern" data-reveal="up" aria-label="Customer outcomes">
            <div className="testimonials-modern-copy">
              <p className="eyebrow eyebrow-with-icon testimonials-modern-eyebrow">
                <span className="eyebrow-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="M8 2.2c.3 1.7 1.6 3 3.3 3.3-1.7.3-3 1.6-3.3 3.3-.3-1.7-1.6-3-3.3-3.3 1.7-.3 3-1.6 3.3-3.3Zm4.4 6.3c.2.9.9 1.6 1.8 1.8-.9.2-1.6.9-1.8 1.8-.2-.9-.9-1.6-1.8-1.8.9-.2 1.6-.9 1.8-1.8Z" />
                  </svg>
                </span>
                Trusted by retail operators
              </p>
              <h3>Loved by teams running real stores.</h3>
              <p className="testimonials-modern-sub">
                Don&apos;t just take our word for it. Here&apos;s how operators describe working with Coodra every week.
              </p>
              <div className="testimonials-dots" role="tablist" aria-label="Testimonial slides">
                {testimonials.map((item, idx) => (
                  <button
                    key={`dot-${item.initials}-${idx}`}
                    type="button"
                    className={`testimonials-dot${idx === activeTestimonial ? ' is-active' : ''}`}
                    aria-label={`Show testimonial ${idx + 1}`}
                    onClick={() => transitionToTestimonial(() => idx)}
                  />
                ))}
              </div>
            </div>

            <div className="testimonials-modern-stage">
              {testimonials.map((item, idx) => (
                <motion.article
                  key={`${item.initials}-${item.name}`}
                  className="testimonials-modern-card"
                  initial={false}
                  animate={(() => {
                    const deckIndex = (idx - activeTestimonial + testimonials.length) % testimonials.length
                    const visibleDepth = Math.min(deckIndex, testimonialDeckDepth - 1)
                    const isVisible = deckIndex < testimonialDeckDepth
                    const isOutgoing = outgoingTestimonial === idx && idx !== activeTestimonial

                    const xPositions = [0, 14, 28, 42]
                    const yPositions = [0, 10, 20, 30]
                    const scales = [1, 0.988, 0.976, 0.964]
                    const rotations = [0, 0.9, 1.7, 2.6]
                    const opacities = [1, 0.97, 0.92, 0.82]

                    if (isOutgoing) {
                      return {
                        opacity: [1, 0.96, 0.8],
                        x: [0, -12, 36],
                        y: [0, -10, 28],
                        scale: [1, 1.02, 0.96],
                        rotate: [0, -2.8, 7.4],
                      }
                    }

                    return {
                      opacity: isVisible ? opacities[visibleDepth] : 0,
                      x: isVisible ? xPositions[visibleDepth] : 58,
                      y: isVisible ? yPositions[visibleDepth] : 44,
                      scale: isVisible ? scales[visibleDepth] : 0.95,
                      rotate: isVisible ? rotations[visibleDepth] : 3.2,
                    }
                  })()}
                  transition={
                    outgoingTestimonial === idx && idx !== activeTestimonial
                      ? { duration: 0.84, ease: [0.22, 1, 0.36, 1], times: [0, 0.35, 1] }
                      : { duration: 0.78, ease: [0.22, 1, 0.36, 1] }
                  }
                  style={{
                    zIndex:
                      outgoingTestimonial === idx && idx !== activeTestimonial
                        ? testimonialDeckDepth + 3
                        : testimonialDeckDepth - ((idx - activeTestimonial + testimonials.length) % testimonials.length),
                    pointerEvents: idx === activeTestimonial ? 'auto' : 'none',
                  }}
                >
                  <div className="testimonials-modern-stars" aria-hidden="true">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <blockquote>&quot;{item.quote}&quot;</blockquote>
                  <div className="testimonials-modern-divider" />
                  <div className="testimonials-modern-author">
                    <span className="testimonials-modern-avatar">{item.initials}</span>
                    <div>
                      <p>{item.name}</p>
                      <small>{item.role}, {item.company}</small>
                    </div>
                  </div>
                </motion.article>
              ))}
              <div className="testimonials-modern-deco deco-a" aria-hidden="true" />
              <div className="testimonials-modern-deco deco-b" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          ref={ctaCardRef}
          className="cta container surface-contrast"
          data-aos="fade-up"
          data-aos-delay="350"
          data-reveal="up"
          onMouseMove={handleCtaPointerMove}
          onMouseEnter={handleCtaPointerEnter}
          onMouseLeave={handleCtaPointerLeave}
        >
          <div className="cta-shadow-overlay" aria-hidden="true" />
          <div className="cta-noise-overlay" aria-hidden="true" />
          <h2>Ready to make better retail decisions this week?</h2>
          <p>Connect your data, review AI-ranked actions, and approve your first decision in minutes.</p>
          <div className="cta-actions">
            <Link to="/signup" className="btn btn-primary">Start Free</Link>
            <Link to="/pricing" className="btn btn-secondary">View Pricing</Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}








