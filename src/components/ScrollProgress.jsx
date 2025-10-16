import React, {useEffect, useState} from 'react'

export default function ScrollProgress(){
  const [progress, setProgress] = useState(0)
  useEffect(()=>{
    const onScroll = ()=>{
      const scrolled = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress((scrolled / Math.max(1,height)) * 100)
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  return (
    <div aria-hidden className="fixed top-0 left-0 right-0 h-1 z-50">
      <div style={{width: `${progress}%`}} className="h-1 bg-gradient-to-r from-cyan-400 to-violet-500 shadow-md" />
    </div>
  )
}
