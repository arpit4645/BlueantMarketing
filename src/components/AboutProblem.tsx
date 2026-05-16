import React from 'react';
import { motion } from 'motion/react';
import { useSite } from '../lib/siteContext';
import SafeImage from './SafeImage';

export default function AboutProblem() {
  const { settings } = useSite();

  const aboutQuote = settings.aboutQuote || "At BlueAnt, we don't just offer marketing services. We build strategic growth ecosystems for businesses.";
  const aboutText = settings.aboutText || "In a world where thousands of brands fight for attention, we help you own a position, not chase customers.";
  const aboutCombines = settings.aboutCombines && settings.aboutCombines.length > 0 
    ? settings.aboutCombines 
    : ["Strategic thinking", "Brand psychology", "Growth systems", "Execution frameworks"];

  const problemHeadline = settings.problemHeadline || "Most businesses don't fail because of lack of effort. They fail because of lack of clarity and strategy.";
  const problemSub = settings.problemSub || "As research shows, majority of businesses struggle due to clutter, lack of differentiation, and weak strategy.";
  
  const problemPills = settings.problemPills && settings.problemPills.length > 0
    ? settings.problemPills
    : ["Too many tactics, no direction", "Marketing without positioning", "Sales without trust", "Growth without systems"];

  const strategyHeadline = settings.strategyHeadline || "STRATEGY IS THE ONLY UNFAIR ADVANTAGE.";
  return (
    <section className="py-16 md:py-20 lg:py-24 px-5 md:px-6 bg-off-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Card - About */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-navy p-7 md:p-10 lg:p-12 brochure-card text-white flex flex-col justify-between shadow-2xl"
          >
            <div>
              <h2 className="text-5xl font-black italic tracking-tighter mb-8 text-white opacity-90 uppercase">BLUEANT</h2>
              <blockquote className="text-2xl font-medium leading-[1.3] mb-8 italic">
                "{aboutQuote}"
              </blockquote>
              <p className="text-white/80 mb-12 max-w-md text-lg leading-relaxed">
                {aboutText}
              </p>
              
              <div className="space-y-6">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-blue-accent font-bold">WE COMBINE:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                  {aboutCombines.map((item: any, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span className="w-2 h-2 rounded-full bg-blue-accent shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <p className="mt-12 italic text-white/50 text-sm">
              // Transform businesses into industry leaders — not participants.
            </p>
          </motion.div>

          {/* Right Card - Problem */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-7 md:p-10 lg:p-12 border border-navy/5 shadow-2xl flex flex-col brochure-card"
          >
            <div className="flex items-center gap-4 mb-8">
               <span className="w-8 h-px bg-navy/20" />
               <h2 className="text-xs font-mono uppercase tracking-[0.5em] text-navy/40 font-bold">THE PROBLEM</h2>
               <span className="w-8 h-px bg-navy/20" />
            </div>
            
            <p className="text-2xl text-navy font-black leading-tight mb-12 uppercase tracking-tighter">
              {problemHeadline}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {problemPills.map((pill: any, i: number) => (
                <div key={i} className="bg-navy p-5 text-white text-[10px] font-mono uppercase tracking-widest leading-relaxed flex items-center justify-center text-center font-bold shadow-lg">
                  {pill}
                </div>
              ))}
            </div>

            <p className="mt-auto pt-12 text-muted text-sm border-t border-navy/5">
              As research shows, majority of businesses struggle due to clutter, lack of differentiation, and weak strategy.
            </p>
          </motion.div>
        </div>

        {/* Image Collage */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <h3 className="text-5xl lg:text-7xl leading-[0.85] text-navy font-black uppercase tracking-tighter">
              {strategyHeadline.includes(' ') ? strategyHeadline.split(' ').map((w: string, i: number) => i === 3 ? <span key={i} className="italic text-navy/30 block lg:inline">{w} </span> : w + ' ') : strategyHeadline}
            </h3>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <SafeImage
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80&auto=format&fit=crop" 
                alt="Strategy session" 
                referrerPolicy="no-referrer"
                className="w-full aspect-[3/4] object-cover contrast-[1.05] group-hover:scale-105 transition-all duration-700"
              />
              <SafeImage
                src="https://images.unsplash.com/photo-1556761175-2f8b1b0e1d0d?w=900&q=80&auto=format&fit=crop" 
                alt="Team meeting" 
                referrerPolicy="no-referrer"
                className="w-full aspect-square object-cover contrast-[1.05] group-hover:scale-105 transition-all duration-700"
              />
            </div>
            <div className="pt-12">
              <SafeImage
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80&auto=format&fit=crop" 
                alt="Collaboration" 
                referrerPolicy="no-referrer"
                className="w-full aspect-[2/3] object-cover contrast-[1.05] group-hover:scale-105 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
