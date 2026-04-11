import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

type Props = {
  reducedMotion: boolean
}

const GLASS = '#f2f8f7'
const EDGE = '#d7ebe8'
const WHITE = '#ffffff'

function CoreLogo({ reducedMotion }: { reducedMotion: boolean }) {
  const texture = useTexture('/images/logo.png')
  const logoRef = useRef<THREE.Sprite>(null!)
  const haloRef = useRef<THREE.Mesh>(null!)
  const glintRef = useRef<THREE.Mesh>(null!)

  texture.colorSpace = THREE.SRGBColorSpace
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearMipMapLinearFilter

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = reducedMotion ? 1 : 1 + Math.sin(t * 1.1) * 0.035
    const drift = reducedMotion ? 0 : Math.sin(t * 0.6) * 0.03

    haloRef.current.scale.setScalar(0.96 * pulse)
    logoRef.current.position.y = drift

    const glintX = reducedMotion ? 0.08 : Math.sin(t * 0.75) * 0.22
    glintRef.current.position.set(glintX, 0.04 + drift, 0.13)
  })

  return (
    <group position={[0.1, 0.02, 0]}>
      <mesh ref={haloRef} position={[0, 0.04, -0.14]}>
        <circleGeometry args={[0.92, 64]} />
        <meshBasicMaterial color={EDGE} transparent opacity={0.09} />
      </mesh>

      <mesh position={[0, 0.02, -0.04]}>
        <circleGeometry args={[0.68, 64]} />
        <meshBasicMaterial color={EDGE} transparent opacity={0.12} />
      </mesh>

      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[1.06, 1.06]} />
        <meshPhysicalMaterial
          color={GLASS}
          transparent
          opacity={0.24}
          roughness={0.08}
          metalness={0}
          transmission={0.78}
          thickness={0.45}
          ior={1.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      <sprite ref={logoRef} scale={[0.62, 0.62, 1]} position={[0, 0, 0.1]}>
        <spriteMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
      </sprite>

      <mesh ref={glintRef}>
        <sphereGeometry args={[0.032, 16, 16]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.7} />
      </mesh>

      <pointLight color={WHITE} intensity={0.6} distance={2.2} position={[0.2, 0.28, 1.2]} />
      <pointLight color="#d5efea" intensity={0.4} distance={2.1} position={[-0.34, -0.22, 1.0]} />
    </group>
  )
}

function OutputBeam({ reducedMotion }: { reducedMotion: boolean }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.45, 0.36, 0.02),
        new THREE.Vector3(1.02, 0.58, 0.09),
        new THREE.Vector3(1.58, 0.55, 0.14),
      ]),
    []
  )
  const orbRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const p = reducedMotion ? 0.64 : (Math.sin(clock.getElapsedTime() * 0.72) * 0.5 + 0.5) * 0.8 + 0.12
    const point = curve.getPointAt(THREE.MathUtils.clamp(p, 0.03, 0.98))
    orbRef.current.position.copy(point)
    glowRef.current.position.copy(point)
  })

  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 64, 0.014, 8, false]} />
        <meshBasicMaterial color={EDGE} transparent opacity={0.32} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.11, 14, 14]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.17} />
      </mesh>
      <mesh ref={orbRef}>
        <sphereGeometry args={[0.026, 14, 14]} />
        <meshBasicMaterial color={WHITE} />
      </mesh>
    </>
  )
}

function Scene({ reducedMotion }: Props) {
  return (
    <group>
      <ambientLight intensity={0.74} />
      <directionalLight position={[-2.4, 2.0, 2.4]} intensity={0.4} />
      <pointLight position={[0.4, 0.48, 1.8]} intensity={0.58} color={WHITE} />

      <CoreLogo reducedMotion={reducedMotion} />
      <OutputBeam reducedMotion={reducedMotion} />
    </group>
  )
}

export default function DecisionEngineVisualScene(props: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.8], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
      frameloop={props.reducedMotion ? 'never' : 'always'}
      style={{ position: 'absolute', inset: 0, background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
  )
}
