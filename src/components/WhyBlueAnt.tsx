import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Target, Globe, BarChart3, Search, Layers, Activity } from 'lucide-react';
import SafeImage from './SafeImage';

export default function WhyBlueAnt() {
  return (
    <section id="why" className="py-20 md:py-24 lg:py-28 px-5 md:px-6 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-7 md:p-10 lg:p-14 brochure-card border-l-navy shadow-[0_40px_80px_rgba(0,0,0,0.08)] relative overflow-hidden group"
          >
            {/* Background Texture Detail */}
            <div className="absolute inset-0 opacity-10 pointer-events-none translate-x-1/2 translate-y-1/2 scale-150 rotate-12">
               <SafeImage src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80" alt="" className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 relative z-10">
              <div>
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="font-mono text-muted text-[10px] uppercase tracking-[0.4em] block mb-4"
                >
                  The Difference // 01
                </motion.span>
                <h2 className="text-5xl lg:text-7xl leading-none text-navy mb-12 font-black uppercase">
                  THE <span className="italic text-navy/50 font-black">GAP.</span>
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-navy/5">
                        <th className="py-5 font-mono text-[10px] uppercase text-muted/80 tracking-widest">Industry Baseline</th>
                        <th className="py-5 text-center"></th>
                        <th className="py-5 font-mono text-[10px] uppercase text-navy/80 tracking-widest pl-8">BlueAnt Transformation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/5">
                      {[
                        { from: "An agency vendor", to: "Strategic growth partner" },
                        { from: "Tactics & ads", to: "Complete architecture" },
                        { from: "Temporary vanity", to: "Long-term positioning" },
                        { from: "Broken execution", to: "Integrated operating rhythm" },
                      ].map((row, i) => (
                        <motion.tr 
                          key={i} 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + (i * 0.1) }}
                          className="group/row"
                        >
                          <td className="py-6 text-muted transition-colors group-hover/row:text-navy group-hover/row:translate-x-1 duration-300 italic">{row.from}</td>
                          <td className="py-6 text-center">
                            <motion.div
                              variants={{
                                initial: { x: 0, opacity: 0.3 },
                                hover: { x: 8, opacity: 1, scale: 1.2 }
                              }}
                              initial="initial"
                              whileHover="hover"
                              className="flex justify-center text-blue-accent"
                            >
                              <ArrowRight size={18} />
                            </motion.div>
                          </td>
                          <td className="py-6 font-black text-navy pl-8 group-hover/row:text-blue-accent group-hover/row:translate-x-2 transition-all duration-300 uppercase tracking-tight">{row.to}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pb-4">
                {[
                  { label: "Edge 01", text: "Strategy-driven approach", icon: Target, img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop" },
                  { label: "Edge 02", text: "Deep SME understanding", icon: Search, img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80&auto=format&fit=crop" },
                  { label: "Edge 03", text: "Global brand frameworks", icon: Layers, img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80&auto=format&fit=crop" },
                  { label: "Edge 04", text: "Execution-first focus", icon: Activity, img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80&auto=format&fit=crop" },
                ].map((edge, i) => (
                  <motion.div 
                    key={i} 
                    initial="initial"
                    whileHover="hover"
                    viewport={{ once: true }}
                    variants={{
                      initial: { y: 0 },
                      hover: { y: -10 }
                    }}
                    className="bg-navy p-6 flex flex-col justify-between aspect-square group relative overflow-hidden transition-all duration-500 hover:bg-navy-2 cursor-pointer border border-white/5 border-l-4 border-l-blue-accent/20 hover:border-l-blue-accent shadow-xl"
                  >
                    {/* Background Imagery with Dynamic Overlay */}
                    <div className="absolute inset-0 z-0">
                        <SafeImage 
                        variants={{
                          initial: { scale: 1, opacity: 0.25 },
                          hover: { scale: 1.1, opacity: 0.45 }
                        }}
                        transition={{ duration: 0.8 }}
                        src={edge.img} 
                        alt="" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/20 transition-colors" />
                    </div>
  
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[10px] text-white/70 group-hover:text-white/90 transition-colors tracking-widest uppercase">{edge.label}</span>
                        <motion.div
                          variants={{
                            initial: { scale: 1, opacity: 0.5, rotate: 0, color: '#ffffff' },
                            hover: { scale: 1.25, opacity: 1, rotate: 12, color: '#4A90D9' }
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          className="shrink-0"
                        >
                          <edge.icon size={32} />
                        </motion.div>
                      </div>
                      <p className="text-white font-black text-lg leading-tight uppercase group-hover:translate-x-1 group-hover:text-blue-accent transition-all duration-300">
                        {edge.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
        </motion.div>

        {/* Process Strip with Enhanced Interaction */}
        <div className="mt-8 md:mt-10 bg-navy grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5 shadow-2xl relative z-10 overflow-hidden">
          {[
            { n: "01", t: "Diagnose problems", s: "Surface what's broken beneath the superficial symptoms", img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&q=80" },
            { n: "02", t: "Define brand", s: "Absolute clarity on who you are and why you win", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&q=80" },
            { n: "03", t: "Positioning", s: "Own a space in your category. Stop competing.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80" },
            { n: "04", t: "Scale Systems", s: "Repeatable growth operations that compound daily.", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80" },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="p-10 group hover:bg-navy-2 transition-all relative overflow-hidden cursor-default"
            >
              {/* Subtle hover image reveal */}
              <div className="absolute inset-0 opacity-[0.1] group-hover:opacity-[0.3] transition-opacity duration-700 pointer-events-none">
                 <SafeImage src={item.img} alt="" className="w-full h-full object-cover" />
              </div>

              <span className="text-blue-accent font-black text-4xl mb-6 block group-hover:-translate-y-2 transition-transform duration-500 opacity-60 group-hover:opacity-100">{item.n}</span>
              <h4 className="text-white font-black text-lg mb-3 uppercase tracking-tight relative z-10">{item.t}</h4>
              <p className="text-white/70 text-xs leading-relaxed italic relative z-10 transition-colors group-hover:text-white/90">{item.s}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
