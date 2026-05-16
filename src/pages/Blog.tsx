import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useSite } from '../lib/siteContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SafeImage from '../components/SafeImage';

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  excerpt: string;
  date: string;
  img?: string;
  slug: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'blogs'));
    return () => unsub();
  }, []);

  return (
    <main className="bg-navy min-h-screen text-white">
      <Navbar />
      
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 md:mb-14">
            <span className="font-mono text-blue-accent text-xs uppercase tracking-[0.5em] block mb-4">// Intelligence // Archive</span>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">Insights & <span className="italic text-white/60">Strategy.</span></h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 md:py-28 border border-white/5 bg-white/5 rounded-3xl">
              <p className="text-white/40 font-mono uppercase tracking-widest italic">No insights published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {blogs.map((blog) => (
                <motion.article 
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[16/10] overflow-hidden mb-6 rounded-2xl brochure-card border border-white/5">
                    <SafeImage
                      src={blog.img || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"} 
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/0 transition-colors" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[9px] text-blue-accent uppercase tracking-widest">{blog.date}</span>
                      <div className="h-[1px] w-8 bg-white/10" />
                      <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">By {blog.author}</span>
                    </div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight group-hover:text-blue-accent transition-colors leading-tight">
                      {blog.title}
                    </h3>
                    <p className="text-white/60 text-sm italic leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <button className="text-xs font-mono uppercase tracking-[0.2em] text-blue-accent flex items-center gap-2 group/btn">
                      Read Intelligence <span>→</span>
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
