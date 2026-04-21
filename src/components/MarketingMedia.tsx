import { useEffect, useRef, useState } from 'react'
import './MarketingMedia.css'

type MarketingMediaProps = {
  className?: string
  alt: string
  posterPng: string
  posterWebp?: string
  videoMp4?: string
  videoWebm?: string
  objectPosition?: string
  priority?: boolean
}

export default function MarketingMedia({
  className = '',
  alt,
  posterPng,
  posterWebp,
  videoMp4,
  videoWebm,
  objectPosition = 'center',
  priority = false,
}: MarketingMediaProps) {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const [isNearViewport, setIsNearViewport] = useState(priority)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReduceMotion(mediaQuery.matches)
    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (priority || isNearViewport) return
    const node = frameRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNearViewport(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '320px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [priority, isNearViewport])

  const shouldRenderVideo = isNearViewport && !reduceMotion && (videoMp4 || videoWebm)

  return (
    <div ref={frameRef} className={`marketing-media ${className}`}>
      {posterWebp ? (
        <picture>
          <source srcSet={posterWebp} type="image/webp" />
          <img
            src={posterPng}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            style={{ objectPosition }}
          />
        </picture>
      ) : (
        <img
          src={posterPng}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{ objectPosition }}
        />
      )}

      {shouldRenderVideo ? (
        <video
          className="marketing-media-video"
          poster={posterPng}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          style={{ objectPosition }}
        >
          {videoWebm ? <source src={videoWebm} type="video/webm" /> : null}
          {videoMp4 ? <source src={videoMp4} type="video/mp4" /> : null}
        </video>
      ) : null}
    </div>
  )
}

