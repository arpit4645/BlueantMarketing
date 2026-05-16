import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Edit2, Save, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import SafeImage from '../SafeImage';

interface Blog {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  img: string;
  slug: string;
}

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Blog>({ 
    title: '', excerpt: '', content: '', author: '', date: new Date().toISOString().split('T')[0], img: '', slug: '' 
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'blogs'));
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'blogs', editingId), form as any);
        toast.success('Blog updated');
      } else {
        await addDoc(collection(db, 'blogs'), { ...form } as any);
        toast.success('Blog published');
      }
      resetForm();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'blogs');
      toast.error('Failed to save blog');
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, 'blogs', id));
      toast.success('Blog deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `blogs/${id}`);
    }
  };

  const resetForm = () => {
    setForm({ title: '', excerpt: '', content: '', author: '', date: new Date().toISOString().split('T')[0], img: '', slug: '' });
    setEditingId(null);
    setIsAdding(false);
  };

  if (loading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-blue-accent border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-navy mb-1">Company Blog</h2>
          <p className="text-navy/40 font-mono text-[10px] uppercase tracking-widest">Insights & Updates Management</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-navy/90 transition-all shadow-lg active:scale-95"
        >
          <Plus size={16} /> New post
        </button>
      </div>

      {isAdding && (
        <div className="mb-12 bg-white p-8 rounded-2xl border border-navy/5 shadow-xl">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Title</label>
                      <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Slug</label>
                      <input required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" placeholder="my-blog-post" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Excerpt</label>
                      <textarea required value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent min-h-[80px]" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Image URL</label>
                      <input required value={form.img} onChange={e => setForm({...form, img: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Author</label>
                      <input required value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Date</label>
                      <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent" />
                    </div>
                 </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-1">Content (Markdown)</label>
                <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full bg-navy/5 border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-blue-accent min-h-[300px] font-mono" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-accent text-white p-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-accent/90 transition-all flex items-center justify-center gap-2">
                  <Save size={16} /> {editingId ? 'Update Post' : 'Publish Post'}
                </button>
                <button type="button" onClick={resetForm} className="bg-navy/10 text-navy px-8 rounded-xl uppercase tracking-widest text-[10px] font-bold">Cancel</button>
              </div>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border border-navy/5 flex overflow-hidden hover:shadow-lg transition-all group">
             <div className="w-32 h-full relative overflow-hidden hidden sm:block">
                <SafeImage src={b.img} alt={b.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
             </div>
             <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono text-navy/40 uppercase">{b.date}</span>
                  <span className="text-[9px] font-mono text-blue-accent uppercase font-bold">{b.author}</span>
                </div>
                <h4 className="font-black uppercase tracking-tighter text-navy mb-2 line-clamp-1">{b.title}</h4>
                <p className="text-xs text-navy/60 line-clamp-2 mb-4">{b.excerpt}</p>
                <div className="flex items-center gap-2">
                   <button onClick={() => { setForm(b); setEditingId(b.id!); setIsAdding(true); }} className="text-navy flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-blue-accent transition-colors">
                     <Edit2 size={12} /> Edit
                   </button>
                   <span className="text-navy/10">|</span>
                   <button onClick={() => deleteBlog(b.id!)} className="text-red-400 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-colors">
                     <Trash2 size={12} /> Delete
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
