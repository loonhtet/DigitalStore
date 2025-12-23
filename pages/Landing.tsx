
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Award, ChevronRight, ArrowRight, RefreshCw, ShieldAlert, Globe } from 'lucide-react';
import { Product, Category } from '../types';

interface LandingProps {
  products: Product[];
}

const Landing: React.FC<LandingProps> = ({ products }) => {
  const categories = Object.values(Category);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredAssets = products.slice(0, 4);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredAssets.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredAssets.length]);

  const activeAsset = featuredAssets[featuredIndex];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Editorial Hero Section */}
      <section className="relative pt-32 pb-40 lg:pt-64 lg:pb-80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-24">
            <div className="lg:w-3/5 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.5em] mb-12">
                <span className="w-1.5 h-1.5 bg-primary-500"></span>
                Premium Digital Store
              </div>
              <h1 className="text-7xl md:text-[8rem] font-black tracking-tighter mb-12 leading-[0.85] uppercase">
                Premium <br />
                <span className="text-primary-500">Access.</span>
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-16 font-medium leading-relaxed">
                Unlock industry-leading tools for creators and pros. 
                Instant, verified, and permanent delivery.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-10">
                <Link to="/shop" className="group px-14 py-6 bg-gray-950 dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white flex items-center gap-4">
                  Browse Store
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <div className="hidden sm:flex items-center gap-6">
                  <div className="text-left">
                    <p className="text-lg font-black tracking-tight">50k+</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Users</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100 dark:bg-gray-800"></div>
                  <div className="text-left">
                    <p className="text-lg font-black tracking-tight">24/7</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Support uptime</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Decoration - Live Product Showcase */}
            <div className="lg:w-2/5 hidden lg:block relative">
              <div className="w-full aspect-square border border-gray-100 dark:border-gray-900 p-8">
                <div className="w-full h-full border border-gray-200 dark:border-gray-800 bg-gray-950 p-12 flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Background Accents */}
                  <div className="absolute top-0 right-0 p-4">
                    <RefreshCw size={14} className="text-gray-800 animate-spin-slow" />
                  </div>

                  <div className="flex justify-between items-start">
                    {/* The White Square - Shows active product icon */}
                    <div className="w-16 h-16 bg-white flex items-center justify-center p-2">
                       <img 
                        key={activeAsset?.id}
                        src={activeAsset?.image} 
                        className="w-full h-full object-cover grayscale animate-in fade-in duration-1000" 
                        alt="" 
                       />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 rotate-90 origin-right translate-x-12 mt-8">STORE_VERIFIED</span>
                  </div>

                  <div className="space-y-6">
                    <div key={activeAsset?.id} className="animate-in slide-in-from-left duration-700">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mb-2">AVAILABLE NOW</p>
                      <h3 className="text-5xl font-black uppercase tracking-tighter leading-none text-white">{activeAsset?.name || 'NEXUS CORE'}</h3>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="h-1 flex-grow bg-gray-900 overflow-hidden">
                        <div className="h-full bg-primary-500 w-full animate-progress-fast"></div>
                      </div>
                      <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">
                        TRUSTED WORLDWIDE
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                      <span>SECURE_ORDER</span>
                      <span className="text-white">ID: {activeAsset?.id || '0000'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating detail tag */}
              <div className="absolute -bottom-6 -right-6 bg-primary-600 px-8 py-4 text-white text-[10px] font-black uppercase tracking-[0.4em]">
                Live Store : Online
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-24 flex items-end justify-between pb-12 border-b border-gray-100 dark:border-gray-900">
            <div>
              <h2 className="text-5xl font-black mb-4 tracking-tighter uppercase">Categories</h2>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-[0.2em]">Our Selection</p>
            </div>
            <Link to="/shop" className="text-xs font-black text-primary-600 hover:text-primary-500 transition-colors uppercase tracking-[0.2em] flex items-center gap-3">
              Full Store <ChevronRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {categories.map((cat, i) => (
              <Link 
                key={i} 
                to="/shop" 
                className="bg-gray-50 dark:bg-gray-900/50 p-16 group hover:bg-gray-950 dark:hover:bg-primary-500 transition-all duration-500"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 group-hover:text-primary-400/60 mb-8 block">SECTION_0{i + 1}</span>
                <h3 className="text-3xl font-black group-hover:text-white dark:group-hover:text-black transition-colors uppercase tracking-tighter">{cat}</h3>
                <div className="mt-20 flex items-center gap-4 text-[11px] font-black text-primary-600 group-hover:text-white dark:group-hover:text-black uppercase tracking-[0.3em] transition-all opacity-0 group-hover:opacity-100">
                  Shop Category <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sovereign Autonomy Section - Redesigned to match user screenshot */}
      <section className="py-40 bg-[#09090b] text-white overflow-hidden relative border-t border-gray-900">
        {/* Subtle geometric overlay background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #22c55e 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-5/12">
              <div className="inline-block p-4 border border-primary-500/20 mb-12">
                <Globe size={32} className="text-primary-500" />
              </div>
              <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter uppercase leading-[0.85]">
                SOVEREIGN <br />
                <span className="text-primary-500">AUTONOMY.</span>
              </h2>
              <div className="space-y-8 max-w-lg">
                <p className="text-xl font-black uppercase tracking-tight text-white">
                  Nexus operates as a strictly private, independent digital institution.
                </p>
                <p className="text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-[0.2em]">
                  We maintain total separation from public bureaucratic agencies and official state administrations. Our infrastructure is entirely self-managed and peer-verified, ensuring that your digital toolchain remains free from external regulatory oversight or public institutional control.
                </p>
              </div>
            </div>
            
            <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
              {[
                { label: 'ENTITY STATUS', value: 'PRIVATE' },
                { label: 'AFFILIATION', value: 'NONE' },
                { label: 'CONTROL', value: 'DECENTRALIZED' },
                { label: 'ACCOUNTABILITY', value: 'USER-CENTRIC' }
              ].map((stat, i) => (
                <div key={i} className="p-6 md:p-10 bg-[#121214] border border-transparent hover:border-gray-800 transition-colors flex flex-col justify-center min-h-[160px] md:min-h-[200px] overflow-hidden">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4 shrink-0">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white break-words leading-none">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits - Refined UI */}
      <section className="py-40 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-16 lg:gap-24">
            {[
              { icon: <Zap size={22} />, title: 'High Performance', desc: 'Instant delivery through our automated store system.' },
              { icon: <ShieldCheck size={22} />, title: 'Safe & Secure', desc: 'Every product is checked for safety and authenticity.' },
              { icon: <Award size={22} />, title: 'Proven Track Record', desc: 'Helping over 50,000 customers find the best tools since day one.' }
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-start group">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-px h-10 bg-primary-500"></div>
                  <div className="text-primary-500">
                    {f.icon}
                  </div>
                </div>
                <h3 className="text-xl font-black mb-5 uppercase tracking-tight text-gray-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.05em] leading-relaxed max-w-[280px]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Redesigned CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto relative group">
          {/* Main Green Container */}
          <div className="relative bg-primary-500 p-12 md:p-24 overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl">
            
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
              backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }}></div>
            
            {/* Geometric Accents */}
            <div className="absolute top-0 left-0 w-64 h-64 border border-black/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 border border-black/10 rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter uppercase leading-[0.9] mb-16">
                Ready to take <br />
                back your <br />
                privacy?
              </h2>
              
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-6 px-12 py-6 bg-gray-950 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.3em] hover:bg-gray-900 transition-all group/btn shadow-xl shadow-black/20"
              >
                Go to purchase page
                <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
          
          {/* Decorative Corner Element */}
          <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-primary-600 hidden md:block"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-primary-600 hidden md:block"></div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
