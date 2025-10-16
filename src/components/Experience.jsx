import React from 'react'
import { motion, useInView } from 'framer-motion'

const timeline = [
  {
    id: 1,
    year: 'Aug 2025 - Present',
    role: 'Team Lead',
    org: 'Indxo AI Private Limited',
    desc: 'Leading cross-functional teams on AI product delivery, CRM integrations and customer-facing solutions. Hybrid role based out of Bengaluru.'
  },
  {
    id: 2,
    year: 'Nov 2024 - Present',
    role: 'AI Engineer',
    org: 'Indxo AI Private Limited',
    desc: 'Designing and building computer vision and NLP systems, LLM integrations and production ML pipelines.'
  },
  {
    id: 3,
    year: 'Aug 2024 - Nov 2024',
    role: 'Software Engineer',
    org: 'Indxo AI Private Limited',
    desc: 'Developed and deployed FluidManager and TDS apps using Power Apps, Power Automate, and Microsoft SQL to streamline client workflows and reporting.'
  },
  {
    id: 4,
    year: 'Dec 2021 - Oct 2023',
    role: 'Founder (Part-time)',
    org: 'Stags Media',
    desc: 'Founded and led a digital marketing agency delivering data-driven campaigns, creative strategy and performance growth for clients.'
  }
]

function Node({item, index}){
  const ref = React.useRef()
  const inView = useInView(ref, {once:true, margin:'-120px'})
  return (
    <div ref={ref} className="relative">
      <div className="absolute left-0 top-3 -ml-3 w-6 h-6 rounded-full flex items-center justify-center">
        <motion.span initial={{scale:0.6, opacity:0.2}} animate={inView? {scale:1, opacity:1}: {}} transition={{type:'spring', stiffness:140}} className="block w-3 h-3 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 shadow-md" />
      </div>
      <motion.div initial={{opacity:0,x:-18}} animate={inView? {opacity:1,x:0}: {}} transition={{duration:0.5, delay:index*0.08}} className="pl-8 p-4 bg-white/3 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-slate-300">{item.role} • {item.org}</div>
            <div className="font-medium">{item.year}</div>
          </div>
        </div>
        <p className="mt-2 text-slate-300">{item.desc}</p>
      </motion.div>
    </div>
  )
}

export default function Experience(){
  return (
    <section id="experience" className="py-20">
      <h2 className="text-2xl font-semibold">Experience</h2>
      <div className="mt-6 space-y-6">
        {timeline.map((t,i)=> (
          <Node key={t.id} item={t} index={i} />
        ))}
      </div>
    </section>
  )
}
