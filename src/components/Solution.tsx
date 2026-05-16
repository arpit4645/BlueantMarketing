import React from 'react';
import { motion } from 'motion/react';
import { useSite } from '../lib/siteContext';
import SafeImage from './SafeImage';

export default function Solution() {
  const { settings } = useSite();

  const solutionHeadline = settings.solutionHeadline || "WE TURN BUSINESSES INTO BRANDS PEOPLE TRUST.";
  const solutionSub = settings.solutionSub || "At BlueAnt, we don't start with ads. We start with clarity, strategy, and positioning. Because branding is not your logo — it is the promise you consistently deliver.";

  return (
    <section id="approach" className="py-20 md:py-24 lg:py-28 px-5 md:px-6 bg-navy relative overflow-hidden">
      {/* Background Graphic Element */}
      <motion.div 
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute top-0 right-0 w-[800px] h-[800px] border border-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-navy-2 p-7 md:p-10 lg:p-14 brochure-card relative overflow-hidden group shadow-2xl"
        >
          {/* Contextual Image Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <SafeImage 
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-1000 grayscale-0" 
              alt="Indian Workspace" 
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start relative z-10">
            <div className="space-y-7 md:space-y-9">
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-mono text-blue-accent text-[10px] uppercase tracking-[0.4em] block"
              >
                Philosophy // 02
              </motion.span>
              <h2 className="text-5xl lg:text-7xl leading-[0.88] text-[#97a3c3] font-black italic uppercase tracking-tight text-left">
                {solutionHeadline.includes(' ') ? solutionHeadline.split(' ').map((w: string, i: number) => i === 3 ? <span key={i} className="italic text-[#97a3c3]/80 block lg:inline">{w} </span> : w + ' ') : solutionHeadline}
              </h2>
              
              <div className="border-l-2 border-white/10 pl-8 transition-colors group-hover:border-blue-accent/30 duration-500">
                <p className="text-white/90 text-xl leading-relaxed italic max-w-lg">
                  {solutionSub}
                </p>
              </div>
            </div>

            <div className="space-y-7 md:space-y-9 lg:pt-14">
              {[
                { num: "01", title: "Strategy first.", sub: "Execution next." },
                { num: "02", title: "Positioning before", sub: "promotion." },
                { num: "03", title: "System before", sub: "scale." },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="flex gap-8 items-start group/item"
                >
                  <span className="font-mono text-blue-accent/60 text-xl pt-1 group-hover/item:text-blue-accent group-hover/item:scale-110 transition-all">{item.num}</span>
                  <div className="flex-1 border-b border-white/20 pb-4 group-hover/item:border-white/30 transition-colors">
                    <h3 className="text-2xl md:text-3xl text-white font-black uppercase tracking-tight">
                      {item.title} <span className="italic text-white/80 group-hover/item:text-white transition-colors">{item.sub}</span>
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
