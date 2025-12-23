
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, MessageSquare, Mail } from 'lucide-react';
import { getAIRecommendation } from '../services/geminiService';
import { Product } from '../types';

interface ContactProps {
  products: Product[];
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const Contact: React.FC<ContactProps> = ({ products }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hi! Welcome to Nexus Support. I'm your assistant. How can I help you find the right tool today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const productList = products.map(p => `${p.name} ($${p.price})`).join(', ');
    const aiResponse = await getAIRecommendation(userMessage, productList);
    
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row gap-20">
      
      {/* Contact Info */}
      <div className="lg:w-1/3 space-y-12">
        <div>
          <h1 className="text-5xl font-black mb-6 tracking-tight">Support</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Our support team and AI assistant are here to help you choose the best products for your needs.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="group flex items-center gap-6 p-8 bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-800 hover:border-primary-500 transition-all cursor-pointer">
            <div className="text-primary-600"><Mail size={24} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Us</p>
              <p className="text-sm font-bold">support@nexus.io</p>
            </div>
          </div>
          <div className="group flex items-center gap-6 p-8 bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-800 hover:border-primary-500 transition-all cursor-pointer">
            <div className="text-primary-600"><MessageSquare size={24} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Live Support</p>
              <p className="text-sm font-bold">Available 24/7</p>
            </div>
          </div>
        </div>

        <div className="p-10 bg-gray-950 dark:bg-primary-500 text-white dark:text-black">
          <Sparkles className="mb-6" size={28} />
          <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Smart Assistant</h3>
          <p className="text-xs font-medium leading-relaxed opacity-80 uppercase tracking-wider">
            Ask our AI to compare tools, pricing, and features for you instantly.
          </p>
        </div>
      </div>

      {/* Chat */}
      <div className="lg:w-2/3">
        <div className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col h-[700px]">
          <div className="p-8 border-b border-gray-50 dark:border-gray-900 flex items-center justify-between bg-white dark:bg-[#0c0c0c]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-600 flex items-center justify-center text-white">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold">Support Assistant</h3>
                <div className="flex items-center gap-2 text-[9px] text-primary-500 font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></span>
                  Ready to help
                </div>
              </div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-10 space-y-10 custom-scrollbar"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-500`}>
                <div className={`flex gap-6 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse text-right' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center ${msg.role === 'user' ? 'bg-gray-100 dark:bg-gray-800 text-gray-500' : 'bg-primary-50 text-primary-600'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`text-sm font-medium leading-relaxed ${
                    msg.role === 'user' 
                    ? 'text-gray-600 dark:text-gray-300' 
                    : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-4 items-center text-primary-600">
                  <Loader2 className="animate-spin" size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-8 bg-gray-50 dark:bg-[#0c0c0c] border-t border-gray-50 dark:border-gray-900">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask a question about our products..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="w-full pl-0 pr-16 py-5 bg-transparent border-b-2 border-gray-200 dark:border-gray-800 text-sm font-medium focus:border-primary-500 outline-none transition-all disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-950 dark:bg-primary-500 text-white dark:text-black flex items-center justify-center hover:bg-primary-600 dark:hover:bg-primary-400 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
