
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
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
  Lock,
  Mail
} from 'lucide-react';
import { Product, User } from './types';
import { INITIAL_PRODUCTS } from './constants';

// Pages
import Landing from './pages/Landing';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import CMS from './pages/CMS';
import Vault from './pages/Vault';
import AdminLogin from './pages/AdminLogin';
import Login from './pages/Login';

// CMS Sub-pages
import Inventory from './pages/Admin/Inventory';
import Orders from './pages/Admin/Orders';
import Inquiries from './pages/Admin/Inquiries';
import UsageAnalytics from './pages/Admin/UsageAnalytics';

type CheckoutStep = 'SUMMARY' | 'METHOD' | 'PAYMENT' | 'SUCCESS' | null;
type BankOption = 'KBZ' | 'AYA' | null;

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
      <div 
        className="absolute inset-0 bg-white/20 dark:bg-black/20 origin-left transition-transform duration-75"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
      <span className="relative z-10 flex items-center justify-center gap-3">
        {progress > 0 && progress < 100 && (
          <Clock size={14} className="animate-spin-slow" />
        )}
        {label}
      </span>
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
  handleLogin: (p: 'google' | 'facebook' | 'admin' | 'credentials', email?: string) => void,
  handleLogout: () => void
}> = ({
  user, setUser, theme, setTheme, products, setProducts, initiatePurchase,
  showAuthModal, setShowAuthModal, showLogoutModal, setShowLogoutModal,
  checkoutStep, setCheckoutStep, pendingProduct, setPendingProduct,
  selectedBank, setSelectedBank, senderName, setSenderName,
  closeCheckout, handleLogin, handleLogout
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'dark bg-gray-950' : 'bg-white'}`}>
      
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-950 dark:bg-primary-500 flex items-center justify-center text-white dark:text-black font-bold text-lg">N</div>
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">NEXUS</span>
              </Link>
              <div className="hidden sm:ml-12 sm:flex sm:space-x-10">
                <Link to="/" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${location.pathname === '/' ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600'}`}>Home</Link>
                <Link to="/shop" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isActive('/shop') ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600'}`}>Shop</Link>
                <Link to="/contact" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isActive('/contact') ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600'}`}>Support</Link>
                {user && (
                  <Link to="/vault" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isActive('/vault') ? 'text-primary-600' : 'text-primary-500'}`}>Vault</Link>
                )}
                {user?.isAdmin ? (
                  <Link to="/cms" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isActive('/cms') ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600'}`}>Admin Portal</Link>
                ) : (
                  <Link to="/admin-login" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isActive('/admin-login') ? 'text-primary-600' : 'text-gray-300 hover:text-gray-500'}`}>Admin Access</Link>
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
                    <button onClick={() => setShowLogoutModal(true)} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-accent transition-colors">Log Out</button>
                  </div>
                ) : (
                  <button onClick={() => setShowAuthModal(true)} className="px-6 py-2.5 text-[10px] font-black tracking-widest uppercase bg-gray-950 dark:bg-white text-white dark:text-black hover:bg-primary-600 transition-all border border-transparent">Login</button>
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
          <Route path="/admin-login" element={<AdminLogin onLogin={() => handleLogin('admin')} />} />
          <Route path="/login" element={<Login onLogin={(email) => handleLogin('credentials', email)} />} />
          
          {/* Nested CMS Routes */}
          <Route path="/cms" element={<CMS products={products} setProducts={setProducts} user={user} />}>
            <Route index element={<Inventory products={products} setProducts={setProducts} />} />
            <Route path="orders" element={<Orders />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="usage" element={<UsageAnalytics />} />
          </Route>
        </Routes>
      </main>

      {/* Mobile Nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-900 h-20 flex items-center justify-around px-4">
        <Link to="/" className={`flex flex-col items-center gap-1.5 ${location.pathname === '/' ? 'text-primary-600' : 'text-gray-400'}`}>
          <Home size={20} />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Home</span>
        </Link>
        <Link to="/shop" className={`flex flex-col items-center gap-1.5 ${isActive('/shop') ? 'text-primary-600' : 'text-gray-400'}`}>
          <LayoutGrid size={20} />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Shop</span>
        </Link>
        {user?.isAdmin ? (
          <Link to="/cms" className={`flex flex-col items-center gap-1.5 ${isActive('/cms') ? 'text-primary-600' : 'text-gray-400'}`}>
            <Lock size={20} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Admin</span>
          </Link>
        ) : (
          <Link to="/admin-login" className={`flex flex-col items-center gap-1.5 ${isActive('/admin-login') ? 'text-primary-600' : 'text-gray-400'}`}>
            <Lock size={20} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Admin</span>
          </Link>
        )}
      </div>

      <footer className="hidden sm:block bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em] font-black">&copy; {new Date().getFullYear()} NEXUS • PREMIUM DIGITAL STORE</p>
        </div>
      </footer>

      {showAuthModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm p-10 relative shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <button onClick={() => { setShowAuthModal(false); setPendingProduct(null); }} className="absolute top-6 right-6 text-gray-400"><X size={18} /></button>
            <h2 className="text-3xl font-black mb-1.5 tracking-tighter uppercase">Sign In</h2>
            <div className="space-y-4 mt-10">
              <button onClick={() => { setShowAuthModal(false); navigate('/login'); }} className="w-full flex items-center justify-center gap-4 px-6 py-5 bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.2em]">
                <Mail size={18} /> Email & Password
              </button>
            </div>
          </div>
        </div>
      )}

      {checkoutStep && pendingProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-950 w-full max-w-lg shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-10 pt-10 pb-6 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter">Checkout</h3>
              <button onClick={closeCheckout} className="text-gray-300"><X size={20} /></button>
            </div>
            <div className="p-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {checkoutStep === 'SUMMARY' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-900">
                    <img src={pendingProduct.image} className="w-16 h-16 object-cover grayscale" alt="" />
                    <h4 className="text-lg font-black uppercase tracking-tight">{pendingProduct.name}</h4>
                  </div>
                  <button onClick={() => setCheckoutStep('METHOD')} className="w-full py-5 bg-gray-950 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-[0.3em]">Continue to Payment</button>
                </div>
              )}
              {checkoutStep === 'METHOD' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-4">
                    <button onClick={() => setSelectedBank('KBZ')} className={`flex items-center gap-4 p-6 border ${selectedBank === 'KBZ' ? 'border-primary-500' : 'border-gray-100'}`}>KBZ Pay</button>
                    <button onClick={() => setSelectedBank('AYA')} className={`flex items-center gap-4 p-6 border ${selectedBank === 'AYA' ? 'border-primary-500' : 'border-gray-100'}`}>AYA Pay</button>
                  </div>
                  <button onClick={() => setCheckoutStep('PAYMENT')} disabled={!selectedBank} className="w-full py-5 bg-gray-950 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase">Show QR Code</button>
                </div>
              )}
              {checkoutStep === 'PAYMENT' && (
                <div className="text-center space-y-10">
                  <div className="w-48 h-48 bg-white mx-auto flex items-center justify-center border-2 border-primary-500/20 p-2">
                    <QrCode size={120} className="text-gray-900" />
                  </div>
                  <HoldToConfirmButton onComplete={() => setCheckoutStep('SUCCESS')} label="I have completed payment" className="w-full py-5 bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.4em]" />
                </div>
              )}
              {checkoutStep === 'SUCCESS' && (
                <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                  <CheckCircle2 size={40} className="mx-auto mb-10 text-primary-500" />
                  <h2 className="text-4xl font-black mb-4 uppercase">Success</h2>
                  <Link to="/vault" onClick={closeCheckout} className="block w-full py-5 bg-gray-950 text-white font-black text-[10px] uppercase">Open Vault</Link>
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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>(null);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [selectedBank, setSelectedBank] = useState<BankOption>(null);
  const [senderName, setSenderName] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = (provider: 'google' | 'facebook' | 'admin' | 'credentials', email?: string) => {
    const mockUser: User = {
      id: provider === 'admin' ? 'admin_001' : 'user_123',
      name: provider === 'admin' ? 'Admin' : (email?.split('@')[0] || 'User'),
      email: email || 'user@example.com',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email || provider}`,
      isAdmin: provider === 'admin',
      provider: provider === 'admin' ? 'credentials' : provider
    };
    setUser(mockUser);
    setShowAuthModal(false);
    if (pendingProduct) setTimeout(() => setCheckoutStep('SUMMARY'), 500);
  };

  const handleLogout = () => { setUser(null); setShowLogoutModal(false); };
  const initiatePurchase = (product: Product) => { setPendingProduct(product); if (!user) setShowAuthModal(true); else setCheckoutStep('SUMMARY'); };
  const closeCheckout = () => { setCheckoutStep(null); setPendingProduct(null); setSelectedBank(null); setSenderName(''); };

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
