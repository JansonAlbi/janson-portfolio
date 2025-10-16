import React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

function usePrefersReducedMotion(){
  try{ const mq = window.matchMedia('(prefers-reduced-motion: reduce)'); return mq.matches }catch(e){ return false }
}

export default function CursorGlow(){
  const reduced = usePrefersReducedMotion()
  const x = useMotionValue(-9999)
  const y = useMotionValue(-9999)
  const isDown = useMotionValue(0)
  // springs for smooth following (so motion uses transform under the hood)
  const sx = useSpring(x, { stiffness: 160, damping: 24 })
  const sy = useSpring(y, { stiffness: 160, damping: 24 })
  const scale = useSpring(isDown, { stiffness: 220, damping: 22 })

  // offsets for centering each layer (subtract half width/height)
  const haloX = useTransform(sx, v => v - 210)
  const haloY = useTransform(sy, v => v - 210)
  const primaryX = useTransform(sx, v => v - 80)
  const primaryY = useTransform(sy, v => v - 80)
  const innerX = useTransform(sx, v => v - 18)
  const innerY = useTransform(sy, v => v - 18)

  React.useEffect(()=>{
    function move(e){ x.set(e.clientX); y.set(e.clientY) }
    function down(){ isDown.set(1) }
    function up(){ isDown.set(0) }
    function leave(){ x.set(-9999); y.set(-9999); isDown.set(0) }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    // pointerout covers leaving the window for pointers
    window.addEventListener('pointerout', leave)
    window.addEventListener('pointercancel', leave)
    return ()=>{
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointerout', leave)
      window.removeEventListener('pointercancel', leave)
    }
  }, [x,y,isDown])

  // Base style for each layer; we'll use Framer's x/y to position (so transforms compose correctly)
  const baseStyle = { pointerEvents: 'none', position: 'fixed', zIndex: 9999 }

  if (reduced) return null

  return (
    <>
      {/* large subtle halo */}
      <motion.div initial={false} animate={false} style={{ ...baseStyle, width: 420, height: 420, borderRadius: 9999, background: 'radial-gradient(circle at center, rgba(30,120,200,0.06), transparent 40%)', mixBlendMode: 'screen', opacity: 0.9 }}
        x={haloX}
        y={haloY}
      />

      {/* primary cursor glow */}
      <motion.div
        initial={false}
        animate={false}
        x={primaryX}
        y={primaryY}
        style={{
          ...baseStyle,
          width: 160,
          height: 160,
          borderRadius: 9999,
          background: 'radial-gradient(circle at center, rgba(125,249,255,0.18), rgba(138,92,255,0.08) 40%, transparent 60%)',
          mixBlendMode: 'screen',
          scale
        }}
      />

      {/* inner focus ring that pulses on pointer down */}
      <motion.div initial={false} animate={false} style={{ ...baseStyle }}>
        <motion.div
          x={innerX}
          y={innerY}
          style={{
            width: 36,
            height: 36,
            borderRadius: 9999,
            border: '2px solid rgba(125,249,255,0.36)',
            boxShadow: '0 8px 30px rgba(30,120,200,0.12)',
            scale: isDown,
            opacity: isDown
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </>
  )
}
