import React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, MeshWobbleMaterial, OrbitControls, Environment } from '@react-three/drei'
import AnimatedOrb from './AnimatedOrb'
import { useVisualIntensity } from '../contexts/VisualIntensityContext'

function usePrefersReducedMotionClient(){
  try{ const mq = window.matchMedia('(prefers-reduced-motion: reduce)'); return mq.matches }catch(e){ return false }
}

function RotatingMesh({ intensity = 1, targetRot, variant = 'icosa' }){
  const ref = React.useRef()
  // smooth rotation towards targetRot (object with x/y)
  useFrame((state, dt) => {
    if(!ref.current) return
    // lerp rotation
    const rx = ref.current.rotation.x
    const ry = ref.current.rotation.y
    const tx = targetRot.current.x
    const ty = targetRot.current.y
    // faster when intensity higher
    const speed = 2.0 * Math.max(0.25, intensity)
    ref.current.rotation.x = rx + (tx - rx) * (0.06 * speed)
    ref.current.rotation.y = ry + (ty - ry) * (0.06 * speed)
    // subtle autonomous rotation that blends with pointer-driven target
    ref.current.rotation.x += 0.03 * dt * (0.5 * (1 - Math.min(1, intensity)))
    ref.current.rotation.y += 0.025 * dt * (0.5 * (1 - Math.min(1, intensity)))
  })
  // Build layered, performant shapes per variant for depth and visual interest
  return (
    <group ref={ref} scale={[1.05, 1.05, 1.05]}>
      {/* ICOSA variant: inner wobbling low-poly core + distorted translucent shell + subtle wireframe */}
      {variant === 'icosa' && (
        <>
          <mesh>
            <icosahedronGeometry args={[0.9, 1]} />
            <MeshWobbleMaterial speed={0.9 * Math.max(0.5, intensity)} factor={0.06 * Math.max(0.5, intensity)} color="#163055" envMapIntensity={0.6} roughness={0.28} metalness={0.45} />
          </mesh>

          <mesh scale={[1.12, 1.12, 1.12]}>
            <icosahedronGeometry args={[1, 1]} />
            <MeshDistortMaterial color="#0f2746" roughness={0.6} metalness={0.2} emissive="#4fd8ff" emissiveIntensity={0.08 * intensity} factor={0.35 * intensity} transparent opacity={0.92} />
          </mesh>

          <mesh scale={[1.18, 1.18, 1.18]}>
            <icosahedronGeometry args={[1.02, 0]} />
            <meshStandardMaterial color="#7df9ff" wireframe={true} transparent={true} opacity={0.06} roughness={1} />
          </mesh>
        </>
      )}

      {/* TORUSKNOT variant: primary distorted torus knot + glossy inner core + thin rim wireframe */}
      {variant === 'torusKnot' && (
        <>
          <mesh>
            <torusKnotGeometry args={[0.85, 0.28, 128, 24]} />
            <MeshDistortMaterial color="#1b2b5c" roughness={0.28} metalness={0.5} emissive="#6fefff" emissiveIntensity={0.14 * intensity} factor={0.55 * intensity} />
          </mesh>

          <mesh scale={[0.88, 0.88, 0.88]}>
            <sphereGeometry args={[0.46, 32, 32]} />
            <MeshWobbleMaterial speed={1.2} factor={0.04 * intensity} color="#12223f" envMapIntensity={0.8} roughness={0.2} metalness={0.6} />
          </mesh>

          <mesh scale={[1.02, 1.02, 1.02]}>
            <torusKnotGeometry args={[0.9, 0.28, 64, 12]} />
            <meshStandardMaterial color="#9aeaff" wireframe={true} transparent opacity={0.07} roughness={1} />
          </mesh>
        </>
      )}

      {/* fallback simple shapes for other variants */}
      {variant === 'box' && (
        <mesh>
          <boxGeometry args={[1.6, 1.2, 1.4]} />
          <MeshDistortMaterial color="#2a1f5a" roughness={0.4} metalness={0.5} emissive="#4fd8ff" emissiveIntensity={0.12 * intensity} factor={0.3 * intensity} />
        </mesh>
      )}

      {variant === 'tetra' && (
        <mesh>
          <tetrahedronGeometry args={[1, 0]} />
          <MeshWobbleMaterial speed={0.8} factor={0.05 * intensity} color="#1b2b5c" envMapIntensity={0.7} roughness={0.25} metalness={0.45} />
        </mesh>
      )}
    </group>
  )
}

function WebGLWrapper({ intensity, variant = 'icosa' }){
  const reduced = usePrefersReducedMotionClient()
  const wrapperRef = React.useRef()
  const targetRot = React.useRef({ x: 0.2, y: 0.4 })
  const dragging = React.useRef(false)
  const lastPos = React.useRef([0,0])

  // map pointer position to small rotation targets
  function setTargetFromPointer(clientX, clientY){
    const rect = wrapperRef.current?.getBoundingClientRect()
    if(!rect) return
    const nx = (clientX - (rect.left + rect.width/2)) / (rect.width/2)
    const ny = (clientY - (rect.top + rect.height/2)) / (rect.height/2)
    // clamp
    const tx = -ny * 0.9 // invert to make vertical movement rotate x
    const ty = nx * 1.1
    // scale by intensity and reduced-motion guard
    const scale = reduced ? 0.25 : (0.3 + 0.9 * intensity)
    targetRot.current.x = tx * scale
    targetRot.current.y = ty * scale
  }

  function onPointerDown(e){
    dragging.current = true
    lastPos.current = [e.clientX, e.clientY]
    // capture pointer for consistent drag
    try{ e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId) }catch(e){}
  }
  function onPointerUp(e){
    dragging.current = false
    try{ e.currentTarget.releasePointerCapture && e.currentTarget.releasePointerCapture(e.pointerId) }catch(e){}
  }
  function onPointerMove(e){
    if(dragging.current){
      const dx = e.clientX - lastPos.current[0]
      const dy = e.clientY - lastPos.current[1]
      // translate drag delta into rotation delta
      targetRot.current.x += -dy * 0.006 * (0.8 + intensity)
      targetRot.current.y += dx * 0.006 * (0.8 + intensity)
      lastPos.current = [e.clientX, e.clientY]
    } else {
      setTargetFromPointer(e.clientX, e.clientY)
    }
  }

  return (
    <div ref={wrapperRef} style={{ width: 240, height: 240 }} className="rounded-full overflow-hidden"
      onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerMove={onPointerMove} onPointerLeave={() => { if(!dragging.current) targetRot.current = { x: 0.2, y: 0.4 } }}>
      <Canvas style={{ width: '100%', height: '100%' }} camera={{ position: [0, 0, 3.2], fov: 40 }}>
        <ambientLight intensity={0.6 * intensity} />
        <directionalLight position={[5,5,5]} intensity={0.6 * intensity} />
        <Environment preset="studio" />
        <RotatingMesh intensity={intensity} targetRot={targetRot} variant={variant} />
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  )
}

export default function Orb3D({ size = 240, variant = 'icosa' }){
  const { intensity } = useVisualIntensity()
  const [hasGL, setHasGL] = React.useState(true)

  React.useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setHasGL(false)
    } catch (e) { setHasGL(false) }
  }, [])

  if (!hasGL) return <AnimatedOrb size={size} />
  return (
    <div style={{ width: size, height: size }} className="rounded-full overflow-hidden">
      <WebGLWrapper intensity={intensity} variant={variant} />
    </div>
  )
}
