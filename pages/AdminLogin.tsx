
import React, { useState } from 'react';
import { Lock, Shield, Terminal, ArrowRight, Loader2, AlertCircle, Mail, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsAuthenticating(true);
    setError(null);

    // Simulated secure authentication delay
    setTimeout(() => {
      const inputEmail = email.toLowerCase().trim();
      const inputPass = password.trim();

      // Simple demo credentials: admin / admin
      if ((inputEmail === 'admin@nexus.io' || inputEmail === 'admin') && inputPass === 'admin') {
        onLogin();
        navigate('/cms');
      } else {
        setError('INVALID CREDENTIALS. ACCESS DENIED.');
        setIsAuthenticating(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-700">
        
        <div className="bg-white dark:bg-[#0a0a0b] border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
          
          <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal size={14} className="text-primary-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                Admin Console v4.0.2
              </span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800"></div>
              <div className="w-2 h-2 rounded-full bg-primary-500/50"></div>
            </div>
          </div>

          <div className="p-10 md:p-12">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-16 h-16 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 flex items-center justify-center mb-8 shadow-inner group">
                <Lock size={24} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
              </div>
              <h1 className="text-4xl font-black mb-3 tracking-tighter uppercase leading-none">
                ADMIN <br />
                <span className="text-primary-500">GATEWAY.</span>
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Protected Repository Access
              </p>
            </div>

            <form onSubmit={handleAdminAuth} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] block ml-1">
                  Admin Email
                </label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
                  <input 
                    type="text"
                    autoFocus
                    placeholder="admin@nexus.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isAuthenticating}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 text-[11px] font-bold tracking-[0.2em] outline-none focus:border-primary-500 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] block ml-1">
                  Security Password
                </label>
                <div className="relative group">
                  <Shield size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isAuthenticating}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 text-[11px] font-bold tracking-[0.2em] outline-none focus:border-primary-500 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700"
                  />
                </div>
              </div>

              {/* Dev Hint Box */}
              <div className="flex items-center gap-3 p-4 bg-primary-500/5 border border-primary-500/10">
                <Info size={14} className="text-primary-500 shrink-0" />
                <p className="text-[9px] font-bold text-primary-600 uppercase tracking-widest">
                  Demo Hint: Use "admin" for both fields.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-accent/5 border border-accent/20 flex items-center gap-3 animate-in shake duration-300">
                  <AlertCircle size={14} className="text-accent shrink-0" />
                  <span className="text-[9px] font-black text-accent uppercase tracking-widest leading-relaxed">
                    {error}
                  </span>
                </div>
              )}

              <button 
                type="submit"
                disabled={isAuthenticating || !email.trim() || !password.trim()}
                className="w-full py-6 bg-gray-950 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-[0.4em] hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all flex items-center justify-center gap-4 disabled:opacity-50 group shadow-xl"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Authorize Entry
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-900/50 flex flex-col items-center gap-4">
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] text-center max-w-[240px] leading-relaxed">
                Notice: Unauthorized access attempts are monitored and logged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
