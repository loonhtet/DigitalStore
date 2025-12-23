
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  X,
  CheckCircle2,
  ArrowRight,
  Shield,
  CreditCard,
  QrCode,
  Wallet,
  Check,
  Clock,
  User as UserIcon,
  LogOut,
  Home,
  LayoutGrid,
  MessageSquare,
  Settings,
  ListTodo,
  Terminal
} from 'lucide-react';
import { Product, User } from './types';
import { INITIAL_PRODUCTS } from './constants';

// Pages
import Landing from './pages/Landing';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import CMS from './pages/CMS';
import Vault from './pages/Vault';

type CheckoutStep = 'SUMMARY' | 'METHOD' | 'PAYMENT' | 'SUCCESS' | null;
type BankOption = 'KBZ' | 'AYA' | null;

// Brand Icons
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" className="shrink-0">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.707a5.41 5.41 0 0 1 0-3.414V4.961H.957a8.992 8.992 0 0 0 0 8.078l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" className="shrink-0">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// New Hold To Confirm Button Component
const HoldToConfirmButton: React.FC<{
  onComplete: () => void;
  label: string;
  className?: string;
  duration?: number;
}> = ({ onComplete, label, className, duration = 3000 }) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startHolding = () => {
    setIsHolding(true);
    startTimeRef.current = Date.now();
    
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        stopHolding(true);
      }
    }, 20);
  };

  const stopHolding = (completed = false) => {
    setIsHolding(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (completed) {
      onComplete();
    } else {
      // Smoothly reset progress
      setProgress(0);
    }
  };

  return (
    <button 
      onMouseDown={startHolding}
      onMouseUp={() => stopHolding()}
      onMouseLeave={() => stopHolding()}
      onTouchStart={startHolding}
      onTouchEnd={() => stopHolding()}
      className={`relative overflow-hidden transition-transform active:scale-95 ${className}`}
    >
      {/* Progress Background */}
      <div 
        className="absolute inset-0 bg-white/20 dark:bg-black/20 origin-left transition-transform duration-75"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
      
      {/* Label */}
      <span className="relative z-10 flex items-center justify-center gap-3">
        {progress > 0 && progress < 100 && (
          <Clock size={14} className="animate-spin-slow" />
        )}
        {label}
      </span>

      {/* Instruction hint when holding */}
      {isHolding && progress < 100 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] font-bold opacity-50 uppercase tracking-[0.2em]">
          Hold for {Math.ceil((duration - (progress / 100 * duration)) / 1000)}s
        </div>
      )}
    </button>
  );
};

