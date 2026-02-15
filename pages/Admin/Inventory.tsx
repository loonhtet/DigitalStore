
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit3, Trash2, Save, Package, TrendingUp, DollarSign, Users, X, 
  Search, Layers, ChevronLeft, ChevronRight, Clock, Calendar
} from 'lucide-react';
import { Product, Category } from '../../types';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ITEMS_PER_PAGE = 8;

const Inventory: React.FC<InventoryProps> = ({ products, setProducts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: Category.OTHER,
    image: 'https://picsum.photos/400/300',
    features: ['Instant Access'],
    stock: 100
  });

  useEffect(() => setCurrentPage(1), [searchQuery]);

  const handleDelete = (id: string) => {
    if (confirm('Delete this entry?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    const timestamp = new Date().toISOString();
    
    if (editingId) {
      setProducts(prev => prev.map(p => p.id === editingId ? { 
        ...p, 
        ...formData, 
        updatedAt: timestamp 
      } as Product : p));
      setEditingId(null);
    } else {
      const newProduct = { 
        ...formData, 
        id: Date.now().toString(),
        createdAt: timestamp,
        updatedAt: timestamp
      } as Product;
      setProducts(prev => [...prev, newProduct]);
      setShowAddForm(false);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData(p);
    setShowAddForm(true);
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    }).toUpperCase();
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentItems = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case Category.AI: return 'text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30';
      case Category.DESIGN: return 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30';
      case Category.VPN: return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800';
    }
  };

  const inputClass = "w-full p-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 focus:border-primary-500 outline-none text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-white";
  const labelClass = "block text-[9px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]";

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {[
          { icon: <Package size={20} />, label: 'Assets', value: products.length, color: 'text-blue-500' },
          { icon: <Layers size={20} />, label: 'Categories', value: Object.keys(Category).length, color: 'text-purple-500' },
          { icon: <DollarSign size={20} />, label: 'Revenue', value: '$14.2k', color: 'text-emerald-500' },
          { icon: <Users size={20} />, label: 'Clients', value: '1,240', color: 'text-orange-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#0f0f0f] p-8 border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
              <div className={stat.color}>{stat.icon}</div>
            </div>
            <p className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-gray-100 dark:border-gray-800 pb-12">
        <div className="flex-grow w-full md:w-auto">
          <h1 className="text-5xl font-black mb-2 tracking-tighter uppercase text-gray-900 dark:text-white">Inventory</h1>
          <div className="mt-8 relative max-w-md">
             <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder="SEARCH REPOSITORY..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 text-[10px] font-black tracking-[0.2em] outline-none text-gray-900 dark:text-white" />
          </div>
        </div>
        <button onClick={() => { setShowAddForm(true); setEditingId(null); setFormData({ name: '', description: '', price: 0, category: Category.OTHER, image: 'https://picsum.photos/400/300', features: ['Instant Access'], stock: 100 }); }} className="w-full md:w-auto px-10 py-5 bg-gray-950 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-primary-600 dark:hover:bg-primary-500 transition-colors">
          <Plus size={16} /> Create Entry
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#080808] border-b border-gray-100 dark:border-gray-900">
              <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Identity</th>
              <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Classification</th>
              <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Inventory</th>
              <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Established</th>
              <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Synchronized</th>
              <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Pricing</th>
              <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-right">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-900/50">
            {currentItems.map(product => (
              <tr key={product.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-900/30 transition-colors group">
                <td className="px-8 py-10">
                  <div className="flex items-center gap-6">
                    <img src={product.image} className="w-12 h-12 object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all border border-gray-100 dark:border-gray-800" alt="" />
                    <div>
                      <p className="font-black text-sm uppercase tracking-tight text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-10">
                  <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border ${getCategoryColor(product.category)}`}>
                    {product.category}
                  </span>
                </td>
                <td className="px-8 py-10">
                  <div className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 ${product.stock > 10 ? 'bg-primary-500' : 'bg-accent'}`}></span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">{product.stock}</span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest ml-1">Units</span>
                  </div>
                </td>
                <td className="px-8 py-10">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-700 dark:text-gray-300">
                        <Calendar size={12} className="text-gray-400" />
                        {formatDate(product.createdAt)}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase">
                        <Clock size={10} />
                        {formatTime(product.createdAt)}
                      </div>
                   </div>
                </td>
                <td className="px-8 py-10">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-700 dark:text-gray-300">
                        <Calendar size={12} className="text-gray-400" />
                        {formatDate(product.updatedAt)}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase">
                        <Clock size={10} />
                        {formatTime(product.updatedAt)}
                      </div>
                   </div>
                </td>
                <td className="px-8 py-10">
                  <span className="text-sm font-black text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                </td>
                <td className="px-8 py-10 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => startEdit(product)} className="p-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-primary-600 hover:border-primary-500/50 transition-all">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-accent hover:border-accent/50 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-between items-center px-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Showing {currentItems.length} of {filteredProducts.length} entries
        </p>
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-3 border border-gray-100 dark:border-gray-900 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-gray-500"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-3 border border-gray-100 dark:border-gray-900 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-gray-500"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-950 w-full max-w-4xl border border-gray-100 dark:border-gray-800 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center">
               <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">{editingId ? 'Modify Entry' : 'New Entry'}</h2>
               <button onClick={() => setShowAddForm(false)} className="text-gray-300 hover:text-gray-950 dark:hover:text-white transition-colors">
                 <X size={24} />
               </button>
            </div>
            
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Product Identity</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputClass} placeholder="ASSET NAME" />
                </div>
                <div>
                  <label className={labelClass}>Classification</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as Category})} className={inputClass}>
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Pricing ($)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Stock Levels</label>
                    <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})} className={inputClass} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Visual Signature (URL)</label>
                  <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Manifest Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className={`${inputClass} h-32 resize-none`} placeholder="ENTRY SPECIFICATIONS..."></textarea>
                </div>
              </div>
            </div>

            <div className="p-10 bg-gray-50 dark:bg-[#080808] border-t border-gray-50 dark:border-gray-900 flex justify-end gap-6">
               <button onClick={() => setShowAddForm(false)} className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Abort</button>
               <button onClick={handleSave} className="px-14 py-5 bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-950 transition-all flex items-center gap-4">
                 <Save size={16} /> Commit Entry
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
