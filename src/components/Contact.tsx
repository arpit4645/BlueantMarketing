import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useSite } from '../lib/siteContext';

const BLUEANT_BRIEF_EMAIL = 'blueant2026@gmail.com';

function buildBriefEmailUrl({
  firstName,
  lastName,
  phone,
  email,
  budget,
  message,
  services,
}: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  budget: string;
  message: string;
  services: string[];
}) {
  const fullName = `${firstName} ${lastName}`.trim();
  const serviceList = services.length > 0 ? services.join(', ') : 'General Enquiry';
  const subject = `BlueAnt Strategy Brief - ${fullName || 'New Lead'}`;
  const body = [
    'BLUEANT STRATEGY BRIEF',
    '',
    `Name: ${fullName || 'Not provided'}`,
    `Email: ${email || 'Not provided'}`,
    `Phone: ${phone || 'Not provided'}`,
    `Selected Services: ${serviceList}`,
    `Budget Range: ${budget || 'Not Specified'}`,
    '',
    'Goals / Business Dynamics:',
    message || 'Not provided',
    '',
    'Submitted from the BlueAnt website contact form.',
  ].join('\n');

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(BLUEANT_BRIEF_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Contact() {
  const { settings } = useSite();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('submitting');
    
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const budget = formData.get('budget') as string;
    const message = formData.get('message') as string;
    
    // Services
    const services: string[] = [];
    e.currentTarget.querySelectorAll('input[type="checkbox"]:checked').forEach((el) => {
      const parent = el.closest('label');
      if (parent) {
        const span = parent.querySelector('span');
        if (span) services.push(span.textContent || '');
      }
    });

    const gmailUrl = buildBriefEmailUrl({
      firstName,
      lastName,
      phone,
      email,
      budget,
      message,
      services,
    });
    const gmailWindow = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    if (!gmailWindow) {
      window.location.href = gmailUrl;
      return;
    }

    try {
      const leadsRef = collection(db, 'leads');
      await addDoc(leadsRef, {
        firstName,
        lastName,
        email,
        phone,
        service: services.join(', ') || 'General Enquiry',
        budget: budget || 'Not Specified',
        message,
        status: 'New',
        score: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        tags: [],
        notes: ''
      });
      setFormState('success');
    } catch (error) {
      console.error('Submit error:', error);
      setFormState('success');
      try {
        handleFirestoreError(error, OperationType.WRITE, 'leads');
      } catch (e) {
        // Error handled in utility
      }
    }
  };

  if (formState === 'success') {
    return (
      <section id="contact" className="py-20 md:py-24 lg:py-28 px-5 md:px-6 bg-off-white relative overflow-hidden flex items-center justify-center min-h-[620px]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-xl bg-white p-16 shadow-2xl brochure-card border border-navy/5"
        >
          <div className="w-24 h-24 bg-blue-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} className="text-blue-accent" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-navy mb-6">Brief Prepared.</h2>
          <p className="text-muted text-lg italic leading-relaxed mb-10">
            Gmail has opened with your formatted brief addressed to BlueAnt. Review it once, then send it from your Gmail account.
          </p>
          <button 
            onClick={() => setFormState('idle')}
            className="bg-navy text-white font-black uppercase tracking-widest px-8 py-4 hover:bg-blue-accent transition-colors"
          >
            Send another brief
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 md:py-24 lg:py-28 px-5 md:px-6 bg-off-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Left Info Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-navy p-7 md:p-10 lg:p-12 brochure-card text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl"
          >
             {/* Background Detail */}
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <div className="w-32 h-32 border-[1px] border-white rounded-full group-hover:scale-125 transition-transform duration-1000" />
             </div>

            <div className="relative z-10">
              <span className="font-mono text-blue-accent text-[10px] uppercase tracking-[0.4em] mb-10 block">Contact // Collaboration</span>
              <h2 className="text-5xl md:text-6xl font-black leading-[0.85] mb-10 uppercase tracking-tighter">
                READY TO <br/>
                <span className="heading-italic italic text-white/60 font-black">START?</span>
              </h2>
              <p className="text-white/80 mb-16 max-w-sm text-lg italic leading-relaxed">
                Drop us a note — your business, where you're stuck, what you want to be true in 12 months.
              </p>
              
              <div className="space-y-8 mb-16">
                <div className="group/item">
                  <p className="text-[9px] font-mono uppercase text-white/60 tracking-widest mb-2 transition-colors group-hover/item:text-blue-accent">Direct Email</p>
                  <a href={`mailto:${settings.contactEmail || BLUEANT_BRIEF_EMAIL}`} className="text-2xl font-black hover:text-blue-accent transition-colors tracking-tight">{settings.contactEmail || BLUEANT_BRIEF_EMAIL}</a>
                </div>
                <div className="group/item">
                  <p className="text-[9px] font-mono uppercase text-white/60 tracking-widest mb-2 transition-colors group-hover/item:text-blue-accent">HQ Phone</p>
                  <a href={`tel:${settings.contactPhone?.replace(/\s/g, '') || '+919999000000'}`} className="text-2xl font-black hover:text-blue-accent transition-colors tracking-tight">{settings.contactPhone || '+91 99990 00000'}</a>
                </div>
              </div>
            </div>

              <div className="grid grid-cols-2 gap-y-8 pt-12 border-t border-white/10 relative z-10">
                {[
                  { l: "HQ Location", v: "Bengaluru IN" },
                  { l: "Studio Hours", v: "Mon–Fri // 10–7 IST" },
                  { l: "SLA Response", v: "Within 48hrs" },
                  { l: "Availability", v: settings.availability || "Q3 2024 // 2 Slots" },
                ].map((item, i) => (
                <div key={i}>
                  <p className="text-[9px] font-mono uppercase text-white/60 tracking-tighter mb-1">{item.l}</p>
                  <p className="text-[11px] font-black text-white uppercase tracking-tight">{item.v}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Lead Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-7 md:p-10 lg:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-navy/5 relative group"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono uppercase text-muted/80 tracking-[0.2em] font-black">First Name // *</label>
                  <input name="firstName" type="text" required placeholder="John" className="w-full bg-off-white p-4 border-b border-transparent focus:border-blue-accent focus:bg-white transition-all outline-none font-bold text-navy placeholder:text-muted/60" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono uppercase text-muted/80 tracking-[0.2em] font-black">Last Name // *</label>
                  <input name="lastName" type="text" required placeholder="Doe" className="w-full bg-off-white p-4 border-b border-transparent focus:border-blue-accent focus:bg-white transition-all outline-none font-bold text-navy placeholder:text-muted/60" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono uppercase text-muted tracking-[0.2em] font-black">Contact // *</label>
                  <input name="phone" type="tel" required placeholder="+91 00000 00000" className="w-full bg-off-white p-4 border-b border-transparent focus:border-blue-accent focus:bg-white transition-all outline-none font-bold text-navy placeholder:text-muted/30" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono uppercase text-muted tracking-[0.2em] font-black">Email // *</label>
                  <input name="email" type="email" required placeholder="john@company.com" className="w-full bg-off-white p-4 border-b border-transparent focus:border-blue-accent focus:bg-white transition-all outline-none font-bold text-navy placeholder:text-muted/30" />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[9px] font-mono uppercase text-muted tracking-[0.2em] font-black block border-b border-navy/5 pb-3">Selected Services</label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {["Brand Strategy", "Brand Identity", "Website Design", "Growth Systems", "CMO as a Service", "Full Transformation"].map((service) => (
                    <label key={service} className="flex items-center gap-3 cursor-pointer group/check">
                      <div className="relative flex items-center justify-center">
                         <input type="checkbox" className="peer appearance-none w-5 h-5 border border-navy/10 rounded-sm checked:bg-navy checked:border-navy transition-all" />
                         <span className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity">✓</span>
                      </div>
                      <span className="text-[11px] font-black uppercase text-navy/70 peer-checked:text-navy transition-colors">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <label className="text-[9px] font-mono uppercase text-muted/80 tracking-[0.2em] font-black block border-b border-navy/5 pb-3">Budget Range</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Starter (<₹5L)", 
                    "Growth (₹5L–15L)", 
                    "Scale (₹15L–50L)", 
                    "Enterprise (₹50L+)"
                  ].map((budget) => (
                    <label key={budget} className="flex items-center gap-3 cursor-pointer group/radio">
                      <div className="relative flex items-center justify-center">
                         <input name="budget" value={budget} type="radio" className="peer appearance-none w-5 h-5 border border-navy/10 rounded-full checked:border-[5px] checked:border-blue-accent transition-all" />
                      </div>
                      <span className="text-[11px] font-black uppercase text-navy/70 peer-checked:text-navy transition-colors">{budget}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-[9px] font-mono uppercase text-muted tracking-[0.2em] font-black">Goals // Business Dynamics</label>
                <textarea name="message" rows={4} placeholder="Where are you now, and where do you want to be?" className="w-full bg-off-white p-4 border-b border-transparent focus:border-blue-accent focus:bg-white transition-all outline-none resize-none font-bold text-navy placeholder:text-muted/30" />
              </div>

              <button 
                disabled={formState === 'submitting'}
                className="w-full bg-navy text-white font-black uppercase tracking-[0.3em] py-6 hover:bg-blue-accent hover:-translate-y-1 transition-all duration-500 shadow-2xl btn-geometric flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {formState === 'submitting' ? (
                  <>
                    <Loader2 className="animate-spin" />
                    PROCESSING BRIEF...
                  </>
                ) : (
                  <>SEND BRIEF →</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
