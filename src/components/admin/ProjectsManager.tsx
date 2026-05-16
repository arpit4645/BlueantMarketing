import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import SafeImage from '../SafeImage';

interface Project {
  id?: string;
  name: string;
  cat: string;
  tags: string;
  year: string;
  img: string;
  order: number;
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Project>({ name: '', cat: '', tags: '', year: '', img: '', order: 0 });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'projects'));
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), form as any);
        toast.success('Project updated');
      } else {
        await addDoc(collection(db, 'projects'), { ...form, order: projects.length } as any);
        toast.success('Project added');
      }
      resetForm();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'projects');
      toast.error('Failed to save project');
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      toast.success('Project deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  const resetForm = () => {
    setForm({ name: '', cat: '', tags: '', year: '', img: '', order: 0 });
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (p: Project) => {
    setForm(p);
    setEditingId(p.id!);
    setIsAdding(true);
  };

  if (loading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-blue-accent border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-navy mb-1">Portfolio & Projects</h2>
          <p className="text-navy/40 font-mono text-[10px] uppercase tracking-widest">Selected Work Management</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-navy/90 transition-all shadow-lg active:scale-95"
        >
          <Plus size={16} /> Add project
        </button>
      </div>

      {isAdding && (
        <div className="mb-12 bg-white p-8 rounded-2xl border border-navy/5 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black uppercase tracking-tighter text-navy">{editingId ? 'Edit Project' : 'New Project'}</h3>
            <button onClick={resetForm} className="text-navy/40 hover:text-navy"><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Project Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Category</label>
                <input required value={form.cat} onChange={e => setForm({...form, cat: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" placeholder="e.g. SaaS · Positioning" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Tags</label>
                <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" placeholder="e.g. Positioning · Website" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Image URL</label>
                <input required value={form.img} onChange={e => setForm({...form, img: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Year</label>
                  <input value={form.year} onChange={e => setForm({...form, year: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value)})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-accent text-white p-4 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-blue-accent/90 transition-all flex items-center justify-center gap-2">
                <Save size={16} /> {editingId ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="group bg-white rounded-2xl border border-navy/5 shadow-sm overflow-hidden hover:shadow-xl transition-all">
            <div className="aspect-video relative overflow-hidden bg-navy/10">
              <SafeImage src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button onClick={() => startEdit(p)} className="p-3 bg-white text-navy rounded-full hover:scale-110 transition-transform"><Edit2 size={18} /></button>
                <button onClick={() => deleteProject(p.id!)} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"><Trash2 size={18} /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono text-blue-accent uppercase tracking-widest px-2 py-1 bg-blue-accent/5 rounded-full">{p.cat}</span>
                <span className="text-[9px] font-mono text-navy/40 uppercase">{p.year}</span>
              </div>
              <h4 className="font-black uppercase tracking-tighter text-navy mb-1">{p.name}</h4>
              <p className="text-[10px] text-navy/40 font-bold uppercase tracking-wider truncate">{p.tags}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
