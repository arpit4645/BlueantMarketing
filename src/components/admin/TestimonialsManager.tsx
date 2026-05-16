import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Edit2, Save, X, Quote } from 'lucide-react';
import toast from 'react-hot-toast';
import SafeImage from '../SafeImage';

interface Testimonial {
  id?: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  img: string;
}

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Testimonial>({ quote: '', author: '', role: '', company: '', img: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'testimonials'));
    const unsub = onSnapshot(q, (snapshot) => {
      setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'testimonials'));
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'testimonials', editingId), form as any);
        toast.success('Testimonial updated');
      } else {
        await addDoc(collection(db, 'testimonials'), form as any);
        toast.success('Testimonial added');
      }
      resetForm();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'testimonials');
      toast.error('Failed to save testimonial');
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      toast.success('Testimonial deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `testimonials/${id}`);
    }
  };

  const resetForm = () => {
    setForm({ quote: '', author: '', role: '', company: '', img: '' });
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (t: Testimonial) => {
    setForm(t);
    setEditingId(t.id!);
    setIsAdding(true);
  };

  if (loading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-blue-accent border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-navy mb-1">Human Proof</h2>
          <p className="text-navy/40 font-mono text-[10px] uppercase tracking-widest">Client Testimonials & Feedback</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-navy/90 transition-all shadow-lg active:scale-95"
        >
          <Plus size={16} /> Add testimonial
        </button>
      </div>

      {isAdding && (
        <div className="mb-12 bg-white p-8 rounded-2xl border border-navy/5 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black uppercase tracking-tighter text-navy">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
            <button onClick={resetForm} className="text-navy/40 hover:text-navy"><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Quote</label>
              <textarea required value={form.quote} onChange={e => setForm({...form, quote: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-4 text-sm font-bold focus:ring-2 focus:ring-blue-accent min-h-[100px]" placeholder="What did they say about the transformation?" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Author Name</label>
                  <input required value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Role / Position</label>
                  <input required value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Avatar Image URL</label>
                  <input required value={form.img} onChange={e => setForm({...form, img: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Company (Optional)</label>
                  <input value={form.company || ''} onChange={e => setForm({...form, company: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-accent text-white p-4 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-blue-accent/90 transition-all flex items-center justify-center gap-2">
              <Save size={16} /> {editingId ? 'Update Testimonial' : 'Publish Testimonial'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="group bg-white p-8 rounded-2xl border border-navy/5 shadow-sm hover:shadow-xl transition-all relative">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <SafeImage src={t.img} alt={t.author} className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                <div>
                  <h4 className="font-black uppercase tracking-tighter text-navy">{t.author}</h4>
                  <p className="text-[9px] font-mono text-blue-accent uppercase tracking-widest">{t.role} {t.company && `// ${t.company}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(t)} className="p-2 text-navy/20 hover:text-navy transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => deleteTestimonial(t.id!)} className="p-2 text-navy/20 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <blockquote className="text-navy/70 text-sm italic font-medium leading-relaxed relative pl-4 border-l-2 border-blue-accent/20">
              {t.quote}
            </blockquote>
          </div>
        ))}
      </div>
    </div>
  );
}
