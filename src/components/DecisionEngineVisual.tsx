import { Suspense, lazy, useEffect, useMemo, useState } from 'react'

type Mode = 'mobile' | 'tablet' | 'desktop'

const DecisionEngineVisualScene = lazy(() => import('./DecisionEngineVisualScene'))

function getMode(width: number): Mode {
  if (width < 768) return 'mobile'
  if (width <= 1024) return 'tablet'
  return 'desktop'
}

function StaticFallbackSvg() {
  return (
    <svg viewBox="0 0 520 520" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="glassFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.46)" />
          <stop offset="100%" stopColor="rgba(228,245,243,0.2)" />
        </linearGradient>
        <radialGradient id="haloFill" cx="52%" cy="45%" r="58%">
          <stop offset="0%" stopColor="rgba(213,242,239,0.38)" />
          <stop offset="100%" stopColor="rgba(213,242,239,0)" />
        </radialGradient>
      </defs>
      <circle cx="270" cy="230" r="124" fill="url(#haloFill)" />
      <rect x="220" y="166" width="56" height="210" rx="18" fill="url(#glassFill)" stroke="rgba(190,224,220,0.65)" />
      <rect x="292" y="132" width="62" height="244" rx="20" fill="url(#glassFill)" stroke="rgba(190,224,220,0.75)" />
      <circle cx="252" cy="196" r="4.5" fill="rgba(255,255,255,0.74)" />
      <circle cx="252" cy="238" r="3.8" fill="rgba(255,255,255,0.6)" />
      <circle cx="252" cy="282" r="4.1" fill="rgba(255,255,255,0.72)" />
      <circle cx="323" cy="176" r="4.2" fill="rgba(255,255,255,0.72)" />
      <circle cx="323" cy="216" r="3.7" fill="rgba(255,255,255,0.58)" />
      <circle cx="323" cy="258" r="4.3" fill="rgba(255,255,255,0.74)" />
      <path d="M338 188 C 388 192, 420 180, 458 156" fill="none" stroke="rgba(204,234,230,0.65)" strokeWidth="8" strokeLinecap="round" />
      <circle cx="430" cy="167" r="7.5" fill="rgba(255,255,255,0.86)" />
    </svg>
  )
}

export default function DecisionEngineVisual() {
  const [mode, setMode] = useState<Mode>(() => getMode(window.innerWidth))
  const [reduceMotion, setReduceMotion] = useState<boolean>(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  // A11Y
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const onResize = () => setMode(getMode(window.innerWidth))
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const showCanvas = mode !== 'mobile'
  const sceneProps = useMemo(
    () => ({
      reducedMotion: reduceMotion,
    }),
    [reduceMotion]
  )

  return (
    <div
      role="img"
      aria-label="Animation showing store data refracted through Coodra Decision Engine into ranked retail actions"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'visible',
        borderRadius: 0,
        background: 'transparent',
      }}
    >
      {showCanvas ? (
        <Suspense fallback={<StaticFallbackSvg />}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 0,
              overflow: 'visible',
            }}
          >
            <DecisionEngineVisualScene {...sceneProps} />
          </div>
        </Suspense>
      ) : (
        <StaticFallbackSvg />
      )}
    </div>
  )
}
