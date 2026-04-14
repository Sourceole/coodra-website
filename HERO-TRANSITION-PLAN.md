# Hero Transition Animation — coodra-website

## Concept

An airplane flies across the screen through the hero text "Your store, on autopilot." — words dissolve in the plane's wake, smoke trails behind it. When the plane exits, the smoke settles, then the real hero section rises out of it. One time on page load.

## Animation Timeline

| Time | Event |
|---|---|
| 0ms | Page loads, plane enters from left edge, off-screen |
| 400ms | Plane visible, crossing left-to-right |
| 1200ms | Plane reaches first word "Your" — word begins dissolving |
| 1600ms | Plane reaches "store," — word dissolves |
| 2000ms | Plane reaches "on" — word dissolves |
| 2400ms | Plane reaches "autopilot." — word dissolves |
| 3000ms | Plane exits right edge |
| 3000–4500ms | Smoke trail lingers and settles (gravity drift, soft dissipation) |
| 4500ms | Smoke clears to 20% opacity, begins lifting upward |
| 5500ms | New hero content fades in from below (0px → final position) |
| 6500ms | Transition complete, plane scene unmounts |

Total duration: ~6.5 seconds

---

## Technical Architecture

### Stack
- **React Three Fiber** (`@react-three/fiber`) — Three.js in React
- **@react-three/drei** — helpers (useTexture, etc.)
- **Three.js** — plane geometry, particle system, shaders
- **GSAP** — timeline sequencing for non-Three.js elements (text fades, page reveal)
- **Existing Vite + React Router v7 setup** — no conflicts

### File Structure
```
src/
  components/
    HeroTransition/
      PlaneScene.tsx          # Three.js scene — plane, path, smoke
      PlaneModel.tsx          # Plane geometry (built from primitives, no .glb needed)
      SmokeTrail.tsx          # Particle system for smoke
      useFlightPath.ts        # CatmullRomCurve3 path + animation hook
      HeroTransitionScene.tsx # Full R3F canvas wrapper
    HeroLanding/
      HeroSection.tsx         # The actual hero section (revealed after transition)
      HeroText.tsx            # Animated text elements that sync with plane
  pages/
    LandingPage.tsx           # Assembles everything, manages transition state
```

---

## Key Components

### 1. `useFlightPath` — Plane flight animation

```ts
// Creates a curved path: enter left-low → arc up through center → exit right-low
const path = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-2, 0.5, 0),     // off-screen left, slightly below center
  new THREE.Vector3(-1, 1.2, 0),     // left-center, elevated
  new THREE.Vector3(0, 1.5, 0),      // center, peak height
  new THREE.Vector3(1, 1.2, 0),      // right-center, descending
  new THREE.Vector3(2, 0.5, 0),     // off-screen right
])
```

Plane follows this path. Camera tracks it. At path positions 0.0–0.35, text words are visible. At 0.35–0.65, words dissolve as plane passes through their X coordinate zone. After 0.65, text fully gone.

### 2. `PlaneModel.tsx`

Built from Three.js primitives — no external .glb dependency:
- Fuselage: `CylinderGeometry` rotated horizontal
- Wings: `BoxGeometry` scaled flat
- Tail: `BoxGeometry` angled
- Engine glow: small `PointLight` or emissive sphere at front

Style: Clean line-art / low-poly. White or very light gray with subtle shadow. Fits light theme. Not cartoon, not realistic — somewhere between architectural model and icon.

### 3. `SmokeTrail.tsx`

Particle system using `Points` with `PointsMaterial`:
- 80–120 particles emitting from plane's rear position
- Each particle: slow velocity drift, slight upward float, fade to 0 opacity over 2s
- Color: white / warm gray `#e8e6e3`
- Blending: `NormalBlending` with soft falloff
- As plane moves, new particles spawn, old ones age out

### 4. `HeroText.tsx`

Three.js-compatible text or HTML overlay synced to plane position:
- Four word groups: "Your", "store,", "on", "autopilot."
- Positioned in a row, centered
- Each word has a dissolve trigger — triggered when plane's path progress crosses that word's X coordinate
- Dissolve effect: opacity fade + slight blur + scale up (0.9 → 1.0 for remaining characters flying apart)
- Font: same as landing page hero text

