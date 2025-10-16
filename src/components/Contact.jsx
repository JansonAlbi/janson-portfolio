import React, {useState} from 'react'
import { motion } from 'framer-motion'

export default function Contact(){
  const [sent, setSent] = useState(false)

  return (
    <section id="contact" className="py-20">
      <h2 className="text-2xl font-semibold">Contact</h2>
      <p className="mt-2 text-slate-400">Want to collaborate? Send a message or reach me on social platforms.</p>

      <div className="mt-8 relative">
        <motion.div className="absolute inset-0 rounded-2xl -z-10" initial={{opacity:0.06}} animate={{opacity:[0.06,0.12,0.06]}} transition={{duration:24, repeat:Infinity}} style={{background:'linear-gradient(120deg, rgba(125,249,255,0.06), rgba(138,92,255,0.04), rgba(253,224,138,0.03))', filter:'blur(18px)'}} />

        <div className="relative grid md:grid-cols-2 gap-8">
          <motion.form onSubmit={(e)=>{e.preventDefault(); setSent(true); setTimeout(()=>setSent(false),2500)}} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}} className="space-y-4 bg-white/5 dark:bg-black/30 p-6 rounded-xl ring-1 ring-white/6 backdrop-blur-md">
            <input className="w-full p-3 rounded-lg bg-transparent placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40" placeholder="Your name" />
            <input className="w-full p-3 rounded-lg bg-transparent placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40" placeholder="Email" />
            <textarea className="w-full p-3 rounded-lg bg-transparent placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40" rows={5} placeholder="Message"></textarea>
            <button className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 text-black">Send message</button>
          </motion.form>

          <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="flex flex-col gap-4 items-start justify-center">
            <a href="https://www.linkedin.com/in/jansonalbiscaria" className="text-slate-300 hover:text-slate-100">LinkedIn</a>
            <a href="https://github.com/JansonAlbi" className="text-slate-300 hover:text-slate-100">GitHub</a>
            <a href="mailto:jansonalbi2002@gmail.com" className="text-slate-300 hover:text-slate-100">hello@janson.example</a>

            {sent && (
              <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:0.28}} className="mt-6 p-4 bg-white/5 rounded-lg">
                <div className="text-slate-200">Message sent — thank you! I will reply shortly.</div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <footer className="mt-12 py-6 border-t border-white/6 flex items-center justify-between">
        <div className="text-slate-400">© {new Date().getFullYear()} Janson Albi Scaria</div>
        <div className="w-48 h-1 bg-gradient-to-r from-cyan-400 via-transparent to-violet-500 rounded-full" />
      </footer>
    </section>
  )
}
