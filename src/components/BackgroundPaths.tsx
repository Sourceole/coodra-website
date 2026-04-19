import { motion, useReducedMotion } from 'framer-motion'

function FloatingPaths({ position }: { position: number }) {
  const reduceMotion = useReducedMotion()
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    opacity: 0.08 + i * 0.017,
    width: 0.45 + i * 0.03,
    duration: 18 + (i % 12) * 0.9,
    delay: i * 0.08,
  }))

  return (
    <div className="integrations-paths-track" aria-hidden="true">
      <svg className="integrations-bg-svg" viewBox="0 0 696 316" fill="none" preserveAspectRatio="none">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            className="integrations-bg-path"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={
              reduceMotion
                ? { pathLength: 1, opacity: path.opacity, pathOffset: 0 }
                : {
                    pathLength: 1,
                    opacity: [0.3, 0.6, 0.3],
                    pathOffset: [0, 1, 0],
                  }
            }
            transition={{
              duration: path.duration,
              delay: path.delay,
              repeat: reduceMotion ? 0 : Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export default function BackgroundPaths() {
  return (
    <div className="integrations-background-paths" aria-hidden="true">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  )
}
