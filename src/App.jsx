import React from 'react'
import { motion } from 'framer-motion'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import CursorGlow from './components/CursorGlow'
import ScrollProgress from './components/ScrollProgress'
import ThemeToggle from './components/ThemeToggle'
import AnimatedBackground from './components/AnimatedBackground'
import { VisualIntensityProvider } from './contexts/VisualIntensityContext'
import IntensityToggle from './components/IntensityToggle'

export default function App(){
  return (
    <VisualIntensityProvider>
      <div className="min-h-screen animated-bg">
        <AnimatedBackground />
        <CursorGlow />
        <ScrollProgress />
        <motion.main className="max-w-6xl mx-auto px-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
          <div className="flex justify-end items-center py-6 gap-4">
            <IntensityToggle />
            <ThemeToggle />
          </div>
          <Hero />
          <About />
          <Projects />
          <Experience />
          <Contact />
        </motion.main>
      </div>
    </VisualIntensityProvider>
  )
}
