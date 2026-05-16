import React from 'react';
import { motion } from 'motion/react';
import { useSite } from '../lib/siteContext';
import SafeImage from './SafeImage';

export default function AboutLong() {
  const { settings } = useSite();

  const visionStatement = settings.visionStatement || "To build brands that create impact, authority & global long-term value.";
  const missionStatement = settings.missionStatement || "Help businesses move from confusion to clarity, tactics to strategy, struggle to scalable systems.";

  return (
    <section className="bg-off-white relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-cream opacity-50 -skew-x-12 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-6 py-20 md:py-24 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-navy p-7 md:p-10 lg:p-12 brochure-card text-white relative overflow-hidden flex flex-col justify-center min-h-[520px] shadow-2xl group"
          >
            {/* Advanced Graphics: Ambient Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-blue-accent/5 blur-[100px] pointer-events-none" />
            
            <SafeImage 
              initial={{ scale: 1.1, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 0.4 }}
              transition={{ duration: 1.5 }}
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover" 
              alt="Team" 
              referrerPolicy="no-referrer"
            />

            {/* Large Background Text for texture */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 select-none pointer-events-none opacity-[0.03] whitespace-nowrap">
              <span className="text-[20vw] font-black uppercase text-white leading-none">BlueAnt</span>
            </div>

            <div className="relative z-10">
              <span className="font-mono text-blue-accent text-[10px] uppercase tracking-[0.4em] mb-8 block font-bold">Legacy // Vision</span>
              <h2 className="text-5xl lg:text-6xl font-black leading-tight mb-10 uppercase tracking-tighter text-white">
                WE'RE NOT AN <br/>
                AGENCY. <br/>
                <span className="italic text-blue-accent font-black">WE'RE PARTNERS.</span>
              </h2>
              <p className="text-white/90 mb-12 text-xl italic leading-relaxed max-w-lg border-l-2 border-blue-accent/30 pl-6">
                BlueAnt exists to help businesses think strategically, position powerfully, and grow predictably — combining three disciplines into a single operating rhythm.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { n: "01", t: "Strategy", s: "Thinking" },
                  { n: "02", t: "Branding", s: "Perception" },
                  { n: "03", t: "Marketing", s: "Execution" },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.08)' }}
                    className="bg-white/5 p-6 border border-white/10 group/card transition-all rounded-xl backdrop-blur-sm"
                  >
                    <span className="font-mono text-blue-accent text-[10px] mb-3 block group-hover/card:scale-110 transition-transform origin-left font-bold">0{i+1}</span>
                    <h4 className="font-black text-lg mb-1 flex items-center gap-2 uppercase tracking-tight text-white">{item.t}</h4>
                    <span className="text-white/60 italic text-[11px] transition-colors group-hover/card:text-blue-accent">/ {item.s}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-7 md:p-10 lg:p-12 shadow-xl flex flex-col justify-between h-full brochure-card group border border-navy/5"
            >
              <div>
                <span className="font-mono text-[10px] uppercase text-muted/80 tracking-[0.4em] block mb-6">Objective // 2030</span>
                <h3 className="text-4xl text-navy mb-10 font-black uppercase tracking-tighter">Vision</h3>
                <p className="text-3xl text-navy font-black leading-tight tracking-tight">
                  "{visionStatement}"
                </p>
              </div>
              <div className="mt-12 h-[2px] w-12 bg-navy group-hover:w-full transition-all duration-700" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-navy p-7 md:p-10 lg:p-12 flex flex-col justify-between h-full relative overflow-hidden brochure-card shadow-2xl rounded-2xl border border-white/5"
            >
               {/* Advanced Graphics: Pattern overlay and glow */}
               <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-accent/10 blur-[80px] rounded-full translate-x-1/2 translate-y-1/2" />
               
               <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase text-white/50 tracking-[0.4em] block mb-6 font-bold">Mission // Constant</span>
                <h3 className="text-4xl text-white mb-10 font-black uppercase tracking-tighter">Mission</h3>
                <p className="text-3xl text-white font-black leading-tight tracking-tight">
                  "{missionStatement}"
                </p>
              </div>
              <div className="mt-12 h-[2px] w-12 bg-blue-accent" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
