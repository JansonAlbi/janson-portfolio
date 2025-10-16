import React, {useState} from 'react'
import ProjectCard from './ProjectCard'
import { motion } from 'framer-motion'

const projects = [
  {
    name: 'Accelerated Computing AI Environment for Image Segmentation and Object Detection',
    category: 'Computer Vision',
    short: 'Custom image segmentation & detection models optimized for GPU architectures.',
    long: 'Designed custom image segmentation and object detection models using C++, CUDA, and Neural Architecture Search (NAS). Employed hyperparameter optimization and performance analysis tools to fine-tune models for efficient GPU processing, significantly reducing training times and improving inference throughput.',
    logo: '/cv-logo.svg',
    gradient: 'linear-gradient(135deg,#7C3AED 0%, #06B6D4 50%, #FDE68A 100%)',
    preview: ''
  },
  {
    name: 'Conversational AI for Industrial Support',
    category: 'Conversational AI',
    short: 'AI-powered chatbot to streamline support and query resolution for manufacturing clients.',
    long: 'Designed and deployed an AI-powered chatbot to streamline support and query resolution for manufacturing clients, reducing human intervention and improving efficiency. Developed robust conversational models using LLMs and NLP frameworks, integrated with client databases and APIs for real-time answers, and deployed across web and mobile platforms.',
    logo: '/chatbot-logo.svg',
    gradient: 'linear-gradient(135deg,#06B6D4 0%, #7C3AED 50%, #FDE68A 100%)',
    preview: ''
  },
  {
    name: 'Device for Automatic Number Plate Recognition Using Edge GENAI (Patented: INKA03187935496089W)',
    category: 'Edge AI',
    short: 'Real-time edge-based ANPR system with GPU acceleration (patented).',
    long: 'Developed real-time number plate recognition using C++, CUDA, and GPU acceleration for hardware optimization. Leveraged parallel computing and memory/cache optimization to maximize GPU utilization and minimize latency for edge deployment.',
    logo: '/anpr-logo.svg',
    gradient: 'linear-gradient(135deg,#F97316 0%, #F43F5E 50%, #7C3AED 100%)',
    preview: ''
  },
  {
    name: 'Fluid Manager App Development',
    category: 'Productivity',
    short: 'FluidManager — a Dynamic solution for fluid tracking, maintenance and reporting.',
    long: 'Designed and developed FluidManager, a fluid management system using HTML, CSS, JavaScript and Flask to streamline fluid tracking, maintenance, and reporting. Implemented automated workflows, integrated with Microsoft SQL Server for secure data storage, and collaborated with stakeholders to design intuitive UIs for desktop and mobile.',
    logo: '/fluid-logo.svg',
    gradient: 'linear-gradient(135deg,#60A5FA 0%, #34D399 50%, #A78BFA 100%)',
    preview: ''
  },
  {
    name: 'Technical Data Sheets App Development',
    category: 'Productivity',
    short: 'Technical Data Sheets — a Dynamic solution for fluid tracking, maintenance and reporting.',
    long: 'Designed and developed Technical Data Sheets using HTML, CSS, JavaScript and Flask to streamline document generation management and Translation across multiple language. Implemented automated workflows, integrated with Microsoft SQL Server for secure data storage, and collaborated with stakeholders to design intuitive UIs for desktop and mobile.',
    logo: '/fluid-logo.svg',
    gradient: 'linear-gradient(135deg,#60A5FA 0%, #34D399 50%, #A78BFA 100%)',
    preview: ''
  },
  {
    name: 'Eduक्रांति',
    category: 'Education',
    short: 'Adaptive learning platform for Indian markets.',
    long: 'Built ML-driven content personalization, analytics dashboards, and scalable backend for 100k+ users.',
    logo: '/educranti-logo.svg',
    gradient: 'linear-gradient(135deg,#4FD1C5 0%, #60A5FA 50%, #A78BFA 100%)',
    preview: ''
  },
  {
    name: 'Safety Equipment Detection System',
    category: 'Computer Vision',
    short: 'Computer vision system to enforce PPE compliance.',
    long: 'Deployed object detection and tracking in edge devices with model quantization and monitoring.',
    logo: '/safety-logo.svg',
    gradient: 'linear-gradient(135deg,#7C3AED 0%, #06B6D4 50%, #FDE68A 100%)',
    preview: ''
  },
  {
    name: 'OPC Server for Real-Time CNC Machine Telemetry',
    category: 'Industrial IoT',
    short: 'Host machine telemetry as an OPC UA server for real-time tag access across any CNC.',
    long: 'Built a platform to expose CNC machine data as an OPC UA server, enabling real-time tags and telemetry across diverse machine controllers. Implemented reliable polling and event-driven updates, tag mapping, and secure transport (TLS) for integration with SCADA, MES, and analytics systems. Optimized for low-latency on industrial networks and designed tools for tag discovery, mapping, and historical logging.',
    logo: '/opc-logo.svg',
    gradient: 'linear-gradient(135deg,#0EA5A4 0%, #06B6D4 50%, #7C3AED 100%)',
    preview: ''
}
]

export default function Projects(){
  const [filter, setFilter] = useState('All')
  const cats = ['All', ...Array.from(new Set(projects.map(p=>p.category)))]

  const filtered = filter === 'All' ? projects : projects.filter(p=> p.category === filter)

  return (
    <section id="projects" className="py-20">
      <h2 className="text-2xl font-semibold">Projects</h2>
      <p className="mt-2 text-slate-400">Selected AI and software projects with focus on production readiness.</p>

      <div className="mt-6 flex items-center gap-3">
        {cats.map(c => (
          <motion.button key={c} onClick={()=>setFilter(c)} whileTap={{scale:0.97}} className={`px-3 py-1 rounded-full text-sm ${filter===c? 'bg-gradient-to-r from-cyan-400 to-violet-500 text-black':'bg-white/3 text-slate-300'}`}>{c}</motion.button>
        ))}
      </div>

      <motion.div layout className="mt-8 grid sm:grid-cols-2 gap-6">
        {filtered.map((p,i)=> (
          <motion.div key={p.name} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}>
            <ProjectCard project={p} />
          </motion.div>
        ))}
        
      </motion.div>
    </section>
  )
}
