'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Stars } from '@react-three/drei'
import * as THREE from 'three'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// ─── Sunrise / dusk sky gradient sphere ──────────────────────────────────────
function SkySphere() {
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[90, 32, 16]} />
      <meshBasicMaterial
        color="#0B1E3D"
        side={THREE.BackSide}
      />
    </mesh>
  )
}

// ─── Horizon glow — warm Dubai dusk ──────────────────────────────────────────
function HorizonGlow() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.38 + 0.04 * Math.sin(clock.elapsedTime * 0.25)
    }
  })
  return (
    <mesh ref={ref} position={[0, -1, -28]}>
      <planeGeometry args={[120, 14]} />
      <meshBasicMaterial
        color="#C2500A"
        transparent
        opacity={0.38}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// ─── Dubai Marina water ───────────────────────────────────────────────────────
function Water() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.06 + 0.03 * Math.sin(clock.elapsedTime * 0.6)
  })
  return (
    <mesh ref={ref} position={[0, -4.05, -5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[60, 18]} />
      <meshStandardMaterial
        color="#061428"
        emissive="#1a4a7a"
        emissiveIntensity={0.06}
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

// ─── Desert sand ground ───────────────────────────────────────────────────────
function Ground() {
  return (
    <>
      <mesh position={[0, -4.08, -22]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 40]} />
        <meshStandardMaterial color="#1a0e05" roughness={1} metalness={0} />
      </mesh>
      {/* subtle sand warmth strip near horizon */}
      <mesh position={[0, -3.6, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 8]} />
        <meshBasicMaterial color="#3D1F08" transparent opacity={0.4} depthWrite={false} />
      </mesh>
    </>
  )
}

// ─── Individual building ──────────────────────────────────────────────────────
type BldgProps = {
  x: number; z: number; height: number; width: number; depth: number
  windowColor: string; baseColor: string; emissiveIntensity: number
}

function Building({ x, z, height, width, depth, windowColor, baseColor, emissiveIntensity }: BldgProps) {
  return (
    <mesh position={[x, height / 2 - 4, z]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color={baseColor}
        emissive={windowColor}
        emissiveIntensity={emissiveIntensity}
        roughness={0.5}
        metalness={0.6}
      />
    </mesh>
  )
}

// ─── Burj Khalifa ─────────────────────────────────────────────────────────────
function BurjKhalifa() {
  const spireRef = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    if (spireRef.current) {
      spireRef.current.intensity = 6 + 4 * Math.sin(clock.elapsedTime * 1.2)
    }
  })
  return (
    <group position={[0, -4, -24]}>
      {/* Wide base */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.1, 3, 1.1]} />
        <meshStandardMaterial color="#0D0D1A" emissive="#C2500A" emissiveIntensity={0.06} metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Step 1 */}
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[0.75, 4, 0.75]} />
        <meshStandardMaterial color="#0A0A18" emissive="#D4A017" emissiveIntensity={0.08} metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Step 2 */}
      <mesh position={[0, 8.5, 0]}>
        <boxGeometry args={[0.52, 5, 0.52]} />
        <meshStandardMaterial color="#080816" emissive="#E5B020" emissiveIntensity={0.10} metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Step 3 */}
      <mesh position={[0, 13, 0]}>
        <boxGeometry args={[0.33, 6, 0.33]} />
        <meshStandardMaterial color="#060610" emissive="#F0C040" emissiveIntensity={0.14} metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Upper shaft */}
      <mesh position={[0, 18, 0]}>
        <boxGeometry args={[0.18, 8, 0.18]} />
        <meshStandardMaterial color="#050510" emissive="#FFD700" emissiveIntensity={0.22} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Spire */}
      <mesh position={[0, 24, 0]}>
        <cylinderGeometry args={[0, 0.06, 6, 6]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1.5} />
      </mesh>
      {/* Blinking spire light */}
      <pointLight ref={spireRef} position={[0, 27, 0]} color="#FFD700" intensity={6} distance={12} />
      {/* Warm lobby glow */}
      <pointLight position={[0, -1, 0]} color="#FF8C00" intensity={8} distance={10} />
    </group>
  )
}