### 5. `HeroTransitionScene.tsx`

Full R3F canvas. No orbit controls. Fixed camera. Scene contains:
- PlaneModel (animated along path)
- SmokeTrail (linked to plane position)
- HeroText (HTML overlay, not 3D text — cleaner and more readable)
- Subtle ambient light (no harsh shadows)

### 6. `HeroSection.tsx` (the real hero)

The actual landing page hero content — hero copy, CTA buttons, particle grid animation that already exists. This component mounts with `opacity: 0, translateY: 40px` and animates to `opacity: 1, translateY: 0` once the smoke transition is complete. Triggered by a state flag `transitionComplete`.

---

## State Machine

```
LOADING → ANIMATING → REVEALING → COMPLETE
```

```ts
type TransitionState = 'LOADING' | 'ANIMATING' | 'REVEALING' | 'COMPLETE'
```

- `LOADING`: R3F scene initializing
- `ANIMATING`: Plane is flying, text dissolving
- `REVEALING`: Smoke settling, HeroSection fading in
- `COMPLETE`: PlaneScene unmounted, HeroSection fully visible

State lives in `LandingPage.tsx`. `HeroTransitionScene` receives a `onComplete` callback.

---

## Props Interface

```tsx
// HeroTransitionScene receives:
interface HeroTransitionSceneProps {
  onComplete: () => void   // called when transition is done
}
```

---

## Smoke Behavior (Detailed)

**During flight (0–3000ms):**
- Particles emit from plane rear with slight random velocity spread
- Drift direction: opposite of plane movement + upward bias
- Opacity: starts at 0.6, fades to 0 over 1.5s
- Particles scale: start at 0.3, grow to 0.8 as they age

**After flight (3000–4500ms):**
- Emission stops
- Existing particles continue drifting, slowly gathering downward
- Overall opacity drops from current → 30%

**Reveal phase (4500ms+):**
- Particles lift upward (negative Y velocity)
- Opacity drops to near-zero
- At 5500ms, canvas opacity → 0 and unmounts

---

## Performance Considerations

- Particle count: 100 max. Reuse particles by resetting position/opacity rather than creating new.
- No post-processing effects (no bloom, no DOF). Light theme + flat design doesn't need it.
- `frameloop="demand"` — only renders when needed.
- Plane path uses `CatmullRomCurve3.getPointAt(t)` — no per-frame interpolation cost.
- Smoke particles use `BufferGeometry` with typed arrays — minimal GC pressure.

---

## Notes

- **No .glb models** — plane built from primitives. Avoids CDN dependency and lets us control exact style.
- **HTML text over 3D text** — The words "Your store, on autopilot." are HTML elements positioned over the canvas, not Three.js text geometry. Cleaner, easier to style, no font loading issues in 3D context.
- **Camera is static** — doesn't follow the plane. Just provides the stage. Plane moves through the fixed frame.
- **Landing page only** — this transition only runs on `/`. It does not run on repeat visits (use session storage to track whether it has already played).

---

## Dependencies to Add

```
npm install three @react-three/fiber @react-three/drei gsap
```

Existing Three.js packages are already installed per the plan context.

---

## Implementation Order

1. **`useFlightPath`** — Define the path, get plane moving on it
2. **`PlaneModel`** — Build the plane geometry, get it flying
3. **`SmokeTrail`** — Add particles, link to plane position
4. **`HeroText`** — Build text elements, hook dissolution to path progress
5. **`HeroTransitionScene`** — Assemble R3F canvas with all pieces
6. **`HeroSection`** — Build the real hero (existing content + reveal animation)
7. **`LandingPage`** — Wire state machine: LOADING → ANIMATING → REVEALING → COMPLETE
8. **Polish** — Timing adjustments, particle count tuning, smoke opacity curves

---

## Smoke Trail Color & Style

Light theme:
- Smoke: `rgba(232, 230, 227, 0.5)` — warm off-white
- Particles: circular, soft edge (no hard dots)
- Background of scene: transparent (canvas sits over page background)
- Smoke should feel like vapor, not fire — soft, diffuse, slow