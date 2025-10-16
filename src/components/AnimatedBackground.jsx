import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useVisualIntensity } from '../contexts/VisualIntensityContext'

// Respect OS reduced-motion preference
function usePrefersReducedMotion() {
  const [pref, setPref] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPref(mq.matches)
    update()
    if (mq.addEventListener) mq.addEventListener('change', update)
    else mq.addListener(update)
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', update); else mq.removeListener(update) }
  }, [])
  return pref
}

function NeuralCanvas({ enabled = true, intensity = 1 }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!enabled) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // clamp DPR to avoid huge canvas sizes on high-DPR devices
    let DPR = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width = Math.max(1, Math.floor(w * DPR))
    canvas.height = Math.max(1, Math.floor(h * DPR))
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)

    // particle settings (conservative caps for performance)
    const baseCount = Math.floor((w * h) / 120000)
    const target = Math.max(1, Math.floor(baseCount * Math.max(1, intensity * 1.2)))
    const COUNT = Math.max(18, Math.min(140, target))
    const pts = new Array(COUNT).fill(0).map(() => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45, r: 2 + Math.random() * 4 }))

    const pointer = { x: -9999, y: -9999 }
    function onMove(e) { pointer.x = e.clientX; pointer.y = e.clientY }
    window.addEventListener('pointermove', onMove)

    // throttle draw to target ~45fps
    let rafId = 0
    let last = 0
    const targetFps = 45
    const frameInterval = 1000 / targetFps

    // spatial grid for neighbor checks
    let cellSize = 160
    let cols = Math.max(1, Math.ceil(w / cellSize))
    let rows = Math.max(1, Math.ceil(h / cellSize))
    let buckets = new Array(cols * rows).fill(0).map(() => [])

    function rebuildCanvasSize() {
      DPR = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth; h = window.innerHeight
      canvas.width = Math.max(1, Math.floor(w * DPR))
      canvas.height = Math.max(1, Math.floor(h * DPR))
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      cols = Math.max(1, Math.ceil(w / cellSize))
      rows = Math.max(1, Math.ceil(h / cellSize))
      buckets = new Array(cols * rows).fill(0).map(() => [])
    }

    function draw(ts) {
      if (!last) last = ts
      const dt = ts - last
      if (dt < frameInterval) { rafId = requestAnimationFrame(draw); return }
      last = ts

      // pause when hidden to save CPU
      if (typeof document !== 'undefined' && document.hidden) { rafId = requestAnimationFrame(draw); return }

      // clear
      ctx.clearRect(0, 0, w, h)
      const g = ctx.createRadialGradient(w * 0.25, h * 0.15, 0, w * 0.5, h * 0.5, Math.max(w, h))
      g.addColorStop(0, 'rgba(10,14,32,0.12)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      // clear buckets
      for (let i = 0; i < buckets.length; i++) buckets[i].length = 0

      // update positions and insert into buckets
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        p.x += p.vx; p.y += p.vy
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20
        const gx = Math.min(cols - 1, Math.max(0, Math.floor(p.x / cellSize)))
        const gy = Math.min(rows - 1, Math.max(0, Math.floor(p.y / cellSize)))
        buckets[gy * cols + gx].push(i)
        const dist = Math.hypot(p.x - pointer.x, p.y - pointer.y)
        if (dist < 260) { p.vx += (pointer.x - p.x) / 12000; p.vy += (pointer.y - p.y) / 12000 }
      }

      // draw connections by checking neighboring cells only
      ctx.lineWidth = 0.8
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const list = buckets[gy * cols + gx]
          for (let ii = 0; ii < list.length; ii++) {
            const i = list[ii]
            const a = pts[i]
            let connections = 0
            // neighbor cells including self
            for (let ny = Math.max(0, gy - 1); ny <= Math.min(rows - 1, gy + 1); ny++) {
              for (let nx = Math.max(0, gx - 1); nx <= Math.min(cols - 1, gx + 1); nx++) {
                const nList = buckets[ny * cols + nx]
                for (let jj = 0; jj < nList.length; jj++) {
                  const j = nList[jj]
                  if (j <= i) continue
                  const b = pts[j]
                  const d = Math.hypot(a.x - b.x, a.y - b.y)
                  if (d < 180 && connections < 6) {
                    const alpha = 0.12 * (1 - d / 180) * Math.min(1, intensity * 1.2)
                    ctx.strokeStyle = `rgba(140,220,255,${alpha})`
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
                    connections++
                  }
                }
              }
            }
          }
        }
      }

      // draw nodes with additive glow for stronger visibility
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        ctx.beginPath()
        ctx.fillStyle = `rgba(125,249,255,${0.16 * Math.min(1.0, intensity)})`
        ctx.shadowBlur = Math.max(8, p.r * 6 * Math.min(1.8, 0.9 + intensity))
        ctx.shadowColor = `rgba(125,249,255,${0.26 * Math.min(1, intensity)})`
        ctx.arc(p.x, p.y, p.r * (1 + 0.3 * intensity), 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
      ctx.restore()

      rafId = requestAnimationFrame(draw)
    }

    function onResize() { rebuildCanvasSize() }
    window.addEventListener('resize', onResize)
    rafId = requestAnimationFrame(draw)
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener('pointermove', onMove); cancelAnimationFrame(rafId) }
  }, [enabled, intensity])

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-20" />
}

