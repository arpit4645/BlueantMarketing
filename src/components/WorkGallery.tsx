import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import SafeImage from './SafeImage';

interface Project {
  id?: string;
  name: string;
  cat: string;
  tags: string;
  year: string;
  img: string;
  order: number;
}

export default function WorkGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
      } else {
        setProjects([]);
      }
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'projects'));
    return () => unsub();
  }, []);

  useEffect(() => {
    if(!scrollRef.current || !contentRef.current) return;
    
    const updateWidth = () => {
      if(scrollRef.current && contentRef.current) {
        const calculateWidth = contentRef.current.offsetWidth - scrollRef.current.offsetWidth;
        setWidth(calculateWidth > 0 ? calculateWidth : 0);
      }
    };

    updateWidth();
    
    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(contentRef.current);
    resizeObserver.observe(scrollRef.current);

    const timer = setTimeout(updateWidth, 500);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [projects, loading]);

  if (loading && projects.length === 0) {
    return (
      <section className="py-32 bg-navy flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-accent border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  // Fallback projects if DB is empty
  const displayProjects = projects.length > 0 ? projects : [
    { name: "Noor Industries", cat: "Brand System · Manufacturing", tags: "Repositioning · Identity · GTM", year: "2025", img: "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=1200&q=80&auto=format&fit=crop" },
    { name: "Saffron & Sage", cat: "D2C · Category creation", tags: "Brand strategy · Funnel · Launch", year: "2025", img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=80&auto=format&fit=crop" },
    { name: "Meridian Works", cat: "SaaS · Positioning", tags: "Positioning · Messaging · Website", year: "2024", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80&auto=format&fit=crop" },
    { name: "Verde Hospitality", cat: "Hospitality · Brand", tags: "Identity · Experience · CMO", year: "2024", img: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1200&q=80&auto=format&fit=crop" },
    { name: "Kalpa Foods", cat: "FMCG · Growth system", tags: "Systems · Scaling · Automation", year: "2023", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80&auto=format&fit=crop" },
    { name: "Anvaya Capital", cat: "Financial services", tags: "Strategy · Consulting · CMO", year: "2023", img: "https://images.unsplash.com/photo-1544168190-79c17527004f?w=1200&q=80&auto=format&fit=crop" },
  ];

  return (
    <section id="work" className="py-20 md:py-24 lg:py-28 bg-navy overflow-hidden relative">
      {/* Cinematic Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <SafeImage 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.35 }}
          transition={{ duration: 2 }}
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80&auto=format&fit=crop"
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/40 to-navy" />
      </div>

      {/* Decorative vertical text */}
      <div className="absolute right-0 top-0 h-full py-32 px-6 flex flex-col justify-between pointer-events-none z-20 mix-blend-difference hidden lg:flex">
         <span className="font-mono text-[9px] text-white/70 uppercase tracking-[0.6em] rotate-180 [writing-mode:vertical-lr]">BlueAnt Case Studies // ARCHIVE</span>
         <span className="font-mono text-[9px] text-blue-accent uppercase tracking-[0.6em] [writing-mode:vertical-lr]">Strategic Transformation // 2024</span>
      </div>

      {/* Background Graphic Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white" />
        <div className="absolute top-0 left-2/4 w-[1px] h-full bg-white" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-white" />
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-6 mb-14 md:mb-16 relative z-20">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-12 mb-10">
               <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.2 }}
                 className="relative h-[260px] md:h-[420px] w-full overflow-hidden brochure-card group"
               >
                  <SafeImage 
                    src="https://images.unsplash.com/photo-1665686306574-1ace09918530?w=1200&q=80" 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
                    alt="Featured Project"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy transition-opacity group-hover:opacity-40" />
                  <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                     <span className="font-mono text-blue-accent text-[11px] uppercase tracking-[0.5em] mb-4 block">Featured Case // 01</span>
                     <h2 className="text-4xl md:text-6xl text-white font-black uppercase tracking-tighter">THE ARCHIVE <br/><span className="heading-italic italic text-white/60">TRANSFORMATION.</span></h2>
                  </div>
               </motion.div>
            </div>
         </div>

         <div className="flex items-end justify-between">
           <div>
             <motion.span 
               initial={{ opacity: 0, x: -10 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="font-mono text-[11px] uppercase tracking-[0.4em] text-blue-accent/60 block mb-4"
             >
               Portfolio // 23-25
             </motion.span>
             <h2 className="text-clamp-section leading-[0.85] text-white font-black uppercase tracking-tighter">
               SELECTED <br/><span className="heading-italic italic text-white/70 font-black">WORK</span>
             </h2>
           </div>
           <div className="text-right hidden md:block">
              <p className="text-white/80 max-w-[240px] text-xs font-mono uppercase tracking-widest leading-loose">
                Strategic trans-formations across diverse industry verticals. // Drag to explore.
              </p>
           </div>
         </div>
      </div>

      <motion.div ref={scrollRef} className="cursor-grab active:cursor-grabbing px-5 md:px-6 relative z-10">
        <motion.div 
          ref={contentRef}
          drag="x" 
          dragConstraints={{ right: 0, left: -width }}
          className="flex gap-5 md:gap-8 w-max"
        >
          {displayProjects.map((proj, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="w-[82vw] max-w-[460px] h-[520px] md:h-[580px] relative group overflow-hidden border border-white/5 brochure-card"
            >
              {/* Image with high-end transition */}
              <SafeImage 
                src={proj.img} 
                alt={proj.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 block"
              />
              
              {/* Modern Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
              
              {/* Scanline Detail on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-700">
                 <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
              </div>

              <div className="absolute top-8 right-8 mix-blend-difference">
                <span className="font-mono text-[10px] text-white tracking-[0.3em] font-black">{proj.year}</span>
              </div>

              <div className="absolute bottom-12 left-10 right-10">
                <div className="mb-6 flex items-center gap-4">
                  <span className="font-mono text-[9px] uppercase text-blue-accent tracking-[0.3em] font-black">{proj.cat}</span>
                  <div className="h-[1px] w-12 bg-blue-accent/30 group-hover:w-16 transition-all duration-500" />
                </div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter group-hover:text-blue-accent group-hover:italic transition-all duration-500 transform origin-left">
                  {proj.name}
                </h3>
                <p className="mt-6 text-white/80 text-xs font-mono uppercase tracking-widest leading-relaxed">
                   {proj.tags}
                </p>
                
                {/* Reveal line */}
                <div className="mt-8 h-[1px] w-0 bg-white group-hover:w-full transition-all duration-700 delay-100" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

