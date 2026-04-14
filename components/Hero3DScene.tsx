'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

// ─── Dubai Skyline ──────────────────────────────────────────────────────────
function DubaiSkyline() {
  const buildings = useMemo(() => {
    return [
      ...Array.from({ length: 18 }, (_, i) => ({
        x: (i - 9) * 2.2 + (Math.random() - 0.5) * 0.8,
        z: -18 + (Math.random() - 0.5) * 3,
        height: Math.random() * 6 + 1,
        width: Math.random() * 0.7 + 0.3,
        depth: Math.random() * 0.7 + 0.3,
        glow: Math.random() * 0.25 + 0.05,
      })),
      ...Array.from({ length: 12 }, (_, i) => ({
        x: (i - 6) * 2.8 + (Math.random() - 0.5) * 0.6,
        z: -11 + (Math.random() - 0.5) * 2,
        height: Math.random() * 4 + 0.8,
        width: Math.random() * 0.8 + 0.4,
        depth: Math.random() * 0.8 + 0.4,
        glow: Math.random() * 0.2 + 0.04,
      })),
      ...Array.from({ length: 6 }, (_, i) => ({
        x: (i - 3) * 4.5 + (Math.random() - 0.5) * 0.5,
        z: -5 + (Math.random() - 0.5) * 1,
        height: Math.random() * 3 + 0.5,
        width: Math.random() * 1.2 + 0.5,
        depth: Math.random() * 1.2 + 0.5,
        glow: Math.random() * 0.12 + 0.02,
      })),
    ]
  }, [])

  return (
    <group position={[0, -4, 0]}>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.height / 2, b.z]}>
          <boxGeometry args={[b.width, b.height, b.depth]} />
          <meshStandardMaterial
            color="#200A4A"
            emissive="#7C3AED"
            emissiveIntensity={b.glow}
            roughness={0.8}
            metalness={0.3}
          />
        </mesh>
      ))}
      {/* Hero tower */}
      <mesh position={[0, 5.5, -20]}>
        <boxGeometry args={[0.35, 13, 0.35]} />
        <meshStandardMaterial color="#1a0840" emissive="#8B5CF6" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 12.5, -20]}>
        <boxGeometry args={[0.12, 2, 0.12]} />
        <meshStandardMaterial color="#7C3AED" emissive="#A78BFA" emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

// ─── Floating Particles ─────────────────────────────────────────────────────
function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = 350

  const data = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 40,
    y: Math.random() * 20 - 2,
    z: (Math.random() - 0.5) * 30,
    speed: Math.random() * 0.003 + 0.001,
    offset: Math.random() * Math.PI * 2,
    scale: Math.random() * 0.05 + 0.01,
    purple: Math.random() > 0.5,
  })), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime
    const m = new THREE.Matrix4()
    data.forEach((p, i) => {
      m.makeScale(p.scale, p.scale, p.scale)
      m.setPosition(
        p.x + Math.sin(t * p.speed * 0.5 + p.offset) * 2,
        p.y + Math.sin(t * p.speed + p.offset) * 1.5,
        p.z + Math.cos(t * p.speed * 0.3 + p.offset) * 1.5
      )
      meshRef.current!.setMatrixAt(i, m)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#A78BFA" transparent opacity={0.5} />
    </instancedMesh>
  )
}

// ─── Neon Grid ──────────────────────────────────────────────────────────────
function GridFloor() {
  const ref = useRef<THREE.GridHelper>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.z = (clock.elapsedTime * 0.5) % 2
  })
  return <gridHelper ref={ref} args={[60, 40, '#7C3AED', '#3B1D8A']} position={[0, -4, -10]} />
}

// ─── Purple glow ring ────────────────────────────────────────────────────────
function GlowRing() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.elapsedTime * 0.06
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.04) * 0.15
    }
  })
  return (
    <mesh ref={ref} position={[0, 1, -15]}>
      <torusGeometry args={[9, 0.04, 16, 100]} />
      <meshBasicMaterial color="#7C3AED" transparent opacity={0.25} />
    </mesh>
  )
}

// ─── Mouse Parallax ──────────────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    camera.position.x += (mouse.current.x * 2.5 - camera.position.x) * 0.025
    camera.position.y += (mouse.current.y * 1.0 + 2 - camera.position.y) * 0.025
    camera.lookAt(0, 0, -10)
  })

  return null
}

// ─── Export ──────────────────────────────────────────────────────────────────
export default function Hero3DScene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 14], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false }}
      style={{ background: '#1E0A3C' }}
    >
      <fog attach="fog" args={['#1E0A3C', 18, 50]} />
      <ambientLight intensity={0.25} color="#3B1D8A" />
      <pointLight position={[0, 15, -5]} color="#7C3AED" intensity={80} />
      <pointLight position={[-15, 8, 0]} color="#123ba3" intensity={40} />
      <pointLight position={[15, 8, 0]} color="#A78BFA" intensity={35} />
      <Stars radius={80} depth={60} count={3000} factor={2} saturation={0.6} fade speed={0.4} />
      <Particles />
      <DubaiSkyline />
      <GridFloor />
      <GlowRing />
      <CameraRig />
    </Canvas>
  )
}