export default function AnimatedBackground() {
  const { scrollYProgress } = useScroll()
  const scrollIntensity = useTransform(scrollYProgress, [0, 1], [0.75, 1])
  const containerRef = useRef(null)
  const reduced = usePrefersReducedMotion()
  const { intensity } = useVisualIntensity()

  // pointer-following light (smoothed via spring)
  const pointerX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0)
  const pointerY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0)
  const smoothX = useSpring(pointerX, { stiffness: 140, damping: 26 })
  const smoothY = useSpring(pointerY, { stiffness: 140, damping: 26 })

  useEffect(() => {
    if (reduced) return // avoid pointer effects when reduced-motion
    let raf = null
    function onMove(e) {
      // use rAF to avoid flooding updates
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        pointerX.set(e.clientX)
        pointerY.set(e.clientY)
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => { window.removeEventListener('pointermove', onMove); if (raf) cancelAnimationFrame(raf) }
  }, [pointerX, pointerY, reduced])

  // Section tonal shift: map scroll progress to a subtle hue-rotate string
  const hueRotate = useTransform(scrollYProgress, [0, 1], ['hue-rotate(0deg)', 'hue-rotate(90deg)'])

  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    let w = window.innerWidth, h = window.innerHeight
    let tx = 0, ty = 0
    let ax = 0, ay = 0
    const layers = Array.from(c.querySelectorAll('[data-parallax]'))

    function onMove(e) { const nx = (e.clientX - w / 2) / (w / 2); const ny = (e.clientY - h / 2) / (h / 2); tx = nx; ty = ny }
    function onResize() { w = window.innerWidth; h = window.innerHeight }

    let raf = null
    function frame() {
      ax += (tx - ax) * 0.06
      ay += (ty - ay) * 0.06
      layers.forEach((el) => {
        const f = parseFloat(el.getAttribute('data-depth') || '1')
        const txPx = ax * (30 * f)
        const tyPx = ay * (20 * f)
        el.style.transform = `translate3d(${txPx}px, ${tyPx}px, 0) scale(${1 + 0.02 * f})`
      })
      raf = requestAnimationFrame(frame)
    }

    if (!reduced) window.addEventListener('pointermove', onMove)
    window.addEventListener('resize', onResize)
    frame()
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', onResize); cancelAnimationFrame(raf) }
  }, [reduced])

  return (
    <div ref={containerRef} className="fixed inset-0 -z-30 overflow-hidden">
      <motion.div
        data-parallax
        data-depth="0.6"
        style={{ opacity: scrollIntensity, backgroundImage: 'linear-gradient(120deg, #02061a 0%, #071033 20%, #0b1240 40%, rgba(0,120,200,0.95) 60%, rgba(180,50,120,0.9) 80%, rgba(210,150,60,0.5) 100%)' }}
        animate={{ backgroundPosition: ['0% 20%', '60% 80%', '100% 20%', '0% 20%'] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 bg-[length:300%_300%] blur-3xl"
      />

  <motion.div data-parallax data-depth="0.9" aria-hidden className="absolute inset-0 mix-blend-screen" initial={{ opacity: 0.08 }} animate={{ opacity: [0.08, 0.22, 0.08] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} style={{ background: 'radial-gradient(ellipse at 12% 20%, rgba(80,120,255,0.18), transparent 18%), radial-gradient(ellipse at 82% 78%, rgba(255,110,140,0.12), transparent 22%)' }} />

  <motion.div data-parallax data-depth="1.2" className="absolute -left-1/4 top-0 w-[150%] h-[40%] pointer-events-none" animate={{ x: ['-16%', '16%', '-16%'], rotate: [3, -3, 3] }} transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut' }} style={{ filter: 'blur(48px)', background: 'linear-gradient(90deg, rgba(58,40,160,0.22), rgba(0,150,220,0.18), rgba(220,80,150,0.14))' }} />

  <motion.div data-parallax data-depth="1.1" className="absolute w-80 h-80 rounded-full -left-28 -top-12 opacity-85 pointer-events-none" animate={{ x: [0, 72, -36, 0], y: [0, -48, 24, 0], scale: [1, 1.12, 0.94, 1], rotate: [0, 8, -6, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} style={{ background: 'radial-gradient(circle at 30% 30%, rgba(140,220,255,0.34), transparent 40%), linear-gradient(135deg, rgba(88,60,220,0.22), rgba(220,80,140,0.16))', filter: 'blur(34px)' }} />

  <motion.div data-parallax data-depth="0.8" className="absolute w-[28rem] h-[28rem] rounded-full right-16 bottom-8 opacity-78 pointer-events-none" animate={{ x: [0, -92, 36, 0], y: [0, 48, -56, 0], scale: [1, 0.94, 1.08, 1] }} transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }} style={{ background: 'radial-gradient(circle at 70% 60%, rgba(255,180,80,0.26), transparent 38%), linear-gradient(135deg, rgba(0,150,220,0.16), rgba(128,88,240,0.12))', filter: 'blur(46px)' }} />

      <motion.div data-parallax data-depth="1.05" className="absolute inset-0 pointer-events-none" animate={{ opacity: [0.02, 0.06, 0.02] }} transition={{ duration: 20, repeat: Infinity }}>
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ribbon" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#7df9ff" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#8a5cff" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#ffd88a" stopOpacity="0.04" />
            </linearGradient>
            <filter id="fblur"><feGaussianBlur stdDeviation="18" /></filter>
          </defs>
          <g filter="url(#fblur)">
            <motion.path d="M0 60 C 200 20, 400 100, 800 60 C 1200 20, 1400 100, 2000 60" stroke="url(#ribbon)" strokeWidth="6" fill="none" strokeLinecap="round" animate={{ translateX: ['0%', '-20%', '0%'] }} transition={{ duration: 36, repeat: Infinity, ease: 'linear' }} />
          </g>
        </svg>
      </motion.div>

  {/* Particle canvas (disabled if user prefers reduced motion) */}
  <NeuralCanvas enabled={!reduced} intensity={intensity} />

      {/* cursor-follow glow (follows pointer using smooth motion values) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <motion.div
          className="absolute rounded-full mix-blend-screen"
          style={{ translateX: smoothX, translateY: smoothY, left: 0, top: 0, width: 280, height: 280, background: 'radial-gradient(circle at center, rgba(255,255,255,0.08), rgba(255,255,255,0)))' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: reduced ? 0.01 : [0.01 * intensity, 0.06 * intensity, 0.01 * intensity] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* scroll-driven hue overlay for section tonal shifts */}
      <motion.div aria-hidden className="pointer-events-none fixed inset-0 -z-20" style={{ filter: hueRotate, mixBlendMode: 'overlay', opacity: reduced ? 0.02 : 0.08 }} />


      {/* subtle grid */}
      <svg className="absolute inset-0 w-full h-full -z-10 opacity-6" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}
