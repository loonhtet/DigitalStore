
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, User as UserIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    // Simulate authentication
    setTimeout(() => {
      onLogin(email);
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-10 md:p-12 shadow-2xl">
          
          <div className="flex flex-col items-center text-center mb-12">
            <div className="w-12 h-12 bg-primary-500 flex items-center justify-center text-black font-black text-xl mb-6">
              N
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tighter uppercase">Sign In</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Access your digital vault
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] block ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="email"
                  required
                  placeholder="USER@NEXUS.IO"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toUpperCase())}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 text-[10px] font-bold uppercase tracking-wider focus:border-primary-500 outline-none transition-all placeholder:text-gray-200 dark:placeholder:text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] block ml-1">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 text-[10px] font-bold uppercase tracking-wider focus:border-primary-500 outline-none transition-all placeholder:text-gray-200 dark:placeholder:text-gray-800"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-gray-950 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-[0.4em] hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all flex items-center justify-center gap-4 disabled:opacity-50 group"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Enter Vault
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-900/50 flex flex-col items-center gap-4">
            <Link to="/admin-login" className="text-[9px] font-black text-gray-400 hover:text-primary-500 uppercase tracking-widest transition-colors">
              Request Admin Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
