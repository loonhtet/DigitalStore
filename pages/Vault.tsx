
import React, { useState } from 'react';
import { Shield, Key, Calendar, ExternalLink, Eye, EyeOff, Clock, CheckCircle } from 'lucide-react';
import { User } from '../types';
import { MOCK_VAULT_ITEMS } from '../constants';

interface VaultProps {
  user: User | null;
}

const Vault: React.FC<VaultProps> = ({ user }) => {
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center mx-auto mb-10 text-gray-300">
          <Shield size={40} />
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase">Vault Restricted</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-12">Please log in to access your digital assets and license keys.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in slide-in-from-bottom duration-500">
      
      {/* Header */}
      <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-900 pb-16">
        <div>
          <div className="flex items-center gap-4 text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-4">
            <Shield size={14} />
            Secure Storage
          </div>
          <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase">My Vault</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-lg leading-relaxed uppercase tracking-wider">
            Access your premium license keys and monitor your active subscriptions.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <span className="w-2 h-2 bg-primary-500"></span>
          {MOCK_VAULT_ITEMS.length} Assets Secured
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {MOCK_VAULT_ITEMS.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 group hover:border-primary-500/50 transition-all">
            <div className="flex flex-col sm:flex-row h-full">
              
              {/* Image & Product Info */}
              <div className="sm:w-1/3 aspect-square sm:aspect-auto bg-gray-50 dark:bg-black border-r border-gray-100 dark:border-gray-900 overflow-hidden relative">
                <img src={item.image} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-4">
                   <div className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest bg-white dark:bg-black border border-gray-100 dark:border-gray-800 ${
                     item.status === 'expiring-soon' ? 'text-accent' : 'text-primary-500'
                   }`}>
                     {item.status === 'expiring-soon' ? 'Expiring Soon' : 'Active'}
                   </div>
                </div>
              </div>

              {/* Data Area */}
              <div className="sm:w-2/3 p-10 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-primary-600 transition-colors">{item.name}</h3>
                  <button className="text-gray-300 hover:text-gray-950 dark:hover:text-white transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </div>

                {/* License Key Section */}
                <div className="mb-10">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Access Key</label>
                  <div className="flex items-center gap-4 bg-gray-50 dark:bg-black p-4 border border-gray-100 dark:border-gray-900 relative">
                    <Key size={14} className="text-gray-400" />
                    <code className="text-xs font-bold font-mono tracking-wider text-gray-900 dark:text-gray-100">
                      {visibleKeys[item.id] ? item.licenseKey : '••••••••••••••••••••'}
                    </code>
                    <button 
                      onClick={() => toggleKeyVisibility(item.id)}
                      className="ml-auto text-gray-400 hover:text-primary-500 transition-colors"
                    >
                      {visibleKeys[item.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-auto pt-8 border-t border-gray-50 dark:border-gray-900 space-y-6">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      Valid Until: <span className="text-gray-900 dark:text-gray-100 ml-1">{item.expiryDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={12} />
                      Days Left: <span className={item.status === 'expiring-soon' ? 'text-accent' : 'text-primary-500'}>12</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-1 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${
                      item.status === 'expiring-soon' ? 'bg-accent' : 'bg-primary-500'
                    }`} style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {MOCK_VAULT_ITEMS.length === 0 && (
          <div className="col-span-full py-40 border border-dashed border-gray-200 dark:border-gray-800 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Your vault is empty.</p>
          </div>
        )}
      </div>

      {/* Security Tip */}
      <div className="mt-24 p-12 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-12">
        <div className="w-16 h-16 bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0">
          <CheckCircle size={32} />
        </div>
        <div>
          <h4 className="text-lg font-black uppercase tracking-tighter mb-2">Vault Security Protocol</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed uppercase tracking-wider">
            Your license keys are encrypted at rest. Never share your account credentials with anyone. 
            Subscriptions will automatically update their status based on current validity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Vault;
