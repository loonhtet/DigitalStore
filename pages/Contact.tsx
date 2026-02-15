
import React, { useState } from 'react';
import { Mail, MessageSquare, Plus, Minus, HelpCircle, ShieldQuestion, CreditCard, Zap, Key } from 'lucide-react';
import { Product } from '../types';

interface ContactProps {
  products: Product[];
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'DELIVERY',
    question: 'HOW DO I RECEIVE MY PURCHASED LICENSE KEY?',
    answer: 'Once your payment is verified by our team, the license key will be instantly dispatched to your personal "Vault". You can access it anytime by clicking the Vault link in the navigation bar.'
  },
  {
    category: 'PAYMENT',
    question: 'WHICH PAYMENT METHODS ARE SUPPORTED?',
    answer: 'We currently accept KBZ Pay and AYA Pay. Our system requires a manual verification of the transfer to ensure security and prevent fraudulent transactions.'
  },
  {
    category: 'TIMING',
    question: 'HOW LONG DOES VERIFICATION TAKE?',
    answer: 'Manual audit typically takes between 5 to 30 minutes during our standard operating hours (GMT+6:30). If your order is pending longer, please contact support via email.'
  },
  {
    category: 'REFUNDS',
    question: 'WHAT IS THE REFUND POLICY FOR DIGITAL ASSETS?',
    answer: 'Due to the nature of digital license keys, all sales are final once the key has been revealed in your vault. If the key is faulty, we provide a 24-hour replacement guarantee.'
  },
  {
    category: 'SECURITY',
    question: 'ARE THE ACCOUNTS PRIVATE OR SHARED?',
    answer: 'All products sold on Nexus are for private, individual use unless explicitly stated otherwise in the product description. You will have full sovereignty over your access.'
  }
];

const Contact: React.FC<ContactProps> = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-20">
        
        {/* Contact Info & Sidebar */}
        <div className="lg:w-1/3 space-y-12">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-4">
              <HelpCircle size={14} /> Center
            </div>
            <h1 className="text-6xl font-black mb-6 tracking-tighter uppercase">Support.</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed uppercase tracking-wider">
              Direct assistance and procedural documentation for the Nexus community.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="group flex items-center gap-6 p-8 bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-800 hover:border-primary-500 transition-all cursor-pointer">
              <div className="text-primary-600"><Mail size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Correspondence</p>
                <p className="text-sm font-bold uppercase">support@nexus.io</p>
              </div>
            </div>
            <div className="group flex items-center gap-6 p-8 bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-800 hover:border-primary-500 transition-all cursor-pointer">
              <div className="text-primary-600"><MessageSquare size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Live Operators</p>
                <p className="text-sm font-bold uppercase">Available 09:00 - 22:00</p>
              </div>
            </div>
          </div>

          <div className="p-10 bg-gray-950 dark:bg-primary-500 text-white dark:text-black">
            <ShieldQuestion className="mb-6" size={28} />
            <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Need Urgent Help?</h3>
            <p className="text-[10px] font-black leading-relaxed opacity-80 uppercase tracking-widest">
              Please include your Order ID (found in history) in all support inquiries to ensure prioritized resolution.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="lg:w-2/3">
          <div className="mb-12">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Frequently Asked Questions</h2>
            <div className="w-20 h-1 bg-primary-500"></div>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((faq, i) => (
              <div 
                key={i} 
                className={`border border-gray-100 dark:border-gray-800 transition-all ${
                  openIndex === i ? 'bg-gray-50/50 dark:bg-gray-900/20 border-primary-500/30' : 'bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/10'
                }`}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full p-8 flex items-start justify-between text-left group"
                >
                  <div className="flex gap-6">
                    <span className="text-[9px] font-black text-gray-300 dark:text-gray-700 mt-1">0{i + 1}</span>
                    <div>
                      <span className="text-[8px] font-black text-primary-500 uppercase tracking-[0.3em] block mb-2">{faq.category}</span>
                      <h3 className={`text-sm font-black uppercase tracking-tight transition-colors ${
                        openIndex === i ? 'text-primary-600' : 'text-gray-900 dark:text-white group-hover:text-primary-600'
                      }`}>
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <div className={`mt-1 shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-primary-500' : 'text-gray-300'}`}>
                    {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                
                {openIndex === i && (
                  <div className="px-8 pb-10 ml-12 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider leading-relaxed max-w-2xl">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-100 dark:border-gray-900 flex flex-col items-center text-center">
              <Zap size={20} className="text-primary-500 mb-4" />
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Instant Access</p>
            </div>
            <div className="p-8 border border-gray-100 dark:border-gray-900 flex flex-col items-center text-center">
              <CreditCard size={20} className="text-primary-500 mb-4" />
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Verified Payments</p>
            </div>
            <div className="p-8 border border-gray-100 dark:border-gray-900 flex flex-col items-center text-center">
              <Key size={20} className="text-primary-500 mb-4" />
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Secure Vault</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
