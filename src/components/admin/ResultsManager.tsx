import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Edit2, Save, X, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import SafeImage from '../SafeImage';

interface Result {
  id?: string;
  title: string;
  desc: string;
  img: string;
  order: number;
}

export default function ResultsManager() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Result>({ title: '', desc: '', img: '', order: 0 });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'results'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Result)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'results'));
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'results', editingId), form as any);
        toast.success('Result updated');
      } else {
        await addDoc(collection(db, 'results'), { ...form, order: results.length } as any);
        toast.success('Result added');
      }
      resetForm();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'results');
      toast.error('Failed to save result');
    }
  };

  const deleteResult = async (id: string) => {
    if (!confirm('Are you sure you want to delete this result?')) return;
    try {
      await deleteDoc(doc(db, 'results', id));
      toast.success('Result deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `results/${id}`);
    }
  };

  const resetForm = () => {
    setForm({ title: '', desc: '', img: '', order: 0 });
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (r: Result) => {
    setForm(r);
    setEditingId(r.id!);
    setIsAdding(true);
  };

  if (loading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-blue-accent border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-navy mb-1">Expected Results</h2>
          <p className="text-navy/40 font-mono text-[10px] uppercase tracking-widest">Outcomes & Transformation Proofs</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-navy/90 transition-all shadow-lg active:scale-95"
        >
          <Plus size={16} /> Add result
        </button>
      </div>

      {isAdding && (
        <div className="mb-12 bg-white p-8 rounded-2xl border border-navy/5 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black uppercase tracking-tighter text-navy">{editingId ? 'Edit Result' : 'New Result'}</h3>
            <button onClick={resetForm} className="text-navy/40 hover:text-navy"><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Title</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Description</label>
                <textarea required value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent min-h-[100px]" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Image URL</label>
                <input required value={form.img} onChange={e => setForm({...form, img: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Display Order</label>
                <input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value)})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
              </div>
              <button type="submit" className="w-full bg-blue-accent text-white p-4 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-blue-accent/90 transition-all flex items-center justify-center gap-2">
                <Save size={16} /> {editingId ? 'Update Result' : 'Add Result'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((r) => (
          <div key={r.id} className="group bg-white rounded-2xl border border-navy/5 shadow-sm overflow-hidden hover:shadow-xl transition-all">
            <div className="aspect-video relative overflow-hidden bg-navy/10">
              <SafeImage src={r.img} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button onClick={() => startEdit(r)} className="p-3 bg-white text-navy rounded-full hover:scale-110 transition-transform"><Edit2 size={18} /></button>
                <button onClick={() => deleteResult(r.id!)} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"><Trash2 size={18} /></button>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-black uppercase tracking-tighter text-navy mb-2">{r.title}</h4>
              <p className="text-[11px] text-navy/60 font-medium leading-relaxed line-clamp-2 italic">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
