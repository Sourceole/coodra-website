import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// ── HELPERS ────────────────────────────────────────────────
function rRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ── DASHBOARD CANVAS ───────────────────────────────────────
function buildDashboardCanvas(): HTMLCanvasElement {
  const cvs = document.createElement('canvas')
  cvs.width = 1200
  cvs.height = 775
  const ctx = cvs.getContext('2d')!

  ctx.fillStyle = '#0B1220'
  ctx.fillRect(0, 0, 1200, 775)

  const g1 = ctx.createRadialGradient(180, 0, 0, 180, 0, 520)
  g1.addColorStop(0, 'rgba(10,42,107,.5)')
  g1.addColorStop(1, 'rgba(10,42,107,0)')
  ctx.fillStyle = g1
  ctx.fillRect(0, 0, 1200, 775)

  const g2 = ctx.createRadialGradient(1000, 0, 0, 1000, 0, 460)
  g2.addColorStop(0, 'rgba(14,124,123,.42)')
  g2.addColorStop(1, 'rgba(14,124,123,0)')
  ctx.fillStyle = g2
  ctx.fillRect(0, 0, 1200, 775)

  // ── SIDEBAR (247px) ─────────────────────────────────
  ctx.fillStyle = '#121b27'
  ctx.fillRect(0, 0, 247, 775)
  ctx.fillStyle = '#1F2A3D'
  ctx.fillRect(246, 0, 1, 775)

  ctx.fillStyle = 'rgba(255,255,255,.03)'
  rRect(ctx, 8, 8, 231, 48, 12)
  ctx.fill()
  ctx.strokeStyle = 'rgba(46,211,183,.28)'
  ctx.lineWidth = 1
  rRect(ctx, 8, 8, 231, 48, 12)
  ctx.stroke()

  ctx.fillStyle = 'rgba(46,211,183,.9)'
  ctx.beginPath()
  ctx.moveTo(30, 24); ctx.lineTo(37, 31); ctx.lineTo(30, 38); ctx.lineTo(23, 31)
  ctx.closePath(); ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = '600 18px sans-serif'
  ctx.letterSpacing = '0.04em'
  ctx.fillText('Coodra', 48, 38)

  ctx.fillStyle = '#6B7280'
  ctx.font = 'bold 9px sans-serif'
  ctx.letterSpacing = '0.12em'
  ctx.fillText('WORKSPACE', 14, 80)

  const navItems = [
    { icon: '◈', label: 'Dashboard', active: true },
    { icon: '◆', label: 'Recommendations' },
    { icon: '◉', label: 'Inventory' },
    { icon: '◎', label: 'Performance' },
    { icon: '◌', label: 'Distributor' },
  ]
  let ny = 94
  navItems.forEach((item) => {
    if (item.active) {
      ctx.fillStyle = 'rgba(46,211,183,.12)'
      rRect(ctx, 8, ny, 231, 40, 10)
      ctx.fill()
      ctx.fillStyle = '#2ED3B7'
      ctx.fillRect(8, ny + 8, 3, 24)
    } else {
      ctx.fillStyle = 'rgba(255,255,255,.025)'
      rRect(ctx, 8, ny, 231, 40, 10)
      ctx.fill()
    }
    ctx.fillStyle = item.active ? '#ffffff' : '#A0AEC0'
    ctx.font = '500 11px sans-serif'
    ctx.fillText(item.icon, 20, ny + 24)
    ctx.fillText(item.label, 40, ny + 24)
    ny += 48
  })

  ctx.fillStyle = '#1F2A3D'
  ctx.fillRect(8, ny + 6, 231, 1)

  ctx.fillStyle = '#6B7280'
  ctx.font = 'bold 9px sans-serif'
  ctx.letterSpacing = '0.10em'
  ctx.fillText('RECENT', 14, ny + 22)

  const recents = [
    { t: 'Reorder Royal Canin S/O', m: '2 min ago' },
    { t: 'Margin check on\u51e0', m: '18 min ago' },
    { t: 'Stock alert: SKU #4412', m: '1 hr ago' },
  ]
  let ry = ny + 32
  recents.forEach((r) => {
    ctx.fillStyle = 'rgba(255,255,255,.03)'
    rRect(ctx, 8, ry, 231, 44, 10)
    ctx.fill()
    ctx.fillStyle = '#F5F7FA'
    ctx.font = '500 11px sans-serif'
    ctx.fillText(r.t, 16, ry + 19)
    ctx.fillStyle = '#6B7280'
    ctx.font = '10px sans-serif'
    ctx.fillText(r.m, 16, ry + 33)
    ry += 52
  })

  const ay = 704
  ctx.fillStyle = 'rgba(255,255,255,.03)'
  rRect(ctx, 8, ay, 231, 50, 12)
  ctx.fill()
  ctx.strokeStyle = 'rgba(46,211,183,.18)'
  ctx.lineWidth = 1
  rRect(ctx, 8, ay, 231, 50, 12)
  ctx.stroke()

  ctx.fillStyle = 'rgba(255,255,255,.08)'
  ctx.beginPath()
  ctx.arc(30, ay + 25, 15, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 11px sans-serif'
  ctx.fillText('MJ', 25, ay + 30)

  ctx.fillStyle = '#F5F7FA'
  ctx.font = '600 11px sans-serif'
  ctx.fillText('Marcus Jewelry', 54, ay + 20)
  ctx.fillStyle = '#6B7280'
  ctx.font = '10px sans-serif'
  ctx.fillText('marcus@jewelry.com', 54, ay + 34)

  // MAIN AREA
  ctx.fillStyle = '#141a22'
  ctx.fillRect(247, 0, 953, 775)

  ctx.fillStyle = '#0F172A'
  ctx.fillRect(247, 0, 953, 54)

  ctx.fillStyle = 'rgba(46,211,183,.12)'
  rRect(ctx, 264, 12, 84, 22, 11)
  ctx.fill()
  ctx.strokeStyle = 'rgba(46,211,183,.35)'
  ctx.lineWidth = 1
  rRect(ctx, 264, 12, 84, 22, 11)
  ctx.stroke()
  ctx.fillStyle = '#2ED3B7'
  ctx.font = 'bold 9px sans-serif'
  ctx.letterSpacing = '0.08em'
  ctx.fillText('\u25cf LIVE', 278, 27)

  let px = 364
  ;['3 Recommendations', '2 Alerts', '1 Decision'].forEach((p) => {
    ctx.fillStyle = 'rgba(255,255,255,.055)'
    rRect(ctx, px, 12, 106, 22, 11)
    ctx.fill()
    ctx.fillStyle = '#A0AEC0'
    ctx.font = 'bold 9px sans-serif'
    ctx.fillText(p, px + 9, 27)
    px += 116
  })

  ctx.fillStyle = 'rgba(239,68,68,.12)'
  rRect(ctx, 814, 12, 116, 22, 11)
  ctx.fill()
  ctx.strokeStyle = 'rgba(239,68,68,.35)'
  ctx.lineWidth = 1
  rRect(ctx, 814, 12, 116, 22, 11)
  ctx.stroke()
  ctx.fillStyle = '#EF4444'
  ctx.font = 'bold 9px sans-serif'
  ctx.fillText('\u25b2 2 LOW STOCK', 824, 27)

  ctx.fillStyle = '#A0AEC0'
  ctx.font = '600 26px sans-serif'
  ctx.fillText('What would you like to do today?', 264, 162)

  ctx.fillStyle = '#6B7280'
  ctx.font = '12px sans-serif'
  ctx.fillText('Ask about inventory, reorder, margin, or anything else.', 264, 194)

  const quick = ['Check stock health', 'Reorder suggestions', 'Review margins', 'View alerts']
  let qx = 264
  quick.forEach((p) => {
    ctx.fillStyle = 'rgba(255,255,255,.04)'
    rRect(ctx, qx, 220, 118, 30, 15)
    ctx.fill()
    ctx.strokeStyle = 'rgba(46,211,183,.28)'
    ctx.lineWidth = 1
    rRect(ctx, qx, 220, 118, 30, 15)
    ctx.stroke()
    ctx.fillStyle = '#F5F7FA'
    ctx.font = '500 11px sans-serif'
    ctx.fillText(p, qx + 10, 238)
    qx += 128
  })

  const recY = 288
  ctx.fillStyle = '#1F2A3D'
  ctx.fillRect(247, recY, 953, 380)

  ctx.fillStyle = '#F5F7FA'
  ctx.font = '600 15px sans-serif'
  ctx.fillText('Active Recommendations', 264, recY + 18)

  ctx.fillStyle = 'rgba(46,211,183,.15)'
  rRect(ctx, 264, recY + 30, 96, 20, 10)
  ctx.fill()
  ctx.fillStyle = '#2ED3B7'
  ctx.font = 'bold 10px sans-serif'
  ctx.fillText('RECOMMEND', 274, recY + 44)

  ctx.fillStyle = '#6B7280'
  ctx.font = '9px sans-serif'
  ctx.fillText('High confidence', 370, recY + 44)

  const c1y = recY + 62
  ctx.fillStyle = 'rgba(255,255,255,.04)'
  rRect(ctx, 264, c1y, 460, 74, 12)
  ctx.fill()
  ctx.strokeStyle = 'rgba(46,211,183,.15)'
  ctx.lineWidth = 1
  rRect(ctx, 264, c1y, 460, 74, 12)
  ctx.stroke()

  ctx.fillStyle = '#F5F7FA'
  ctx.font = '600 13px sans-serif'
  ctx.fillText('Royal Canin S/O \u2014 14 units left', 278, c1y + 25)
  ctx.fillStyle = '#6B7280'
  ctx.font = '11px sans-serif'
  ctx.fillText('Confidence: 94%  \u00b7  Impact: +$240 margin', 278, c1y + 44)

  ctx.fillStyle = '#2ED3B7'
  rRect(ctx, 278, c1y + 54, 74, 24, 8)
  ctx.fill()
  ctx.fillStyle = '#0B1220'
  ctx.font = 'bold 10px sans-serif'
  ctx.fillText('Approve', 294, c1y + 70)

  ctx.fillStyle = 'rgba(100,116,139,.15)'
  rRect(ctx, 360, c1y + 54, 64, 24, 8)
  ctx.fill()
  ctx.fillStyle = '#6B7280'
  ctx.font = '10px sans-serif'
  ctx.fillText('Dismiss', 372, c1y + 70)

  const c2y = c1y + 92
  ctx.fillStyle = 'rgba(255,255,255,.04)'
  rRect(ctx, 264, c2y, 460, 74, 12)
  ctx.fill()
  ctx.strokeStyle = 'rgba(245,158,11,.18)'
  ctx.lineWidth = 1
  rRect(ctx, 264, c2y, 460, 74, 12)
  ctx.stroke()

  ctx.fillStyle = '#F5F7FA'
  ctx.font = '600 13px sans-serif'
  ctx.fillText('Clearance: Polo Ralph kids \u2014 slow mover', 278, c2y + 25)
  ctx.fillStyle = '#6B7280'
  ctx.font = '11px sans-serif'
  ctx.fillText('Confidence: 87%  \u00b7  Impact: +$180 freed cash', 278, c2y + 44)

  ctx.fillStyle = 'rgba(245,158,11,.2)'
  rRect(ctx, 278, c2y + 54, 74, 24, 8)
  ctx.fill()
  ctx.fillStyle = '#F59E0B'
  ctx.font = 'bold 10px sans-serif'
  ctx.fillText('Reduce', 294, c2y + 70)

  ctx.fillStyle = 'rgba(100,116,139,.15)'
  rRect(ctx, 360, c2y + 54, 64, 24, 8)
  ctx.fill()
  ctx.fillStyle = '#6B7280'
  ctx.font = '10px sans-serif'
  ctx.fillText('Dismiss', 372, c2y + 70)

  const compY = 702
  ctx.fillStyle = 'rgba(255,255,255,.04)'
  rRect(ctx, 247, compY, 953, 54, 12)
  ctx.fill()
  ctx.strokeStyle = 'rgba(46,211,183,.28)'
  ctx.lineWidth = 1
  rRect(ctx, 247, compY, 953, 54, 12)
  ctx.stroke()

  ctx.fillStyle = 'rgba(255,255,255,.07)'
  rRect(ctx, 264, compY + 8, 752, 38, 10)
  ctx.fill()
  ctx.fillStyle = '#6B7280'
  ctx.font = '12px sans-serif'
  ctx.fillText('Ask Coodra anything about your store\u2026', 282, compY + 30)

  ctx.fillStyle = 'rgba(46,211,183,.22)'
  rRect(ctx, 1028, compY + 8, 78, 38, 10)
  ctx.fill()
  ctx.strokeStyle = 'rgba(46,211,183,.44)'
  ctx.lineWidth = 1
  rRect(ctx, 1028, compY + 8, 78, 38, 10)
  ctx.stroke()
  ctx.fillStyle = '#2ED3B7'
  ctx.font = 'bold 11px sans-serif'
  ctx.fillText('Send', 1048, compY + 30)

  return cvs
}

// ── MONITOR GROUP ──────────────────────────────────────────
function MonitorGroup({
  mouseX,
  mouseY,
}: {
  mouseX: React.MutableRefObject<number>
  mouseY: React.MutableRefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const tickRef = useRef(0)

  // Card: 75% section width → 7.2 units wide, 4.65 tall (1200×775 ratio)
  const CW = 7.2
  const CH = 4.65

  const dashTex = useMemo(() => {
    const t = new THREE.CanvasTexture(buildDashboardCanvas())
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    return t
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    const t = Date.now() * 0.001
    tickRef.current++

    groupRef.current.position.y = Math.sin(t * 0.4) * 0.15

    const mx = mouseX.current
    const my = mouseY.current
    groupRef.current.rotation.y += (mx * 0.14 - groupRef.current.rotation.y) * 0.05
    groupRef.current.rotation.x += (-my * 0.05 - groupRef.current.rotation.x) * 0.05

    if (tickRef.current % 30 === 0) {
      dashTex.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} rotation={[-0.03, 0.14, 0.01]}>
      {/* Dark back slab for monitor depth */}
      <mesh position={[0, 0, -0.4]}>
        <boxGeometry args={[CW + 0.3, CH + 0.3, 0.6]} />
        <meshStandardMaterial color="#07101d" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Rounded screen card — drei RoundedBox handles corners properly */}
      <RoundedBox
        args={[CW, CH, 0.04]}
        radius={0.22}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          map={dashTex}
          transparent={false}
          roughness={0}
          metalness={0}
        />
      </RoundedBox>

      {/* Teal outer glow */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[CW + 0.5, CH + 0.5]} />
        <meshStandardMaterial
          color="#2ED3B7"
          transparent
          opacity={0.06}
          roughness={0}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

// ── PARTICLES ──────────────────────────────────────────────
function FloatingParticles() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(50 * 3)
    for (let i = 0; i < 50; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1
    }
    return arr
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const t = Date.now() * 0.001
    ref.current.rotation.y = t * 0.01
    ref.current.position.y = Math.sin(t * 0.07) * 0.15
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#2ED3B7" size={0.025} transparent opacity={0.25} sizeAttenuation />
    </points>
  )
}

// ── GRID FLOOR ─────────────────────────────────────────────
function GridFloor() {
  const ref = useRef<THREE.GridHelper>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.material.opacity = 0.025
      ref.current.material.transparent = true
    }
  }, [])
  return <gridHelper ref={ref} args={[80, 80, 0x0B1220, 0x0B1220]} position={[0, -7, 0]} />
}

// ── CAMERA CONTROLLER ─────────────────────────────────────
function CameraController({ scrollFrac }: { scrollFrac: React.MutableRefObject<number> }) {
  const { camera } = useThree()
  useFrame(() => {
    const targetZ = 10 + scrollFrac.current * 2
    camera.position.z += (targetZ - camera.position.z) * 0.05
  })
  return null
}

// ── MAIN EXPORT ────────────────────────────────────────────
export default function HeroThreeScene() {
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const scrollFrac = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 1.5
      mouseY.current = (e.clientY / window.innerHeight - 0.5) * 0.8
    }
    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      scrollFrac.current = Math.min(window.scrollY / maxScroll, 1)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 0, 9], fov: 48 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.0} />
        <directionalLight position={[-5, 2, 3]} intensity={0.4} color="#2ED3B7" />
        <fog attach="fog" args={['#EFF3F8', 20, 60]} />

        <MonitorGroup mouseX={mouseX} mouseY={mouseY} />
        <FloatingParticles />
        <GridFloor />
        <CameraController scrollFrac={scrollFrac} />
      </Canvas>
    </div>
  )
}
