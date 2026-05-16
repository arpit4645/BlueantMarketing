import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, ArrowRight, Activity, Zap, Shield, Target, Award } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import SafeImage from './SafeImage';

interface Service {
  id?: string;
  num: string;
  title: string;
  desc: string;
  tags: string[];
  order: number;
}

const iconMap: Record<string, React.ReactNode> = {
  'Target': <Target className="w-5 h-5" />,
  'Zap': <Zap className="w-5 h-5" />,
  'Activity': <Activity className="w-5 h-5" />,
  'Shield': <Shield className="w-5 h-5" />,
};

const defaultPhases = [
  {
    num: "01",
    title: "Clarity & Strategy",
    subtitle: "(From confusion → direction)",
    items: ["Brand Clarity & Positioning", "Business Strategy Blueprint", "Customer Understanding", "Value Proposition Design"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop" ,
    icon: iconMap['Target']
  },
  {
    num: "02",
    title: "Brand Building",
    subtitle: "(From invisible → irresistible)",
    items: ["Brand Identity System", "Brand Messaging & Story", "Brand Persona Development", "Communication Framework"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop" ,
    icon: iconMap['Zap']
  },
  {
    num: "03",
    title: "Growth & Marketing System",
    subtitle: "(From random → predictable)",
    items: ["Marketing Strategy", "Funnel Design", "Lead Generation Systems", "Content Strategy"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop" ,
    icon: iconMap['Activity']
  },
  {
    num: "04",
    title: "Scale & Systemization",
    subtitle: "(From effort → automation)",
    items: ["SOPs & Systems", "Team Alignment", "CRM & Automation", "Performance Tracking"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&auto=format&fit=crop" ,
    icon: iconMap['Shield']
  }
];

export default function Services() {
  const [openPhase, setOpenPhase] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setServices(snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            subtitle: data.desc?.length > 100 ? data.desc.substring(0, 100) + '...' : data.desc,
            items: data.tags || [],
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&auto=format&fit=crop", // Default placeholder
            icon: iconMap['Zap'] // Default icon
          };
        }));
      }
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'services'));
    return () => unsub();
  }, []);

  const phases = services.length > 0 ? services : defaultPhases;

  return (
    <section id="services" className="py-20 md:py-24 lg:py-28 px-5 md:px-6 bg-navy text-white relative overflow-hidden">
      {/* Advanced Graphics: Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-accent/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      {/* Mesh Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
      />

      {/* Dynamic Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={openPhase ?? 'none'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none opacity-40 grayscale-0 contrast-100"
        >
          <SafeImage 
            src={openPhase !== null ? phases[openPhase].image : "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80&auto=format&fit=crop"} 
            alt="" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-navy/60 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="sticky top-32"
            >
              <h2 className="text-clamp-section leading-[0.85] mb-8 font-black uppercase tracking-tighter">
                OUR <span className="italic text-blue-accent/90">SERVICES.</span>
              </h2>
              <div className="border-l-2 border-blue-accent/40 pl-6 mb-12">
                <p className="text-white/90 max-w-sm text-lg italic leading-relaxed">
                  A comprehensive operating rhythm for high-growth businesses. From strategic clarity to automated scale.
                </p>
              </div>
              
              {/* Vertical Stepper */}
              <div className="hidden lg:flex flex-col gap-5">
                {phases.map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <motion.div 
                      animate={{ 
                        width: openPhase === i ? 40 : 8,
                        backgroundColor: openPhase === i ? '#3B82F6' : 'rgba(255,255,255,0.2)'
                      }}
                      className="h-1 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                    />
                    <span className={cn(
                      "text-[10px] font-mono tracking-[0.3em] uppercase transition-all duration-300", 
                      openPhase === i ? "text-blue-accent font-bold scale-110" : "text-white/40"
                    )}>
                      Phase 0{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-5 md:gap-6">
            {phases.map((phase, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "border-b border-white/10 transition-all duration-700 relative group",
                  openPhase === i ? "pb-8 bg-white p-6 md:p-8 lg:p-10 rounded-2xl border-white/20 shadow-2xl text-navy" : "pb-5 hover:bg-white/[0.01]"
                )}
              >
                {/* Active Indicator Bar */}
                {openPhase === i && (
                  <motion.div 
                    layoutId="activeBar"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-blue-accent rounded-full"
                  />
                )}

                <button 
                  onClick={() => setOpenPhase(openPhase === i ? null : i)}
                  className="w-full flex items-center justify-between text-left relative z-10"
                >
                  <div className="flex items-center gap-8">
                    <div className={cn(
                      "w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-500",
                      openPhase === i ? "bg-navy border-navy text-white rotate-12" : "bg-white/5 border-white/10 text-white/50"
                    )}>
                      {phase.icon}
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-2xl md:text-3xl font-bold uppercase tracking-tight flex flex-col md:flex-row md:items-center gap-4 transition-colors",
                        openPhase === i ? "text-navy" : "text-white"
                      )}>
                        {phase.title}
                      </h3>
                      <AnimatePresence>
                        {openPhase !== i && (
                          <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            className="text-[10px] font-mono uppercase tracking-[0.3em] text-white block mt-1"
                          >
                            {phase.subtitle}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <motion.div 
                    animate={{ 
                      rotate: openPhase === i ? 180 : 0,
                      backgroundColor: openPhase === i ? "#0D1B3E" : "transparent"
                    }}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500"
                  >
                    {openPhase === i ? <Minus size={18} className="text-white" /> : <Plus size={18} />}
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openPhase === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-8 md:pl-16 flex flex-col md:flex-row gap-8">
                        <div className="flex-1 grid grid-cols-1 gap-y-5">
                          {phase.items.map((item, ii) => (
                            <motion.div 
                              key={ii} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + (ii * 0.08) }}
                              className="flex items-center gap-5 group/item"
                            >
                              <div className="w-1.5 h-1.5 bg-blue-accent rounded-full shrink-0 shadow-[0_0_15px_#3B82F6] group-hover/item:scale-150 transition-transform" />
                              <span className="text-lg md:text-xl font-medium text-black tracking-tight italic opacity-90 hover:opacity-100 transition-all">
                                {item}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                        
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8, x: 20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                          className="w-full md:w-80 h-56 rounded-2xl overflow-hidden brochure-card shadow-[0_20px_50px_rgba(0,0,0,0.5)] shrink-0 border border-white/10"
                        >
                          <SafeImage 
                            src={phase.image} 
                            alt={phase.title}
                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-navy/20 mix-blend-overlay" />
                        </motion.div>
                      </div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-10 md:pl-16 flex flex-col md:flex-row items-center gap-6"
                      >
                         <button className={cn(
                           "px-10 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 shadow-xl whitespace-nowrap",
                           openPhase === i ? "bg-navy text-white hover:bg-blue-accent" : "bg-white text-navy hover:bg-blue-accent hover:text-white"
                         )}>
                            Enquire Phase 0{i + 1}
                         </button>
                         <p className={cn(
                           "text-xs font-mono leading-relaxed max-w-xs italic transition-colors",
                           openPhase === i ? "text-navy/50" : "text-white/40"
                         )}>
                           // Expected timeline: 4-6 weeks for delivery of full {phase.title.toLowerCase()} ecosystem.
                         </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add-on Cards */}
        <div className="mt-20 md:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-7 md:p-10 lg:p-12 text-navy relative overflow-hidden group rounded-3xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] -translate-y-8 translate-x-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000 text-blue-accent">
              <Award size={256} />
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-accent/10 flex items-center justify-center text-blue-accent">
                <Shield size={20} />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-accent font-bold">Strategic Leadership</span>
            </div>
            <h3 className="text-4xl lg:text-5xl font-black mb-8 italic tracking-tighter">CMO AS A SERVICE.</h3>
            <ul className="space-y-6">
              {["Strategic leadership without the overhead", "End-to-end ownership of your brand presence", "Fully integrated growth operating rhythm"].map((item, i) => (
                <li key={i} className="text-navy flex items-start gap-4 group/li">
                   <div className="mt-1.5 w-4 h-4 rounded-full bg-blue-accent/10 flex items-center justify-center shrink-0 group-hover/li:bg-blue-accent/20 transition-colors">
                     <ArrowRight size={10} className="text-blue-accent" />
                   </div>
                   <span className="text-xl font-medium italic opacity-90 leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-3xl p-7 md:p-10 lg:p-12 border border-white/10 flex flex-col justify-between rounded-3xl relative overflow-hidden"
          >
            {/* Inner Glow */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-accent/20 blur-[60px] rounded-full -translate-x-1/2 -translate-y-1/2" />
            
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-blue-accent">
                  <Activity size={20} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-accent/80 font-bold">Engagement Formats</span>
              </div>
              <h3 className="text-4xl lg:text-5xl font-black mb-10 italic text-white tracking-tighter">CONSULTING.</h3>
              <div className="space-y-12">
                <div className="group cursor-default">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-blue-accent mb-3 transition-colors group-hover:text-white font-bold">Group Sessions / 1-Day Intensive</p>
                  <p className="text-white/90 text-lg italic border-l-2 border-white/10 pl-6 py-4 leading-relaxed bg-white/5 rounded-r-xl">Deep diagnosis, alignment workshops and strategy-led execution frameworks.</p>
                </div>
                <div className="group cursor-default">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-blue-accent mb-3 transition-colors group-hover:text-white font-bold">1:1 High-Performance Coaching</p>
                  <p className="text-white/90 text-lg italic border-l-2 border-white/10 pl-6 py-4 leading-relaxed bg-white/5 rounded-r-xl">Monthly advisory for founders and leadership on brand scaling.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
