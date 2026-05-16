import React from 'react';
import { motion } from 'motion/react';
import SafeImage from './SafeImage';

const clarifyData = [
  { L: "C", name: "Clarity", desc: "Define purpose, promise & transformation" },
  { L: "L", name: "Leverage Positioning", desc: "Stand out — don't blend in" },
  { L: "A", name: "Align Internal Brand", desc: "Team becomes brand ambassadors" },
  { L: "R", name: "Realize Activation", desc: "Turn strategy into visible impact" },
  { L: "I", name: "Implement GTM", desc: "Execute with precision" },
  { L: "F", name: "Foster Scaling", desc: "Build repeatable systems" },
  { L: "Y", name: "Yield Impact", desc: "Create brand + cultural influence" },
];

const brandsData = [
  { L: "B", name: "Beliefs → Identity", desc: "What you stand for becomes who you are" },
  { L: "R", name: "Relatable Storytelling", desc: "Stories that make people feel seen" },
  { L: "A", name: "Authentic Consistency", desc: "Show up the same, everywhere" },
  { L: "N", name: "Nurtured Experiences", desc: "Every touchpoint earns loyalty" },
  { L: "D", name: "Distinction with Purpose", desc: "Be different for a reason" },
  { L: "S", name: "Social Impact", desc: "Matter beyond the transaction" },
];

export default function Frameworks() {
  return (
    <section id="frameworks" className="py-20 md:py-24 lg:py-28 px-5 md:px-6 bg-off-white relative overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-navy fill-current">
          <circle cx="100" cy="50" r="40" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 md:mb-14 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <span className="font-mono text-blue-accent text-[12px] uppercase tracking-[0.4em] mb-4 block">Proven Methodologies // 01-02</span>
            <h2 className="text-clamp-section leading-none">STRATEGIC <span className="italic text-navy/60">BLUEPRINTS.</span></h2>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden lg:block w-72 h-44 overflow-hidden brochure-card shadow-2xl relative group"
          >
             <SafeImage 
               src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80&auto=format&fit=crop" 
               className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
               alt="Strategic Team Collaboration" 
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-blue-accent/10 mix-blend-multiply" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* CLARIFY Framework */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-7 md:p-10 lg:p-12 section-border shadow-2xl flex flex-col group/card"
          >
            <div className="mb-10 flex justify-between items-start">
              <div>
                <span className="font-mono text-muted text-[10px] uppercase tracking-[0.25em]">The Framework / Clarity</span>
                <h2 className="text-4xl mt-2 text-navy">C.L.A.R.I.F.Y</h2>
              </div>
              <div className="w-12 h-12 rounded-full border border-navy/20 flex items-center justify-center text-blue-accent/80 group-hover/card:text-blue-accent group-hover/card:border-blue-accent transition-all duration-500">
                <Target size={24} />
              </div>
            </div>
            
            <div className="space-y-6">
              {clarifyData.map((row, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="flex gap-6 items-start group"
                >
                  <span className="font-black text-2xl text-blue-accent w-8 shrink-0 transition-transform group-hover:scale-125">{row.L}</span>
                  <div className="border-b border-gray-100 pb-4 flex-1">
                    <div className="font-bold uppercase text-[13px] text-navy group-hover:text-blue-accent transition-colors">
                      {row.name}
                    </div>
                    <p className="text-[11px] text-muted mt-1 font-medium italic opacity-80">{row.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-10">
              <motion.div 
                whileHover={{ x: 5 }}
                className="bg-off-white p-6 border-l-4 border-navy relative overflow-hidden group/stats"
              >
                <SafeImage 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80&auto=format&fit=crop" 
                  className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover/stats:opacity-30 transition-opacity duration-700" 
                  alt="Analytics" 
                  referrerPolicy="no-referrer"
                />
                <p className="text-[11px] font-mono uppercase tracking-widest text-muted mb-2 relative z-10">Impact Track</p>
                <div className="flex justify-between items-end relative z-10">
                  <span className="text-4xl font-black text-navy">120+</span>
                  <span className="text-[10px] font-bold uppercase text-navy mb-1">Brands Built</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* BRANDS Framework */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-navy p-7 md:p-10 lg:p-12 brochure-card text-white flex flex-col group/card relative overflow-hidden"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
               <SafeImage src="https://images.unsplash.com/photo-1614854262318-831d8231b110?w=1200&q=80&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>

            <div className="mb-10 flex justify-between items-start relative z-10">
              <div>
                <span className="font-mono text-blue-accent/60 text-[10px] uppercase tracking-[0.25em]">The Framework / Perception</span>
                <h2 className="text-4xl mt-2 text-white">B.R.A.N.D.S</h2>
              </div>
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover/card:text-blue-accent group-hover/card:border-blue-accent transition-all duration-500">
                <Globe size={24} />
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              {brandsData.map((row, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="py-1 grid grid-cols-12 items-center gap-4 group"
                >
                  <span className="col-span-1 font-black text-2xl text-white/60 transition-all group-hover:text-blue-accent">{row.L}</span>
                  <div className="col-span-11 flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/20 pb-4">
                    <span className="font-bold text-white text-lg group-hover:translate-x-2 transition-transform">{row.name}</span>
                    <span className="text-white/80 text-[10px] font-mono uppercase tracking-wider sm:text-right">{row.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="mt-auto pt-10 text-sm italic text-white/60 relative z-10">
              "Authority is built through consistent transformation, not just creative."
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

import { Target, Globe } from 'lucide-react';