const AppContent: React.FC<{
  user: User | null,
  setUser: (u: User | null) => void,
  theme: 'light' | 'dark',
  setTheme: (t: 'light' | 'dark') => void,
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  initiatePurchase: (product: Product) => void,
  showAuthModal: boolean,
  setShowAuthModal: (s: boolean) => void,
  showLogoutModal: boolean,
  setShowLogoutModal: (s: boolean) => void,
  checkoutStep: CheckoutStep,
  setCheckoutStep: (s: CheckoutStep) => void,
  pendingProduct: Product | null,
  setPendingProduct: (p: Product | null) => void,
  selectedBank: BankOption,
  setSelectedBank: (b: BankOption) => void,
  senderName: string,
  setSenderName: (n: string) => void,
  closeCheckout: () => void,
  handleLogin: (p: 'google' | 'facebook') => void,
  handleLogout: () => void
}> = ({
  user, setUser, theme, setTheme, products, setProducts, initiatePurchase,
  showAuthModal, setShowAuthModal, showLogoutModal, setShowLogoutModal,
  checkoutStep, setCheckoutStep, pendingProduct, setPendingProduct,
  selectedBank, setSelectedBank, senderName, setSenderName,
  closeCheckout, handleLogin, handleLogout
}) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'dark bg-gray-950' : 'bg-white'}`}>
      
      {/* Navigation (Top for Desktop, Minimal for Mobile) */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-950 dark:bg-primary-500 flex items-center justify-center text-white dark:text-black font-bold text-lg">N</div>
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">NEXUS</span>
              </Link>
              <div className="hidden sm:ml-12 sm:flex sm:space-x-10">
                <Link to="/" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isActive('/') ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600 dark:hover:text-primary-500'}`}>Home</Link>
                <Link to="/shop" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isActive('/shop') ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600 dark:hover:text-primary-500'}`}>Shop</Link>
                <Link to="/contact" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isActive('/contact') ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600 dark:hover:text-primary-500'}`}>Support</Link>
                {user && (
                  <Link to="/vault" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isActive('/vault') ? 'text-primary-600' : 'text-primary-500'}`}>Vault</Link>
                )}
                {user?.isAdmin && (
                  <Link to="/cms" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isActive('/cms') ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600 dark:hover:text-primary-500'}`}>Admin Portal</Link>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-1 text-gray-400 hover:text-primary-500 transition-colors"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <div className="hidden sm:flex items-center gap-6">
                {user ? (
                  <div className="flex items-center gap-4">
                    <img src={user.avatar} className="w-8 h-8 border border-gray-100 dark:border-gray-800" alt="avatar" />
                    <button 
                      onClick={() => setShowLogoutModal(true)} 
                      className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-accent transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="px-6 py-2.5 text-[10px] font-black tracking-widest uppercase bg-gray-950 dark:bg-white text-white dark:text-black hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all border border-transparent"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow pb-24 sm:pb-0">
        <Routes>
          <Route path="/" element={<Landing products={products} />} />
          <Route path="/shop" element={<Shop products={products} initiatePurchase={initiatePurchase} />} />
          <Route path="/contact" element={<Contact products={products} />} />
          <Route path="/vault" element={<Vault user={user} />} />
          <Route path="/cms" element={<CMS products={products} setProducts={setProducts} user={user} />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-900 h-20 flex items-center justify-around px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <Link to="/" className={`flex flex-col items-center gap-1.5 transition-all ${isActive('/') ? 'text-primary-600' : 'text-gray-400'}`}>
          <Home size={20} className={isActive('/') ? 'scale-110' : ''} />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Home</span>
        </Link>
        <Link to="/shop" className={`flex flex-col items-center gap-1.5 transition-all ${isActive('/shop') ? 'text-primary-600' : 'text-gray-400'}`}>
          <LayoutGrid size={20} className={isActive('/shop') ? 'scale-110' : ''} />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Shop</span>
        </Link>
        <Link to="/contact" className={`flex flex-col items-center gap-1.5 transition-all ${isActive('/contact') ? 'text-primary-600' : 'text-gray-400'}`}>
          <MessageSquare size={20} className={isActive('/contact') ? 'scale-110' : ''} />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Support</span>
        </Link>
        {user ? (
          <Link to="/vault" className={`flex flex-col items-center gap-1.5 transition-all ${isActive('/vault') ? 'text-primary-600' : 'text-gray-400'}`}>
            <Shield size={20} className={isActive('/vault') ? 'scale-110' : ''} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Vault</span>
          </Link>
        ) : (
          <button onClick={() => setShowAuthModal(true)} className="flex flex-col items-center gap-1.5 text-gray-400">
            <UserIcon size={20} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Login</span>
          </button>
        )}
        {user?.isAdmin && (
          <Link to="/cms" className={`flex flex-col items-center gap-1.5 transition-all ${isActive('/cms') ? 'text-primary-600' : 'text-gray-400'}`}>
            <Terminal size={20} className={isActive('/cms') ? 'scale-110' : ''} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Admin</span>
          </Link>
        )}
      </div>

      <footer className="hidden sm:block bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-gray-950 dark:bg-primary-500 flex items-center justify-center text-white dark:text-black font-bold">N</div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tighter uppercase">NEXUS</span>
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em] font-black">&copy; {new Date().getFullYear()} NEXUS • PREMIUM DIGITAL STORE</p>
        </div>
      </footer>

      {/* Auth Modal - Refined Styling */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm p-10 relative shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <button onClick={() => { setShowAuthModal(false); setPendingProduct(null); }} className="absolute top-6 right-6 text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors">
              <X size={18} />
            </button>
            <h2 className="text-3xl font-black mb-1.5 tracking-tighter uppercase">Sign In</h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-10 font-medium uppercase tracking-tight">Access premium digital assets instantly.</p>
            <div className="space-y-4">
              <button 
                onClick={() => handleLogin('google')}
                className="w-full flex items-center justify-center gap-4 px-6 py-5 border border-gray-100 dark:border-gray-800 hover:border-primary-500 hover:text-primary-600 transition-all font-black text-[10px] uppercase tracking-[0.2em] bg-white dark:bg-black/40 group"
              >
                <GoogleIcon />
                <span className="group-hover:translate-x-1 transition-transform">Sign in with Google</span>
              </button>
              <button 
                onClick={() => handleLogin('facebook')}
                className="w-full flex items-center justify-center gap-4 px-6 py-5 border border-gray-100 dark:border-gray-800 hover:border-primary-500 hover:text-primary-600 transition-all font-black text-[10px] uppercase tracking-[0.2em] bg-white dark:bg-black/40 group"
              >
                <FacebookIcon />
                <span className="group-hover:translate-x-1 transition-transform">Sign in with Facebook</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-950 w-full max-w-sm p-10 relative shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent/10 text-accent flex items-center justify-center mb-6">
                <LogOut size={24} />
              </div>
              <h2 className="text-xl font-black mb-2 tracking-tighter uppercase">Sign Out?</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-8 font-medium uppercase tracking-widest leading-relaxed">
                Are you sure you want to end your session?
              </p>
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 bg-accent text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-950 transition-all"
                >
                  Yes, Sign Out
                </button>
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Step Checkout Modal */}
      {checkoutStep && pendingProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-950 w-full max-w-lg shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            
            {/* Checkout Progress Header */}
            {checkoutStep !== 'SUCCESS' && (
              <div className="px-10 pt-10 pb-6 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center">
                <div>
                  <h3 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em] mb-1">Nexus Checkout</h3>
                  <p className="text-xl font-black uppercase tracking-tighter">
                    {checkoutStep === 'SUMMARY' && 'Order Summary'}
                    {checkoutStep === 'METHOD' && 'Payment Method'}
                    {checkoutStep === 'PAYMENT' && 'Scan & Pay'}
                  </p>
                </div>
                <button onClick={closeCheckout} className="text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            )}

            <div className="p-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Step 1: Summary */}
              {checkoutStep === 'SUMMARY' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-900">
                    <div className="w-16 h-16 shrink-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 overflow-hidden">
                      <img src={pendingProduct.image} className="w-full h-full object-cover grayscale" alt="" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{pendingProduct.category}</p>
                      <h4 className="text-lg font-black uppercase tracking-tight">{pendingProduct.name}</h4>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      <span>Price</span>
                      <span className="text-gray-900 dark:text-white">${pendingProduct.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      <span>Transaction Fee</span>
                      <span className="text-gray-900 dark:text-white">$0.00</span>
                    </div>
                    <div className="pt-4 border-t border-gray-50 dark:border-gray-900 flex justify-between items-center">
                      <span className="text-[11px] font-black uppercase tracking-widest">Total Amount</span>
                      <span className="text-2xl font-black tracking-tighter text-primary-600">${pendingProduct.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setCheckoutStep('METHOD')}
                    className="w-full py-5 bg-gray-950 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all flex items-center justify-center gap-4"
                  >
                    Continue to Payment
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* Step 2: Bank Selection & Info */}
              {checkoutStep === 'METHOD' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Select Provider:</p>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { id: 'KBZ' as const, name: 'KBZ Bank / KBZPay', icon: <Wallet size={20} /> },
                        { id: 'AYA' as const, name: 'AYA Bank / AYAPay', icon: <CreditCard size={20} /> }
                      ].map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id)}
                          className={`flex items-center justify-between p-6 border transition-all text-left ${
                            selectedBank === bank.id 
                            ? 'border-primary-500 bg-primary-50/10' 
                            : 'border-gray-100 dark:border-gray-900 hover:border-gray-200 dark:hover:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={selectedBank === bank.id ? 'text-primary-500' : 'text-gray-400'}>
                              {bank.icon}
                            </div>
                            <span className={`text-[11px] font-black uppercase tracking-widest ${selectedBank === bank.id ? 'text-primary-600' : 'text-gray-500'}`}>
                              {bank.name}
                            </span>
                          </div>
                          {selectedBank === bank.id && <Check size={16} className="text-primary-500" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-gray-50 dark:border-gray-900">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block">
                      Sender Bank Account Name
                    </label>
                    <div className="relative">
                      <UserIcon size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input 
                        type="text"
                        placeholder="ENTER YOUR ACCOUNT NAME"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value.toUpperCase())}
                        className="w-full pl-12 pr-5 py-5 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 text-[10px] font-bold uppercase tracking-[0.15em] focus:border-primary-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700"
                      />
                    </div>
                    <p className="text-[8px] text-gray-400 uppercase tracking-widest italic font-medium">
                      Used for payment verification by our audit team.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setCheckoutStep('SUMMARY')}
                      className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => setCheckoutStep('PAYMENT')}
                      disabled={!selectedBank || !senderName.trim()}
                      className="flex-[2] py-5 bg-gray-950 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      Show QR Code
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: QR Code Display */}
              {checkoutStep === 'PAYMENT' && (
                <div className="text-center space-y-10 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-gray-50 dark:bg-black p-8 border border-gray-100 dark:border-gray-900 inline-block">
                    {/* Mock QR Code */}
                    <div className="w-48 h-48 relative border-2 border-primary-500/20 p-2">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary-500"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary-500"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary-500"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary-500"></div>
                      <div className="w-full h-full bg-white dark:bg-gray-900 flex items-center justify-center p-4">
                         <QrCode size={120} className="text-gray-900 dark:text-white opacity-80" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-600">
                        {selectedBank}PAY MERCHANT: NEXUS_STORE_MM
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
                        Please scan the QR code and send <span className="text-gray-900 dark:text-white font-bold">${pendingProduct.price.toFixed(2)}</span> to complete your order.
                      </p>
                    </div>

                    {/* Simplified Delivery Notice - Yellow Theme */}
                    <div className="mx-auto max-w-sm flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30">
                      <div className="shrink-0 text-yellow-600 dark:text-yellow-500">
                        <Clock size={20} />
                      </div>
                      <p className="text-[10px] font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-widest text-left leading-tight">
                        Item delivery: Within 4 hours after payment.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 px-10">
                    <HoldToConfirmButton 
                      onComplete={() => setCheckoutStep('SUCCESS')}
                      label="I have completed payment"
                      className="w-full py-5 bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-primary-700 transition-all flex items-center justify-center gap-3 shadow-lg"
                    />
                    <button 
                      onClick={() => setCheckoutStep('METHOD')}
                      className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Change Payment Method
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Success Message */}
              {checkoutStep === 'SUCCESS' && (
                <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-primary-500/10 text-primary-500 flex items-center justify-center mx-auto mb-10">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">Purchase Success</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-12 leading-relaxed">
                    Your payment for <span className="font-bold text-gray-900 dark:text-white uppercase">{pendingProduct.name}</span> has been confirmed. 
                    Your license key is now available in your vault.
                  </p>
                  <div className="flex flex-col gap-4 px-10">
                    <Link 
                      to="/vault"
                      onClick={closeCheckout}
                      className="w-full py-5 bg-gray-950 dark:bg-primary-500 text-white dark:text-black font-black text-[10px] uppercase tracking-[0.3em] hover:opacity-90 transition-all flex items-center justify-center gap-3"
                    >
                      Open My Vault
                      <Shield size={16} />
                    </Link>
                    <button 
                      onClick={closeCheckout}
                      className="w-full py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors"
                    >
                      Finish
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Checkout States
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>(null);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [selectedBank, setSelectedBank] = useState<BankOption>(null);
  const [senderName, setSenderName] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = (provider: 'google' | 'facebook') => {
    const mockUser: User = {
      id: 'user_123',
      name: provider === 'google' ? 'Google User' : 'Facebook User',
      email: 'user@example.com',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
      isAdmin: true,
      provider: provider
    };
    setUser(mockUser);
    setShowAuthModal(false);
    
    if (pendingProduct) {
      setTimeout(() => setCheckoutStep('SUMMARY'), 500);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowLogoutModal(false);
  };

  const initiatePurchase = (product: Product) => {
    setPendingProduct(product);
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setCheckoutStep('SUMMARY');
  };

  const closeCheckout = () => {
    setCheckoutStep(null);
    setPendingProduct(null);
    setSelectedBank(null);
    setSenderName('');
  };

  return (
    <Router>
      <AppContent 
        user={user} setUser={setUser} theme={theme} setTheme={setTheme}
        products={products} setProducts={setProducts} initiatePurchase={initiatePurchase}
        showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal}
        showLogoutModal={showLogoutModal} setShowLogoutModal={setShowLogoutModal}
        checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep}
        pendingProduct={pendingProduct} setPendingProduct={setPendingProduct}
        selectedBank={selectedBank} setSelectedBank={setSelectedBank}
        senderName={senderName} setSenderName={setSenderName}
        closeCheckout={closeCheckout} handleLogin={handleLogin} handleLogout={handleLogout}
      />
    </Router>
  );
};

export default App;
