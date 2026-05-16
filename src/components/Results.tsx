import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import SafeImage from './SafeImage';

interface Result {
  id?: string;
  title: string;
  desc: string;
  img: string;
  order: number;
}

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string, key?: any }) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useSpring(0, { stiffness: 150, damping: 20 });
  const y = useSpring(0, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

export default function Results() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'results'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Result)));
      }
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'results'));
    return () => unsub();
  }, []);

  const defaultResults = [
    { title: "Clear brand identity", desc: "Know exactly who you are, who you serve, and why they should care.", img: "https://images.unsplash.com/photo-1558403194-611308249627?w=800&q=80&auto=format&fit=crop" },
    { title: "Strong market positioning", desc: "Own a defensible space — not a seat at the commodity table.", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80&auto=format&fit=crop" },
    { title: "Consistent lead generation", desc: "A funnel that works without you refreshing dashboards.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop" },
    { title: "Higher conversion rates", desc: "When positioning is right, sales stops being a hard conversation.", img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80&auto=format&fit=crop" },
    { title: "Premium pricing power", desc: "Charge for the outcome, not the hour. Brand = price elasticity.", img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&auto=format&fit=crop" },
    { title: "Loyal customer base", desc: "Customers become advocates. Advocates become your best channel.", img: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=900&q=80&auto=format&fit=crop" },
  ];

  const displayResults = results.length > 0 ? results : defaultResults;

  if (loading && results.length === 0) return null;

  return (
    <section className="py-20 md:py-24 lg:py-28 px-5 md:px-6 bg-cream perspective-1000 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-10 md:mb-14">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted/80">Outcomes // 12 Months</span>
          <h2 className="text-clamp-section leading-[0.85] text-navy font-black tracking-tight uppercase">EXPECTED <br/><span className="heading-italic italic text-navy/70">RESULTS</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayResults.map((res, i) => (
            <TiltCard 
              key={i}
              className="bg-white p-7 md:p-9 lg:p-10 hover:bg-navy group transition-all duration-700 shadow-xl cursor-default relative overflow-hidden brochure-card"
            >
              {/* Card Imagery Overlay */}
              <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-80 transition-opacity duration-1000">
                 <SafeImage src={res.img} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="relative z-10">
                <span className="text-5xl font-black text-navy/60 group-hover:text-blue-accent/80 mb-8 block transition-colors duration-500">0{i + 1}</span>
                <h3 className="text-2xl font-black uppercase text-navy group-hover:text-white mb-6 transition-colors duration-500 leading-tight">{res.title}</h3>
                <p className="text-muted group-hover:text-white/90 transition-colors duration-500 leading-relaxed italic font-medium">
                  {res.desc}
                </p>
                
                <div className="mt-10 h-[2px] w-0 bg-blue-accent group-hover:w-full transition-all duration-700" />
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

