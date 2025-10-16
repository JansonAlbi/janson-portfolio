import React from 'react'
import { motion, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion'

function usePrefersReducedMotionClient(){
  try{ const mq = window.matchMedia('(prefers-reduced-motion: reduce)'); return mq.matches }catch(e){ return false }
}

export default function AnimatedOrb({ size = 240 }){
  const reduced = typeof window !== 'undefined' ? usePrefersReducedMotionClient() : false
  const mx = useMotionValue(size/2)
  const my = useMotionValue(size/2)
  const rx = useTransform(mx, (v)=> (- (v - size/2) / (size/12)))
  const ry = useTransform(my, (v)=> ((v - size/2) / (size/12)))
  const lightX = useTransform(mx, v => (v / size) * 100)
  const lightY = useTransform(my, v => (v / size) * 100)
  const highlightBg = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.12), transparent 18%)`

  const onPointerMove = (e) => {
    if(reduced) return
    const bounds = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - bounds.left)
    my.set(e.clientY - bounds.top)
  }

  const onPointerLeave = ()=>{
    if(reduced) return
    mx.set(size/2); my.set(size/2)
  }

  return (
    <motion.div
      style={{ width: size, height: size, perspective: 900 }}
      className="rounded-full flex items-center justify-center relative"
      initial={{ scale: 0.96 }}
      animate={{ scale: [0.98, 1, 0.98] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div style={{ width: size, height: size, rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} className="rounded-full">
        <svg viewBox="0 0 200 200" width={size} height={size} className="block">
          <defs>
            <linearGradient id="facetA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b1440" />
              <stop offset="100%" stopColor="#17305a" />
            </linearGradient>
            <linearGradient id="facetB" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1b2b5c" />
              <stop offset="100%" stopColor="#243b6f" />
            </linearGradient>
            <filter id="softBlur"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>

          <g transform="translate(100,100)">
            <motion.polygon points="0,-56 48,-18 30,46 -30,46 -48,-18" fill="url(#facetA)" style={{ transformOrigin: '0px 0px' }} animate={{ rotate: reduced ? 0 : [0, 7, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.polygon points="0,-56 48,-18 0,-12" fill="url(#facetB)" style={{ transformOrigin: '0px 0px' }} animate={{ rotate: reduced ? 0 : [-4, 4, -4] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} opacity="0.95" />
            <motion.polygon points="48,-18 30,46 18,12" fill="#0f254a" opacity="0.9" />
            <motion.polygon points="30,46 -30,46 -18,12" fill="#121f42" opacity="0.9" />
            <motion.polygon points="-30,46 -48,-18 0,-12" fill="url(#facetA)" opacity="0.92" />
            <motion.polygon points="-48,-18 0,-56 0,-12" fill="url(#facetB)" opacity="0.9" />
          </g>

          <g filter="url(#softBlur)">
            <motion.ellipse cx="100" cy="70" rx="64" ry="40" fill="rgba(170,200,255,0.04)" animate={{ opacity: reduced ? 0.02 : [0.02, 0.12, 0.02] }} transition={{ duration: 8, repeat: Infinity }} />
          </g>
        </svg>

        <motion.div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: highlightBg, mixBlendMode: 'screen' }} />
      </motion.div>

      <div className="absolute inset-0 rounded-full mix-blend-screen pointer-events-none" style={{ boxShadow: '0 36px 110px rgba(20,24,60,0.28)' }} />
    </motion.div>
  )
}