// ─── Emirates Towers (twin tapered) ──────────────────────────────────────────
function EmiratesTowers() {
  return (
    <group position={[0, -4, 0]}>
      {/* Left tower */}
      <group position={[-8, 0, -18]}>
        <mesh position={[0, 4, 0]}>
          <boxGeometry args={[0.7, 8, 0.7]} />
          <meshStandardMaterial color="#0A0D18" emissive="#4A7FBF" emissiveIntensity={0.12} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 9, 0]}>
          <boxGeometry args={[0.5, 5, 0.5]} />
          <meshStandardMaterial color="#080B16" emissive="#5B8FCC" emissiveIntensity={0.16} metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 13, 0]}>
          <cylinderGeometry args={[0, 0.18, 4, 4]} />
          <meshStandardMaterial color="#1a3060" emissive="#7BA7E0" emissiveIntensity={0.5} />
        </mesh>
        <pointLight position={[0, 15, 0]} color="#7BA7E0" intensity={4} distance={8} />
      </group>

      {/* Right tower */}
      <group position={[8, 0, -18]}>
        <mesh position={[0, 3.5, 0]}>
          <boxGeometry args={[0.65, 7, 0.65]} />
          <meshStandardMaterial color="#0A0D18" emissive="#4A7FBF" emissiveIntensity={0.10} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 8, 0]}>
          <boxGeometry args={[0.45, 5, 0.45]} />
          <meshStandardMaterial color="#080B16" emissive="#5B8FCC" emissiveIntensity={0.14} metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 12, 0]}>
          <cylinderGeometry args={[0, 0.16, 3.5, 4]} />
          <meshStandardMaterial color="#1a3060" emissive="#7BA7E0" emissiveIntensity={0.5} />
        </mesh>
        <pointLight position={[0, 14, 0]} color="#7BA7E0" intensity={3} distance={7} />
      </group>
    </group>
  )
}

// ─── City skyline fill ────────────────────────────────────────────────────────
function Skyline({ simplified }: { simplified: boolean }) {
  const rng = (a: number, b: number) => Math.random() * (b - a) + a

  const buildings = useMemo(() => {
    const count = simplified ? 14 : 30
    const result: BldgProps[] = []
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1
      const offset = Math.floor(i / 2) * 2.5 + rng(0.5, 1.5)
      const isGold = Math.random() > 0.6
      result.push({
        x: side * offset + rng(-0.5, 0.5),
        z: rng(-20, -12),
        height: rng(2, 9),
        width: rng(0.5, 1.2),
        depth: rng(0.5, 1.2),
        baseColor: '#080C18',
        windowColor: isGold ? '#C2851A' : '#3A6FA8',
        emissiveIntensity: rng(0.06, 0.22),
      })
    }
    return result
  }, [simplified])

  return (
    <>
      {buildings.map((b, i) => <Building key={i} {...b} />)}
    </>
  )
}

// ─── Floating property stat cards ────────────────────────────────────────────
type StatCard = { x: number; y: number; z: number; label: string; value: string; color: string; speed: number; phase: number }

function FloatingStats({ simplified }: { simplified: boolean }) {
  const cards: StatCard[] = useMemo(() => [
    { x: -9, y: 3,   z: -8, label: 'NET YIELD',    value: '8.4%',    color: '#F59E0B', speed: 0.5, phase: 0 },
    { x:  9, y: 2.5, z: -7, label: 'ANNUAL ROI',   value: '14.2%',   color: '#34D399', speed: 0.4, phase: 1.2 },
    { x: -6, y: 0.5, z: -6, label: 'AVG PRICE',    value: 'AED 1.4M',color: '#A78BFA', speed: 0.6, phase: 2.1 },
    { x:  6, y: 4.5, z: -9, label: '5-YR RETURN',  value: '+67%',    color: '#F59E0B', speed: 0.35,phase: 0.8 },
    { x:  0, y: 5.5, z: -7, label: 'OCCUPANCY',    value: '94%',     color: '#60A5FA', speed: 0.45,phase: 1.7 },
  ], [])

  const groupRefs = useRef<(THREE.Group | null)[]>([])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    cards.forEach((c, i) => {
      const g = groupRefs.current[i]
      if (g) g.position.y = c.y + Math.sin(t * c.speed + c.phase) * 0.3
    })
  })

  if (simplified) return null

  return (
    <>
      {cards.map((c, i) => (
        <group key={i} ref={el => { groupRefs.current[i] = el }} position={[c.x, c.y, c.z]}>
          {/* Card backing */}
          <mesh>
            <planeGeometry args={[2.2, 0.9]} />
            <meshBasicMaterial color="#080C20" transparent opacity={0.75} />
          </mesh>
          {/* Border glow */}
          <mesh>
            <planeGeometry args={[2.24, 0.94]} />
            <meshBasicMaterial color={c.color} transparent opacity={0.25} side={THREE.BackSide} />
          </mesh>
          {/* Value */}
          <Text
            position={[0, 0.12, 0.01]}
            fontSize={0.3}
            color={c.color}
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
          >
            {c.value}
          </Text>
          {/* Label */}
          <Text
            position={[0, -0.2, 0.01]}
            fontSize={0.13}
            color="#94A3B8"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
          >
            {c.label}
          </Text>
        </group>
      ))}
    </>
  )
}

// ─── Dust / heat particles ────────────────────────────────────────────────────
function DustParticles({ count = 200 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const data = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 50,
    y: Math.random() * 14 - 2,
    z: (Math.random() - 0.5) * 28,
    speed: Math.random() * 0.003 + 0.0008,
    offset: Math.random() * Math.PI * 2,
    scale: Math.random() * 0.05 + 0.012,
    warm: Math.random() > 0.6,
  })), [count])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime
    data.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed * 0.6 + p.offset) * 3,
        p.y + Math.sin(t * p.speed + p.offset) * 1.5,
        p.z + Math.cos(t * p.speed * 0.4 + p.offset) * 2,
      )
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#D4A017" transparent opacity={0.22} />
    </instancedMesh>
  )
}

