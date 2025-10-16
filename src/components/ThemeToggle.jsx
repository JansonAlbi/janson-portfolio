import React, {useEffect, useState} from 'react'
import { motion } from 'framer-motion'

export default function ThemeToggle(){
  const [theme, setTheme] = useState(()=>{
    try { return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') } catch(e){ return 'dark' }
  })

  useEffect(()=>{
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try{ localStorage.setItem('theme', theme) }catch(e){}
  },[theme])

  return (
    <motion.button aria-label="Toggle theme" onClick={()=> setTheme(t => t === 'dark' ? 'light' : 'dark')} className="w-12 h-7 rounded-full p-1 bg-white/6 flex items-center" whileTap={{scale:0.95}}>
      <motion.span layout className={`w-5 h-5 rounded-full bg-gradient-to-br ${theme==='dark'? 'from-cyan-400 to-violet-500':'from-yellow-300 to-orange-400'}`} />
    </motion.button>
  )
}
