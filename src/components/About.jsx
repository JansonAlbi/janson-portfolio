import React from 'react'
import { motion, useInView } from 'framer-motion'
import Orb3D from './Orb3D'

export default function About(){
  const ref = React.useRef()
  const inView = useInView(ref, {once:false, margin:'-10% 0px -40% 0px'})

  return (
    <section id="about" className="py-20">
      <motion.div ref={ref} className={`grid md:grid-cols-3 gap-8 items-center transition-colors ${inView? 'bg-white/2' : ''}`}>
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold">About</h2>
          <p className="mt-4 text-slate-300 max-w-3xl">I’m Janson Albi Scaria, an AI Engineer and Team Lead at Indxo AI Pvt Ltd, where I build and lead teams developing end-to-end AI products that bridge industrial needs with intelligent automation. My work spans computer vision, LLMs, and edge AI, with a strong focus on turning concepts into production-ready solutions that create real impact on the shop floor.

I lead by example — blending technical depth with leadership discipline — guiding teams through every stage of product development, from problem definition to real-world deployment. Beyond engineering, I approach every project with an entrepreneurial mindset: moving fast, staying adaptable, and always aligning innovation with tangible business value.

My goal is simple — to build AI systems that work where it matters most: in factories, on devices, and in the hands of people driving the next industrial revolution.</p>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="p-4 bg-white/3 rounded-lg">
              <div className="text-xs text-slate-300">Years</div>
              <div className="text-xl font-medium">1+</div>
            </div>
            <div className="p-4 bg-white/3 rounded-lg">
              <div className="text-xs text-slate-300">Projects Led</div>
              <div className="text-xl font-medium">5+</div>
            </div>
            <div className="p-4 bg-white/3 rounded-lg">
              <div className="text-xs text-slate-300">Expertise</div>
              <div className="text-xl font-medium">Product, Gen AI, ML Systems, CV, NLP</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <motion.div whileHover={{rotateX:6, rotateY:-4, scale:1.02}} transition={{type:'spring', stiffness:120}} className="w-48 h-48 rounded-full overflow-visible ring-1 ring-white/6 flex items-center justify-center">
            <Orb3D size={180} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