// ─── Searchlight beams from rooftops ─────────────────────────────────────────
function Searchlights({ simplified }: { simplified: boolean }) {
  const beams = useMemo(() => [
    { x: -8, z: -18, color: '#D4A017', speed: 0.4, phase: 0 },
    { x:  8, z: -18, color: '#4A90D9', speed: 0.3, phase: 1.5 },
    { x:  0, z: -24, color: '#FFD700', speed: 0.25, phase: 0.8 },
  ], [])

  const refs = useRef<(THREE.Mesh | null)[]>([])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    beams.forEach((b, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      const mat = mesh.material as THREE.MeshBasicMaterial
      mat.opacity = 0.06 + 0.05 * Math.sin(t * b.speed + b.phase)
    })
  })

  if (simplified) return null

  return (
    <group position={[0, -4, 0]}>
      {beams.map((b, i) => (
        <mesh key={i} ref={el => { refs.current[i] = el }} position={[b.x, 18, b.z]}>
          <cylinderGeometry args={[0, 0.6, 24, 8, 1, true]} />
          <meshBasicMaterial color={b.color} transparent opacity={0.07} side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Water reflection of city lights ─────────────────────────────────────────
function WaterReflections({ simplified }: { simplified: boolean }) {
  const refs = useRef<(THREE.Mesh | null)[]>([])
  const streaks = useMemo(() => [
    { x: -8, color: '#4A90D9', width: 0.08, len: 3 },
    { x:  8, color: '#5B9AE0', width: 0.06, len: 2.5 },
    { x:  0, color: '#FFD700', width: 0.1,  len: 4 },
    { x: -3, color: '#D4A017', width: 0.05, len: 2 },
    { x:  4, color: '#C2500A', width: 0.06, len: 2.2 },
  ], [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    streaks.forEach((_, i) => {
      const mesh = refs.current[i]
      if (mesh) {
        const mat = mesh.material as THREE.MeshBasicMaterial
        mat.opacity = 0.08 + 0.05 * Math.sin(t * 0.7 + i * 0.9)
      }
    })
  })

  if (simplified) return null

  return (
    <group position={[0, -4.01, -5]}>
      {streaks.map((s, i) => (
        <mesh key={i} ref={el => { refs.current[i] = el }} position={[s.x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[s.width, s.len]} />
          <meshBasicMaterial color={s.color} transparent opacity={0.10} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Camera parallax ──────────────────────────────────────────────────────────
function CameraRig({ disabled = false }: { disabled?: boolean }) {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (disabled) return
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [disabled])

  useFrame(() => {
    if (disabled) return
    camera.position.x += (mouse.current.x * 2.0 - camera.position.x) * 0.02
    camera.position.y += (mouse.current.y * 0.7 + 1.5 - camera.position.y) * 0.02
    camera.lookAt(0, 1, -10)
  })

  return null
}

// ─── Scene ────────────────────────────────────────────────────────────────────
export default function Hero3DScene() {
  const isMobile = useIsMobile()

  return (
    <Canvas
      camera={{ position: [0, 2, 14], fov: 58 }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      gl={{ antialias: !isMobile, alpha: false }}
      style={{ background: '#050A18' }}
    >
      {/* Atmosphere */}
      <fog attach="fog" args={['#0B1020', 22, 60]} />

      {/* Lighting — warm Dubai dusk */}
      <ambientLight intensity={0.15} color="#1a1030" />
      {/* Main sun/horizon warm light */}
      <directionalLight position={[0, 2, -20]} color="#C2500A" intensity={0.8} />
      {/* Cool sky fill */}
      <pointLight position={[0, 25, 0]} color="#1D4ED8" intensity={30} distance={80} />
      {/* Warm ground bounce */}
      <pointLight position={[0, -2, -5]} color="#8B4513" intensity={12} distance={25} />
      {/* Left accent */}
      <pointLight position={[-20, 8, -10]} color="#1D4ED8" intensity={18} distance={40} />
      {/* Right accent */}
      <pointLight position={[20, 8, -10]} color="#7C3AED" intensity={12} distance={35} />

      {/* Sky */}
      <SkySphere />
      <Stars radius={80} depth={60} count={isMobile ? 800 : 2500} factor={2} saturation={0.4} fade speed={0.2} />
      <HorizonGlow />

      {/* Ground & water */}
      <Ground />
      <Water />
      <WaterReflections simplified={isMobile} />

      {/* City */}
      <BurjKhalifa />
      <EmiratesTowers />
      <Skyline simplified={isMobile} />
      <Searchlights simplified={isMobile} />

      {/* Atmosphere */}
      <DustParticles count={isMobile ? 80 : 200} />

      {/* Property stats */}
      <FloatingStats simplified={isMobile} />

      <CameraRig disabled={isMobile} />
    </Canvas>
  )
}
