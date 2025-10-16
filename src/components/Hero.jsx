import React from 'react'
import { motion } from 'framer-motion'
// ParticleBackground removed; global AnimatedBackground is used in App
import MagneticButton from './MagneticButton'
import Orb3D from './Orb3D'

const splitWords = (text)=> text.split(' ').map((w,i)=> ({word:w, key:i}))

export default function Hero(){
  return (
  <section className="pt-24 pb-20 relative overflow-hidden perspective-1000">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <motion.h1 initial={{opacity:0, y:12, rotateZ:4}} whileInView={{opacity:1, y:0, rotateZ:0}} viewport={{once:true}} transition={{duration:0.9, ease:'easeOut'}} className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
            {splitWords('Janson Albi Scaria').map((w,i)=> (
              <motion.span key={w.key} initial={{opacity:0,y:12, rotateX:18}} whileInView={{opacity:1,y:0, rotateX:0}} viewport={{once:true}} transition={{delay:i*0.04, type:'spring', stiffness:120}} className="inline-block mr-2">{w.word}</motion.span>
            ))}
          </motion.h1>
          <motion.p initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} transition={{delay:0.2}} viewport={{once:true}} className="mt-3 text-xl text-slate-300">
            <motion.span initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>Team Leader & AI Engineer</motion.span>
          </motion.p>

          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.35}} className="mt-6 max-w-xl text-slate-400">
            Building intelligent systems that bridge industries and innovation.
          </motion.p>

          <motion.div initial={{opacity:0, y:8}} whileInView={{opacity:1, y:0}} transition={{delay:0.5}} viewport={{once:true}} className="mt-8 flex items-center gap-4">
            <MagneticButton className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-medium shadow-md" onClick={()=>{window.location.href='#contact'}}>Get in touch</MagneticButton>
            <MagneticButton className="text-sm text-slate-400 hover:text-slate-100" onClick={()=>{document.getElementById('projects').scrollIntoView({behavior:'smooth'})}}>Explore</MagneticButton>
          </motion.div>
        </div>

        <div className="flex justify-center md:justify-end">
          <motion.div initial={{rotateX:8, rotateY:6, z:0, scale:0.96, opacity:0}} whileInView={{rotateX:0, rotateY:0, scale:1, opacity:1}} viewport={{once:true}} transition={{type:'spring', stiffness:90}} className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-visible ring-1 ring-white/6 hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center">
            <Orb3D size={260} variant="torusKnot" />
          </motion.div>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <div className="scroll-indicator">
          <motion.span animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:1.6}} className="block w-2 h-2 bg-accent rounded-full"></motion.span>
        </div>
      </div>
    </section>
  )
}
