
import React, { useState } from 'react';
import { Shield, Clock, Wallet, User as UserIcon, Check, X, CheckCircle2, Ban } from 'lucide-react';
import { Inquiry } from '../../types';
import { MOCK_INQUIRIES } from '../../constants';

const Inquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  const [confirming, setConfirming] = useState<{ id: string, action: 'approved' | 'rejected' } | null>(null);

  const handleAction = (id: string, newStatus: 'approved' | 'rejected') => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    setConfirming(null);
  };

  const getStatusStyle = (status: Inquiry['status']) => {
    switch (status) {
      case 'approved': return 'bg-primary-500/10 text-primary-500 border-primary-500/20';
      case 'rejected': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-gray-100 dark:border-gray-800 pb-12">
        <div>
          <div className="flex items-center gap-3 text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-4">
            <Shield size={14} /> Pipeline
          </div>
          <h1 className="text-5xl font-black mb-2 tracking-tighter uppercase text-gray-900 dark:text-white">Inquiries</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Manual Audit Required</p>
        </div>
        <div className="bg-white dark:bg-black px-8 py-5 border border-gray-100 dark:border-gray-900 shadow-sm flex flex-col items-center">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Queue</p>
          <p className="text-3xl font-black text-primary-600">{inquiries.filter(i => i.status === 'pending').length}</p>
        </div>
      </div>

      <div className="space-y-8">
        {inquiries.map((inq) => (
          <div key={inq.id} className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 overflow-hidden hover:border-primary-500/30 transition-all">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/4 p-10 border-r border-gray-50 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-900/10">
                <div className="flex items-center gap-4 mb-8">
                  <img src={inq.userAvatar} className="w-12 h-12 border border-gray-100 dark:border-gray-800" alt="" />
                  <div>
                    <p className="text-[11px] font-black uppercase text-gray-900 dark:text-white">{inq.userName}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{inq.userId}</p>
                  </div>
                </div>
                <div className={`inline-block px-4 py-1.5 border text-[8px] font-black uppercase tracking-[0.2em] ${getStatusStyle(inq.status)}`}>
                  {inq.status}
                </div>
              </div>
              <div className="w-full lg:w-2/4 p-10 flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-16">
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase block mb-4">Target Order</label>
                    <p className="text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">{inq.productName}</p>
                    <p className="text-2xl font-black text-primary-600">${inq.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase block mb-4">Audit Trace</label>
                    <div className="flex items-center gap-3 mb-2">
                      <Wallet size={14} className="text-gray-400" />
                      <span className="text-[11px] font-black uppercase text-gray-600 dark:text-gray-300">{inq.bankName}Pay</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <UserIcon size={14} className="text-gray-400" />
                      <span className="text-[11px] font-black uppercase text-gray-600 dark:text-gray-300">{inq.senderName}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/4 p-10 flex flex-col justify-center gap-4 border-l border-gray-50 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-900/10">
                {inq.status === 'pending' ? (
                  <>
                    <button onClick={() => setConfirming({ id: inq.id, action: 'approved' })} className="w-full py-5 bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-950 transition-all flex items-center justify-center gap-3">
                      <Check size={16} /> Approve
                    </button>
                    <button onClick={() => setConfirming({ id: inq.id, action: 'rejected' })} className="w-full py-5 border border-gray-200 dark:border-gray-800 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-accent transition-all flex items-center justify-center gap-3">
                      <Ban size={16} /> Reject
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                    <CheckCircle2 size={20} className="text-primary-500" /> Sealed
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirming && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-950 w-full max-w-md border border-gray-100 dark:border-gray-800 p-10 text-center">
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-gray-900 dark:text-white">Confirm Decision</h2>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-10">Proceed with {confirming.action}?</p>
            <div className="flex flex-col gap-4">
              <button onClick={() => handleAction(confirming.id, confirming.action)} className="w-full py-5 bg-primary-600 text-white font-black text-[10px] uppercase">Seal Record</button>
              <button onClick={() => setConfirming(null)} className="w-full py-5 text-[10px] font-black uppercase text-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiries;
