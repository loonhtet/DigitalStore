
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit3, Trash2, Save, Package, TrendingUp, DollarSign, Users, X, 
  LayoutDashboard, ListTodo, Shield, Clock, User as UserIcon, Wallet, 
  Ban, CheckCircle2, Check, Search, Filter, Layers, AlertTriangle,
  UserCheck, UserX, ShoppingBag, Receipt, ExternalLink, Hash,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Product, Category, User, Inquiry, Order } from '../types';
import { MOCK_INQUIRIES, MOCK_ORDERS } from '../constants';

interface CMSProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  user: User | null;
}

type AdminSection = 'DASHBOARD' | 'INQUIRIES' | 'ORDERS';
type InquiryAction = 'approve' | 'reject' | null;

const ITEMS_PER_PAGE = 5;

const CMS: React.FC<CMSProps> = ({ products, setProducts, user }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('DASHBOARD');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination States
  const [currentPageInventory, setCurrentPageInventory] = useState(1);
  const [currentPageOrders, setCurrentPageOrders] = useState(1);
  const [currentPageInquiries, setCurrentPageInquiries] = useState(1);

  // Reset pagination on search
  useEffect(() => {
    setCurrentPageInventory(1);
    setCurrentPageOrders(1);
    setCurrentPageInquiries(1);
  }, [searchQuery]);

  // Dashboard/Inventory State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: Category.OTHER,
    image: 'https://picsum.photos/400/300',
    features: ['Instant Access', 'Email Support'],
    stock: 100
  });

  // Inquiry State
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  const [confirmInquiry, setConfirmInquiry] = useState<{ id: string, action: InquiryAction } | null>(null);

  // Orders State
  const [orders] = useState<Order[]>(MOCK_ORDERS);

  if (!user?.isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center">
        <h1 className="text-4xl font-black mb-4 tracking-tight uppercase">Access Denied</h1>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Administrator privilege required.</p>
      </div>
    );
  }

  // Inventory Handlers
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (editingId) {
      setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...formData } as Product : p));
      setEditingId(null);
    } else {
      const newProduct = {
        ...formData,
        id: Date.now().toString(),
      } as Product;
      setProducts(prev => [...prev, newProduct]);
      setShowAddForm(false);
    }
    setFormData({});
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData(p);
    setShowAddForm(false);
  };

  // Inquiry Handlers
  const handleInquiryAction = (id: string, newStatus: 'approved' | 'rejected') => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    setConfirmInquiry(null);
  };

  // Aesthetic Utils
  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case Category.AI: return 'text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30';
      case Category.DESIGN: return 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30';
      case Category.VPN: return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30';
      case Category.DEV: return 'text-orange-500 bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800';
    }
  };

  const getInquiryStatusStyle = (status: Inquiry['status']) => {
    switch (status) {
      case 'approved': return 'bg-primary-500/10 text-primary-500 border-primary-500/20';
      case 'rejected': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    }
  };

  const getOrderStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'bg-primary-500/10 text-primary-600 border-primary-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const inputClass = "w-full p-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 focus:border-primary-500 focus:ring-0 outline-none text-xs font-bold transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700 uppercase tracking-wide";
  const labelClass = "block text-[9px] font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-[0.2em]";

  // Filtered and Paginated Data
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPagesInventory = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentItemsInventory = filteredProducts.slice(
    (currentPageInventory - 1) * ITEMS_PER_PAGE,
    currentPageInventory * ITEMS_PER_PAGE
  );

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.items[0]?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPagesOrders = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const currentItemsOrders = filteredOrders.slice(
    (currentPageOrders - 1) * ITEMS_PER_PAGE,
    currentPageOrders * ITEMS_PER_PAGE
  );

  const filteredInquiries = inquiries; // Add search filter if needed
  const totalPagesInquiries = Math.ceil(filteredInquiries.length / ITEMS_PER_PAGE);
  const currentItemsInquiries = filteredInquiries.slice(
    (currentPageInquiries - 1) * ITEMS_PER_PAGE,
    currentPageInquiries * ITEMS_PER_PAGE
  );

  const selectedInquiryForConfirm = confirmInquiry ? inquiries.find(i => i.id === confirmInquiry.id) : null;

  // Pagination UI Component
  const PaginationControls = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (p: number) => void }) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100 dark:border-gray-900">
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-8 py-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 text-[9px] font-black uppercase tracking-[0.3em] disabled:opacity-30 flex items-center gap-3 hover:border-primary-500 transition-all text-gray-500 hover:text-primary-600"
        >
          <ChevronLeft size={14} />
          Prev
        </button>
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">
          Page {currentPage.toString().padStart(2, '0')} / {totalPages.toString().padStart(2, '0')}
        </span>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-8 py-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 text-[9px] font-black uppercase tracking-[0.3em] disabled:opacity-30 flex items-center gap-3 hover:border-primary-500 transition-all text-gray-500 hover:text-primary-600"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-white dark:bg-gray-950">
      
      {/* CMS Sidebar */}
      <aside className="w-full lg:w-72 border-r border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 z-20 overflow-x-auto lg:overflow-x-hidden no-scrollbar">
        <div className="flex lg:flex-col h-full lg:pt-12 p-4 lg:p-0 gap-2">
          <div className="hidden lg:block px-8 mb-8">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Administration</p>
          </div>
          
          <button 
            onClick={() => setActiveSection('DASHBOARD')}
            className={`flex items-center gap-4 px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all shrink-0 lg:shrink-1 border-b-2 lg:border-b-0 lg:border-l-4 ${
              activeSection === 'DASHBOARD' 
                ? 'text-primary-600 border-primary-600 bg-primary-50/10' 
                : 'text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50'
            }`}
          >
            <LayoutDashboard size={18} />
            Inventory
          </button>
          
          <button 
            onClick={() => setActiveSection('ORDERS')}
            className={`flex items-center gap-4 px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all shrink-0 lg:shrink-1 border-b-2 lg:border-b-0 lg:border-l-4 ${
              activeSection === 'ORDERS' 
                ? 'text-primary-600 border-primary-600 bg-primary-50/10' 
                : 'text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50'
            }`}
          >
            <ShoppingBag size={18} />
            Order History
          </button>

          <button 
            onClick={() => setActiveSection('INQUIRIES')}
            className={`flex items-center gap-4 px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all shrink-0 lg:shrink-1 border-b-2 lg:border-b-0 lg:border-l-4 ${
              activeSection === 'INQUIRIES' 
                ? 'text-primary-600 border-primary-600 bg-primary-50/10' 
                : 'text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50'
            }`}
          >
            <ListTodo size={18} />
            <div className="flex items-center justify-between w-full">
              Inquiries
              <span className={`ml-2 px-1.5 py-0.5 text-[8px] ${
                activeSection === 'INQUIRIES' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-900 text-gray-400'
              }`}>
                {inquiries.filter(i => i.status === 'pending').length}
              </span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 lg:p-12 xl:p-20 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-gray-950">
        
        {activeSection === 'DASHBOARD' && (
          <div className="animate-in fade-in duration-500">
            {/* Inventory Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {[
                { icon: <Package size={20} />, label: 'Assets', value: products.length, color: 'text-blue-500' },
                { icon: <Layers size={20} />, label: 'Categories', value: Object.keys(Category).length, color: 'text-purple-500' },
                { icon: <DollarSign size={20} />, label: 'Revenue', value: '$14.2k', color: 'text-emerald-500' },
                { icon: <Users size={20} />, label: 'Clients', value: '1,240', color: 'text-orange-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-[#0f0f0f] p-8 border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-40 group hover:border-primary-500 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                  <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-gray-100 dark:border-gray-800 pb-12">
              <div className="flex-grow w-full md:w-auto">
                <h1 className="text-5xl font-black mb-2 tracking-tighter uppercase">Inventory</h1>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Master Product Database</p>
                
                <div className="mt-8 relative max-w-md">
                   <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder="SEARCH REPOSITORY..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 text-[10px] font-black tracking-[0.2em] outline-none focus:border-primary-500 transition-all"
                   />
                </div>
              </div>
              <button 
                onClick={() => { setShowAddForm(true); setEditingId(null); }}
                className="w-full md:w-auto px-10 py-5 bg-gray-950 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all flex items-center justify-center gap-4 shadow-xl"
              >
                <Plus size={16} />
                Create Entry
              </button>
            </div>

            {/* Inventory Table */}
            <div className="hidden sm:block overflow-x-auto border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 shadow-sm custom-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#080808] border-b border-gray-100 dark:border-gray-900">
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Identity</th>
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Classification</th>
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Inventory</th>
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Pricing</th>
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-900/50">
                  {currentItemsInventory.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-900/30 transition-colors group">
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-8">
                          <div className="w-14 h-14 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 overflow-hidden relative">
                             <img src={product.image} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all" alt="" />
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase tracking-tight group-hover:text-primary-600 transition-colors">{product.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 opacity-60">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-10">
                        <span className={`inline-block px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] border ${getCategoryColor(product.category)}`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-primary-500' : 'bg-accent animate-pulse'}`}></div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 10 ? 'text-gray-500' : 'text-accent'}`}>
                            {product.stock} Units
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-10 font-black text-sm tracking-tighter text-gray-900 dark:text-white">${product.price.toFixed(2)}</td>
                      <td className="px-10 py-10 text-right">
                        <div className="flex justify-end gap-8 transition-all">
                          <button onClick={() => startEdit(product)} className="text-gray-400 hover:text-primary-600 transition-colors">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="text-gray-300 hover:text-accent transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List View - Inventory */}
            <div className="sm:hidden space-y-4">
              {currentItemsInventory.map(product => (
                <div key={product.id} className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 p-6 space-y-6 group animate-in slide-in-from-bottom-2 duration-300 shadow-sm">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 overflow-hidden relative shrink-0">
                      <img src={product.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-black text-sm uppercase tracking-tight truncate">{product.name}</p>
                        <span className="text-sm font-black text-primary-600">${product.price.toFixed(2)}</span>
                      </div>
                      <div className="mt-3">
                        <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] border ${getCategoryColor(product.category)}`}>
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-900">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-primary-500' : 'bg-accent animate-pulse'}`}></div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 10 ? 'text-gray-500' : 'text-accent'}`}>
                        {product.stock} UNITS
                      </span>
                    </div>
                    <div className="flex gap-8">
                      <button onClick={() => startEdit(product)} className="text-gray-400">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-gray-300">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Inventory Pagination */}
            <PaginationControls 
              currentPage={currentPageInventory} 
              totalPages={totalPagesInventory} 
              onPageChange={setCurrentPageInventory} 
            />
          </div>
        )}

        {activeSection === 'ORDERS' && (
          <div className="animate-in fade-in duration-500">
            {/* Orders Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { label: 'Total Volume', value: orders.length, icon: <Receipt size={20} />, color: 'text-blue-500' },
                { label: 'Successful Delivery', value: orders.filter(o => o.status === 'completed').length, icon: <CheckCircle2 size={20} />, color: 'text-emerald-500' },
                { label: 'Pending Processing', value: orders.filter(o => o.status === 'pending').length, icon: <Clock size={20} />, color: 'text-yellow-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-[#0f0f0f] p-8 border border-gray-100 dark:border-gray-800 flex items-center gap-6 group hover:border-primary-500 transition-all">
                   <div className={`${stat.color} p-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800`}>
                     {stat.icon}
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                     <p className="text-3xl font-black">{stat.value}</p>
                   </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-gray-100 dark:border-gray-800 pb-12">
              <div className="flex-grow w-full md:w-auto">
                <h1 className="text-5xl font-black mb-2 tracking-tighter uppercase">Order History</h1>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Global Transaction Logs</p>
                
                <div className="mt-8 relative max-w-md">
                   <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder="SEARCH BY ORDER ID OR USER..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 text-[10px] font-black tracking-[0.2em] outline-none focus:border-primary-500 transition-all"
                   />
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="hidden sm:block overflow-x-auto border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 shadow-sm custom-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#080808] border-b border-gray-100 dark:border-gray-900">
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Asset Entry</th>
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Client Identity</th>
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Timestamp</th>
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Valuation</th>
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-900/50">
                  {currentItemsOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-900/30 transition-colors group">
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-8">
                          <div className="w-14 h-14 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 overflow-hidden relative">
                             <img src={order.items[0]?.image || 'https://picsum.photos/100/100'} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all" alt="" />
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase tracking-tight group-hover:text-primary-600 transition-colors">{order.items[0]?.name || 'Nexus Item'}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 opacity-60">REF: {order.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-3">
                           <UserIcon size={14} className="text-gray-400" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                             {order.userId}
                           </span>
                        </div>
                      </td>
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-3">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                            {order.date}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-10">
                         <div className="flex flex-col gap-1.5">
                            <span className="font-black text-sm tracking-tighter text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                            <span className={`inline-block w-fit px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border ${getOrderStatusStyle(order.status)}`}>
                              {order.status}
                            </span>
                         </div>
                      </td>
                      <td className="px-10 py-10 text-right">
                        <button className="p-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 text-gray-300 hover:text-primary-600 hover:border-primary-500 transition-all">
                           <ExternalLink size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List View - Orders */}
            <div className="sm:hidden space-y-4">
              {currentItemsOrders.map(order => (
                <div key={order.id} className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 p-6 space-y-6 group animate-in slide-in-from-bottom-2 duration-300 shadow-sm">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 overflow-hidden relative shrink-0">
                      <img src={order.items[0]?.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-black text-sm uppercase tracking-tight truncate">{order.items[0]?.name}</p>
                        <span className="text-sm font-black text-primary-600">${order.total.toFixed(2)}</span>
                      </div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">ID: {order.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-900">
                    <div className="flex flex-col gap-1">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{order.date}</p>
                      <span className={`inline-block w-fit px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border ${getOrderStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <button className="p-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 text-gray-300">
                       <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order History Pagination */}
            <PaginationControls 
              currentPage={currentPageOrders} 
              totalPages={totalPagesOrders} 
              onPageChange={setCurrentPageOrders} 
            />
          </div>
        )}

        {activeSection === 'INQUIRIES' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-gray-100 dark:border-gray-800 pb-12">
              <div>
                <div className="flex items-center gap-3 text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-4">
                  <Shield size={14} />
                  Verification Pipeline
                </div>
                <h1 className="text-5xl font-black mb-2 tracking-tighter uppercase">Inquiries</h1>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Manual Decision Logging</p>
              </div>
              <div className="bg-white dark:bg-black px-8 py-5 border border-gray-100 dark:border-gray-900 shadow-sm flex flex-col items-center">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Queue Depth</p>
                <p className="text-3xl font-black text-primary-600">{inquiries.filter(i => i.status === 'pending').length}</p>
              </div>
            </div>

            <div className="space-y-8">
              {currentItemsInquiries.map((inq) => (
                <div key={inq.id} className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 overflow-hidden hover:border-primary-500/30 transition-all shadow-sm">
                  {/* Desktop Inquiry Layout */}
                  <div className="hidden lg:flex flex-row">
                    <div className="w-1/4 p-10 border-r border-gray-50 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-900/10">
                      <div className="flex items-center gap-4 mb-8">
                        <img src={inq.userAvatar} className="w-12 h-12 border border-gray-100 dark:border-gray-800" alt="" />
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
                        <div className={`inline-block px-4 py-1.5 border text-[8px] font-black uppercase tracking-[0.2em] ${getInquiryStatusStyle(inq.status)}`}>
                          {inq.status}
                        </div>
                      </div>
                    </div>
                    <div className="w-2/4 p-10 flex flex-col justify-center">
                      <div className="grid grid-cols-2 gap-16">
                        <div>
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-4">Target Order</label>
                          <p className="text-lg font-black uppercase tracking-tight mb-1">{inq.productName}</p>
                          <p className="text-2xl font-black tracking-tighter text-primary-600">${inq.price.toFixed(2)}</p>
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-4">Audit Trace</label>
                          <div className="flex items-center gap-3 mb-3">
                            <Wallet size={14} className="text-gray-400" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{inq.bankName}PAY MERCHANT</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <UserIcon size={14} className="text-gray-400" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">{inq.senderName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/4 p-10 flex flex-col justify-center gap-4 border-l border-gray-50 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-900/10">
                      {inq.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => setConfirmInquiry({ id: inq.id, action: 'approve' })}
                            className="w-full py-5 bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-950 transition-all flex items-center justify-center gap-3 shadow-lg"
                          >
                            <Check size={16} />
                            Approve Payment
                          </button>
                          <button 
                            onClick={() => setConfirmInquiry({ id: inq.id, action: 'reject' })}
                            className="w-full py-5 border border-gray-200 dark:border-gray-800 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-accent hover:border-accent transition-all flex items-center justify-center gap-3"
                          >
                            <Ban size={16} />
                            Flag Dispute
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                          {inq.status === 'approved' ? <CheckCircle2 size={20} className="text-primary-500" /> : <X size={20} className="text-accent" />}
                          Record Sealed
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Inquiry Layout */}
                  <div className="lg:hidden p-8 space-y-8">
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-4">
                         <img src={inq.userAvatar} className="w-12 h-12 border border-gray-100 dark:border-gray-800" alt="" />
                         <div>
                            <p className="text-[11px] font-black uppercase tracking-tight">{inq.userName}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{inq.date}</p>
                         </div>
                       </div>
                       <div className={`px-3 py-1 border text-[8px] font-black uppercase tracking-[0.2em] ${getInquiryStatusStyle(inq.status)}`}>
                          {inq.status}
                       </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-black p-6 border border-gray-100 dark:border-gray-900 space-y-4">
                       <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Product</p>
                          <p className="text-sm font-black uppercase tracking-tight">{inq.productName}</p>
                       </div>
                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Trace: {inq.bankName}</p>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">{inq.senderName}</p>
                          </div>
                          <p className="text-xl font-black text-primary-600">${inq.price.toFixed(2)}</p>
                       </div>
                    </div>

                    {inq.status === 'pending' && (
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setConfirmInquiry({ id: inq.id, action: 'approve' })}
                          className="flex-[2] py-4 bg-primary-600 text-white text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => setConfirmInquiry({ id: inq.id, action: 'reject' })}
                          className="flex-1 py-4 border border-gray-200 dark:border-gray-800 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center justify-center gap-3"
                        >
                          <Ban size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {inquiries.length === 0 && (
                <div className="py-40 text-center border border-dashed border-gray-100 dark:border-gray-900">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Zero pending inquiries.</p>
                </div>
              )}
            </div>

            {/* Inquiries Pagination */}
            <PaginationControls 
              currentPage={currentPageInquiries} 
              totalPages={totalPagesInquiries} 
              onPageChange={setCurrentPageInquiries} 
            />
          </div>
        )}
      </main>

      {/* Inquiry Action Confirmation Modal */}
      {confirmInquiry && selectedInquiryForConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-950 w-full max-w-md border border-gray-100 dark:border-gray-800 shadow-2xl p-10 text-center relative">
            <button 
              onClick={() => setConfirmInquiry(null)}
              className="absolute top-6 right-6 text-gray-300 hover:text-gray-600 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {confirmInquiry.action === 'approve' ? (
              <div className="animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-primary-500/10 text-primary-600 rounded-full">
                  <UserCheck size={40} />
                </div>
                <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase">Confirm Payment</h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-10 font-medium uppercase tracking-[0.2em] leading-relaxed">
                  Proceed with product delivery for <span className="font-bold text-gray-900 dark:text-white">{selectedInquiryForConfirm.userName}</span>? 
                  A <span className="text-primary-600 font-black">${selectedInquiryForConfirm.price.toFixed(2)}</span> transaction will be sealed.
                </p>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => handleInquiryAction(selectedInquiryForConfirm.id, 'approved')}
                    className="w-full py-5 bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-gray-950 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary-500/20"
                  >
                    <CheckCircle2 size={16} /> Confirm Approval
                  </button>
                  <button 
                    onClick={() => setConfirmInquiry(null)}
                    className="w-full py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors"
                  >
                    Keep Pending
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-accent/10 text-accent rounded-full">
                  <UserX size={40} />
                </div>
                <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase">Reject Transaction</h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-10 font-medium uppercase tracking-[0.2em] leading-relaxed">
                  This action will flag the payment from <span className="font-bold text-gray-900 dark:text-white">{selectedInquiryForConfirm.senderName}</span> as invalid. 
                  No product will be delivered.
                </p>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => handleInquiryAction(selectedInquiryForConfirm.id, 'rejected')}
                    className="w-full py-5 bg-accent text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-red-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20"
                  >
                    <Ban size={16} /> Confirm Rejection
                  </button>
                  <button 
                    onClick={() => setConfirmInquiry(null)}
                    className="w-full py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Form Modal (Shared for Add/Edit) */}
      {(showAddForm || editingId) && ( activeSection === 'DASHBOARD' ) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-950 w-full max-w-2xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-900 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
              <div>
                <h2 className="text-2xl font-black tracking-tighter uppercase">
                  {editingId ? 'Edit Entry' : 'New Entry'}
                </h2>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Inventory Protocol</p>
              </div>
              <button onClick={() => { setEditingId(null); setShowAddForm(false); }} className="text-gray-300 hover:text-primary-500 transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <div>
                <label className={labelClass}>Product Identity</label>
                <input type="text" placeholder="e.g. ChatGPT Plus" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Unit Price ($)</label>
                  <input type="number" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Stock Level</label>
                  <input type="number" value={formData.stock || 0} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Classification</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as Category })} className={`${inputClass} appearance-none cursor-pointer`}>
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat} className="bg-white dark:bg-gray-950">{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Technical Overview</label>
                <textarea placeholder="Product functionality..." value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className={`${inputClass} h-32 resize-none`} />
              </div>
              <div>
                <label className={labelClass}>Resource Asset (URL)</label>
                <input type="text" placeholder="https://..." value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="px-10 py-8 border-t border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/20 flex items-center justify-between">
              <button onClick={() => { setEditingId(null); setShowAddForm(false); }} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Discard</button>
              <button onClick={handleSave} className="px-12 py-5 bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-950 transition-all flex items-center gap-3">
                <Save size={16} /> Confirm Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMS;
