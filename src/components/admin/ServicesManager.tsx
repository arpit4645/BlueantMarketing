import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Edit2, Save, X, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

interface Service {
  id?: string;
  num: string;
  title: string;
  desc: string;
  tags: string[];
  order: number;
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Service>({ num: '', title: '', desc: '', tags: [], order: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'services'));
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), form as any);
        toast.success('Service updated');
      } else {
        await addDoc(collection(db, 'services'), { ...form, order: services.length } as any);
        toast.success('Service added');
      }
      resetForm();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'services');
      toast.error('Failed to save service');
    }
  };

  const addTag = () => {
    if (!newTag) return;
    setForm({ ...form, tags: [...form.tags, newTag] });
    setNewTag('');
  };

  const removeTag = (idx: number) => {
    setForm({ ...form, tags: form.tags.filter((_, i) => i !== idx) });
  };

  const deleteService = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      toast.success('Service deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
    }
  };

  const resetForm = () => {
    setForm({ num: '', title: '', desc: '', tags: [], order: 0 });
    setEditingId(null);
    setIsAdding(false);
  };

  if (loading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-blue-accent border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-navy mb-1">Service Offerings</h2>
          <p className="text-navy/40 font-mono text-[10px] uppercase tracking-widest">Manage methodology steps</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-navy/90 transition-all shadow-lg active:scale-95"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {isAdding && (
        <div className="mb-12 bg-white p-8 rounded-2xl border border-navy/5 shadow-xl">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                   <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Number ID</label>
                   <input required value={form.num} onChange={e => setForm({...form, num: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" placeholder="01" />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Title</label>
                   <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" placeholder="Diagnostic Audit" />
                 </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Description</label>
                <textarea required value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent min-h-[80px]" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                   {form.tags.map((tag, i) => (
                     <span key={i} className="bg-blue-accent/10 text-blue-accent px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-2">
                       {tag} <button type="button" onClick={() => removeTag(i)}><X size={10}/></button>
                     </span>
                   ))}
                </div>
                <div className="flex gap-2">
                  <input value={newTag} onChange={e => setNewTag(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" placeholder="Add tag..." />
                  <button type="button" onClick={addTag} className="bg-navy text-white px-4 rounded-lg uppercase tracking-widest text-[10px] font-bold">Add</button>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-accent text-white p-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-accent/90 transition-all flex items-center justify-center gap-2">
                  <Save size={16} /> {editingId ? 'Update Service' : 'Create Service'}
                </button>
                <button type="button" onClick={resetForm} className="bg-navy/10 text-navy px-8 rounded-xl uppercase tracking-widest text-[10px] font-bold">Cancel</button>
              </div>
           </form>
        </div>
      )}

      <div className="space-y-4">
        {services.map((s) => (
          <div key={s.id} className="bg-white p-6 rounded-2xl border border-navy/5 flex items-center gap-6 group hover:shadow-lg transition-all">
             <div className="w-12 h-12 bg-navy text-white rounded-xl flex items-center justify-center font-black text-xl italic">{s.num}</div>
             <div className="flex-1">
                <h4 className="font-black uppercase tracking-tighter text-navy">{s.title}</h4>
                <p className="text-xs text-navy/60 line-clamp-1">{s.desc}</p>
             </div>
             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setForm(s); setEditingId(s.id!); setIsAdding(true); }} className="p-3 bg-navy/5 text-navy rounded-xl hover:bg-navy/10 transition-all"><Edit2 size={16} /></button>
                <button onClick={() => deleteService(s.id!)} className="p-3 bg-red-50 text-white rounded-xl hover:bg-red-600 transition-all"><Trash2 size={16} /></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
