import React, {useRef} from 'react'
import { motion } from 'framer-motion'

export default function ProjectCard({project}){
  const ref = useRef()

  function onPointerMove(e){
    const el = ref.current
    if(!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (py - 0.5) * 10
    const ry = (px - 0.5) * -12
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(0,0,0)`
    el.style.boxShadow = `${-ry}px ${rx}px 40px rgba(10,20,40,0.35)`
  }

  function onPointerLeave(){
    const el = ref.current
    if(!el) return
    el.style.transform = ''
    el.style.boxShadow = ''
  }

  const gradient = project.gradient || 'linear-gradient(135deg,#6EE7B7 0%, #3B82F6 50%, #8B5CF6 100%)'

  return (
    <a ref={ref} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className="block rounded-xl p-4 transition-shadow transform-gpu will-change-transform relative overflow-visible" href={project.link || '#'}>
      <div className="absolute -inset-px rounded-xl blur-2xl opacity-60" style={{background:gradient, zIndex:-1}} aria-hidden />

      <div className="relative bg-white/6 dark:bg-black/20 rounded-xl p-4 ring-1 ring-white/6">
        <div className="flex items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <p className="text-sm text-slate-300 mt-1">{project.short}</p>
          </div>
        </div>

        <motion.div initial={{opacity:0,y:6}} whileHover={{opacity:1,y:0}} transition={{duration:0.28}} className="mt-3 overflow-hidden">
          <p className="text-sm text-slate-300">{project.long}</p>
          {project.preview && (
            <div className="mt-3 rounded-md overflow-hidden">
              <video muted loop playsInline className="w-full h-44 object-cover" onMouseEnter={e=> e.currentTarget.play()} onMouseLeave={e=> {e.currentTarget.pause(); e.currentTarget.currentTime=0}} src={project.preview} />
            </div>
          )}
        </motion.div>
      </div>
    </a>
  )
}
