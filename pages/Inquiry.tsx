
import React, { useState } from 'react';
import { Check, X, Shield, Clock, User as UserIcon, Wallet, ArrowRight, Ban, CheckCircle2 } from 'lucide-react';
import { Inquiry, User } from '../types';
import { MOCK_INQUIRIES } from '../constants';

interface InquiryProps {
  user: User | null;
}

const InquiryPage: React.FC<InquiryProps> = ({ user }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);

  if (!user?.isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center">
        <h1 className="text-4xl font-black mb-4 tracking-tight">Access Denied</h1>
        <p className="text-sm text-gray-500 font-medium">Restricted to administrator access only.</p>
      </div>
    );
  }

  const handleAction = (id: string, newStatus: 'approved' | 'rejected') => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
  };

  const getStatusStyle = (status: Inquiry['status']) => {
    switch (status) {
      case 'approved': return 'bg-primary-500/10 text-primary-500 border-primary-500/20';
      case 'rejected': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in slide-in-from-bottom duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-16 border-b border-gray-100 dark:border-gray-800 pb-12">
        <div>
          <div className="flex items-center gap-3 text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-4">
            <Shield size={14} />
            Verification Queue
          </div>
          <h1 className="text-5xl font-black mb-2 tracking-tighter uppercase">Payment Inquiries</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Manual Audit Required</p>
        </div>
        <div className="bg-gray-50 dark:bg-black px-8 py-4 border border-gray-100 dark:border-gray-900">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Pending Actions</p>
          <p className="text-2xl font-black">{inquiries.filter(i => i.status === 'pending').length}</p>
        </div>
      </div>

      <div className="space-y-6">
        {inquiries.map((inq) => (
          <div key={inq.id} className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 overflow-hidden hover:border-gray-200 dark:hover:border-gray-700 transition-all">
            <div className="flex flex-col lg:flex-row">
              
              {/* User Info Bar */}
              <div className="lg:w-1/4 p-8 border-r border-gray-50 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-900/10">
                <div className="flex items-center gap-4 mb-6">
                  <img src={inq.userAvatar} className="w-10 h-10 border border-gray-100 dark:border-gray-800" alt="" />
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-tight">{inq.userName}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{inq.userId}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock size={12} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">{inq.date}</span>
                  </div>
                  <div className={`inline-block px-3 py-1 border text-[8px] font-black uppercase tracking-[0.2em] ${getStatusStyle(inq.status)}`}>
                    {inq.status}
                  </div>
                </div>
              </div>

              {/* Transaction Detail */}
              <div className="lg:w-2/4 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-3">Order Details</label>
                    <p className="text-base font-black uppercase tracking-tight mb-1">{inq.productName}</p>
                    <p className="text-xl font-black tracking-tighter text-primary-600">${inq.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-3">Payment Info</label>
                    <div className="flex items-center gap-3 mb-2">
                      <Wallet size={14} className="text-gray-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{inq.bankName}PAY</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <UserIcon size={14} className="text-gray-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">{inq.senderName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lg:w-1/4 p-8 flex lg:flex-col justify-center gap-4 border-l border-gray-50 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-900/10">
                {inq.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleAction(inq.id, 'approved')}
                      className="flex-1 py-4 bg-primary-600 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-gray-950 transition-all flex items-center justify-center gap-3"
                    >
                      <Check size={14} />
                      Approve
                    </button>
                    <button 
                      onClick={() => handleAction(inq.id, 'rejected')}
                      className="flex-1 py-4 border border-gray-200 dark:border-gray-800 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-accent hover:border-accent transition-all flex items-center justify-center gap-3"
                    >
                      <Ban size={14} />
                      Reject
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                    {inq.status === 'approved' ? <CheckCircle2 size={16} /> : <X size={16} />}
                    Decision Logged
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {inquiries.length === 0 && (
          <div className="py-40 text-center border border-dashed border-gray-100 dark:border-gray-900">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Queue is empty. Well done.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryPage;
