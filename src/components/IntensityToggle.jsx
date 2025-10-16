import React from 'react'
import { motion } from 'framer-motion'
import { useVisualIntensity } from '../contexts/VisualIntensityContext'

export default function IntensityToggle(){
  const { intensity, setIntensity } = useVisualIntensity()
  return (
    <div className="flex items-center gap-3">
      <div className="text-xs text-slate-300 mr-2">Visual Intensity</div>
      <motion.input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={intensity}
        onChange={(e) => setIntensity(Number(e.target.value))}
        whileTap={{ scale: 0.98 }}
        className="w-40 h-2 accent-sky-400"
        aria-label="Visual intensity"
      />
    </div>
  )
}
