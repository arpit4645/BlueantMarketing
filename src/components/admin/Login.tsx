import React, { useState } from 'react';
import { motion } from 'motion/react';
import { auth } from '../../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock, Chrome } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Authentication failed. Ensure you are an authorized administrator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-12 shadow-2xl rounded-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-accent/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110 duration-500">
            <Lock className="text-navy" size={24} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-navy italic">Admin Access.</h1>
          <p className="text-sm font-mono mt-2 uppercase tracking-widest text-navy/40">// BlueAnt Operating System</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold mb-8 border border-red-100 uppercase tracking-tight flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-navy text-white font-black uppercase tracking-[0.2em] py-5 rounded-xl hover:bg-blue-accent transition-all duration-300 shadow-xl disabled:opacity-70 flex items-center justify-center gap-4 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Chrome size={20} className="group-hover:rotate-12 transition-transform" />
                Login with Google
              </>
            )}
          </button>
        </div>

        <div className="mt-10 pt-10 border-t border-navy/5">
           <p className="text-[9px] font-mono text-center text-navy/30 uppercase tracking-[0.2em] leading-relaxed">
            Proprietary System // Global Vision Control<br/>
            Authorized Personnel: arpitjadav765@gmail.com
          </p>
        </div>
      </motion.div>
    </div>
  );
}
