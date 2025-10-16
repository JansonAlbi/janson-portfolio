import React, {useEffect, useRef} from 'react'

export default function ParticleBackground(){
  const canvasRef = useRef(null)

  useEffect(()=>{
    const canvas = canvasRef.current
    if(!canvas) return
    const ctx = canvas.getContext('2d')
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight
    let animationId

    const particles = Array.from({length: 40}).map(()=>({
      x: Math.random()*width,
      y: Math.random()*height,
      r: 1 + Math.random()*3,
      vx: (Math.random()-0.5)*0.2,
      vy: (Math.random()-0.5)*0.2,
      hue: 180 + Math.random()*60
    }))

    const pointer = {x: width/2, y: height/2}

    const onMove = (e)=>{ pointer.x = e.clientX; pointer.y = e.clientY }
    window.addEventListener('pointermove', onMove)

    function draw(){
      ctx.clearRect(0,0,width,height)
      for(const p of particles){
        // simple attraction to pointer
        const dx = (pointer.x - p.x)
        const dy = (pointer.y - p.y)
        const dist = Math.max(40, Math.hypot(dx,dy))
        p.vx += (dx/dist)*0.01
        p.vy += (dy/dist)*0.01
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98

        ctx.beginPath()
        const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8)
        grad.addColorStop(0, `hsla(${p.hue},100%,70%,0.12)`)
        grad.addColorStop(1, `hsla(${p.hue},80%,40%,0)`)
        ctx.fillStyle = grad
        ctx.fillRect(p.x-p.r*8,p.y-p.r*8,p.r*16,p.r*16)
      }
      animationId = requestAnimationFrame(draw)
    }

    function onResize(){ width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    draw()

    return ()=>{ cancelAnimationFrame(animationId); window.removeEventListener('resize', onResize); window.removeEventListener('pointermove', onMove) }
  },[])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10" />
}
