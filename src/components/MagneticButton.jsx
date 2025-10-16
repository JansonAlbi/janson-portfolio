import React, {useRef, useEffect} from 'react'

export default function MagneticButton({children, className='', ...props}){
  const ref = useRef()

  useEffect(()=>{
    const el = ref.current
    if(!el) return

    function onMove(e){
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width/2)
      const dy = e.clientY - (rect.top + rect.height/2)
      const dist = Math.hypot(dx,dy)
      const max = Math.min(24, rect.width*0.35)
      const coeff = Math.max(0, 1 - dist / 240)
      el.style.transform = `translate(${dx*0.08*coeff}px, ${dy*0.06*coeff}px) scale(${1 + 0.03*coeff})`
    }

    function onLeave(){ el.style.transform = '' }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return ()=>{ el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave) }
  },[])

  return (
    <button ref={ref} className={`magnetic ${className}`} {...props}>
      {children}
    </button>
  )
}
