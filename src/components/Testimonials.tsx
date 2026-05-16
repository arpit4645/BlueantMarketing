import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import SafeImage from './SafeImage';

interface Testimonial {
  id?: string;
  name?: string; // Fallback for author
  author?: string;
  role: string;
  quote: string;
  img: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'testimonials'));
    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
      }
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'testimonials'));
    return () => unsub();
  }, []);

  const defaultTestimonials = [
    {
      name: "Riya Malhotra",
      role: "Founder, Noor Industries",
      quote: "BlueAnt didn't rebrand us. They redefined us. We stopped competing on price three months in.",
      img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&q=80&auto=format&fit=crop"
    },
    {
      name: "Arjun Kapoor",
      role: "CEO, Meridian Works",
      quote: "The CLARIFY framework gave our team a shared vocabulary. Marketing, sales and product were solving the same problem.",
      img: "https://images.unsplash.com/photo-1544168190-79c17527004f?w=400&q=80&auto=format&fit=crop"
    },
    {
      name: "Saanvi Verma",
      role: "Co-founder, Saffron & Sage",
      quote: "We came looking for ads. They sent us back to positioning — and now we're the brand our category quotes.",
      img: "https://images.unsplash.com/photo-1594744803329-e58b1368214d?w=400&q=80&auto=format&fit=crop"
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section className="py-20 md:py-24 lg:py-28 px-5 md:px-6 bg-navy relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/[0.03] -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-10 md:mb-14">
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-mono text-blue-accent/80 text-[11px] uppercase tracking-[0.4em] block mb-4"
          >
            Proof // Transformation
          </motion.span>
          <h2 className="text-clamp-section leading-[0.85] text-white font-black uppercase tracking-tighter">
            THE STRATEGY <br/><span className="heading-italic italic text-white/70 font-black">IMPACT.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {displayTestimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="bg-navy-2 border border-white/5 p-7 md:p-9 lg:p-10 brochure-card relative group hover:bg-navy-3 transition-all duration-500 shadow-2xl"
            >
              {/* Image Background Quote Reveal */}
              <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-[0.1] transition-opacity duration-1000 pointer-events-none">
                 <SafeImage src={t.img} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="relative">
                    <SafeImage src={t.img} alt={t.author || t.name} className="w-16 h-16 rounded-full object-cover brightness-125 group-hover:scale-110 transition-all duration-700 border border-white/10" />
                    <div className="absolute -inset-2 border border-blue-accent/20 rounded-full group-hover:scale-110 group-hover:border-blue-accent/50 transition-all duration-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-tight text-lg">{t.author || t.name}</h4>
                    <p className="text-blue-accent/80 text-[10px] font-mono uppercase tracking-[0.2em]">{t.role}</p>
                  </div>
                </div>
                <blockquote className="text-white/90 text-xl leading-relaxed italic relative">
                   <span className="text-4xl text-blue-accent/50 absolute -left-6 -top-4 font-serif">"</span>
                   {t.quote}
                </blockquote>
                
                <div className="mt-10 h-[1px] w-8 bg-blue-accent/40 group-hover:w-full transition-all duration-1000" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
