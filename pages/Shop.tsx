
import React, { useState, useMemo, useEffect } from 'react';
import { Info, Plus, X, ArrowRight, Share2, Check, LayoutGrid } from 'lucide-react';
import { Product, Category } from '../types';
import { useLocation } from 'react-router-dom';

interface ShopProps {
  products: Product[];
  initiatePurchase: (product: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ products, initiatePurchase }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const assetId = params.get('asset');
    if (assetId) {
      const product = products.find(p => p.id === assetId);
      if (product) setSelectedProduct(product);
    }
  }, [location, products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const handleShare = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const shareTitle = `${product.name} - Nexus Premium Product`;
    const shareText = `Get instant access to ${product.name}. Verified keys, no hassle. Only at Nexus Store.`;
    const shareUrl = window.location.origin + "/#/shop?asset=" + product.id;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      } catch (err) { console.debug('Sharing failed', err); }
    } else {
      await navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${shareUrl}`);
      setCopiedId(product.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-lg leading-relaxed uppercase tracking-wider">
            Premium subscription store for professionals.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary-600">
          <span className="w-2 h-2 bg-primary-500 animate-pulse"></span>
          Store is Live
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-20 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md py-6 mb-12 border-b border-gray-100 dark:border-gray-900 overflow-x-auto custom-scrollbar">
        <div className="flex gap-10 whitespace-nowrap px-2 pb-2">
          <button
            onClick={() => setActiveCategory('All')}
            className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 ${
              activeCategory === 'All' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            <LayoutGrid size={14} />
            All Products
          </button>
          {Object.values(Category).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 group ${
                activeCategory === cat ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              {cat}
              <span className={`text-[9px] font-bold px-2 py-0.5 transition-colors ${
                activeCategory === cat ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-900 group-hover:bg-gray-200'
              }`}>
                {products.filter(p => p.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 min-h-[400px]">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group flex flex-col animate-in fade-in zoom-in-95 duration-300">
            <div 
              className="relative aspect-square bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-900 overflow-hidden cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <img 
                src={product.image} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-700" 
                alt={product.name} 
              />
              <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/5 transition-colors" />
              
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/90 dark:bg-black/90 backdrop-blur px-2 py-1 text-[8px] font-black uppercase tracking-widest border border-gray-100 dark:border-gray-800">
                  {product.category}
                </span>
              </div>

              <button 
                onClick={(e) => handleShare(e, product)}
                className="absolute top-4 right-4 w-9 h-9 bg-white/90 dark:bg-black/90 backdrop-blur border border-gray-100 dark:border-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:text-primary-600"
              >
                {copiedId === product.id ? <Check size={14} className="text-primary-500" /> : <Share2 size={14} />}
              </button>
            </div>
            
            <div className="pt-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-black uppercase tracking-tight group-hover:text-primary-600 transition-colors">{product.name}</h3>
                <span className="text-xs font-black text-gray-500">${product.price.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed mb-6 font-medium uppercase tracking-tight">
                {product.description}
              </p>
              <div className="mt-auto flex gap-3">
                <button 
                  onClick={() => initiatePurchase(product)}
                  className="flex-grow py-4 bg-gray-950 dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all flex items-center justify-center gap-3"
                >
                  Buy Now
                  <ArrowRight size={12} />
                </button>
                <button 
                  onClick={() => setSelectedProduct(product)}
                  className="px-4 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-gray-400 hover:text-primary-600"
                >
                  <Info size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-40 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">No products found here.</p>
          </div>
        )}
      </div>

      {/* Product Detail */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="bg-white dark:bg-gray-950 w-full max-w-5xl border border-gray-100 dark:border-gray-900 shadow-2xl overflow-hidden custom-scrollbar overflow-y-auto max-h-[90vh]">
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 h-80 md:h-auto border-r border-gray-100 dark:border-gray-900 relative bg-gray-50 dark:bg-gray-900">
                <img src={selectedProduct.image} className="w-full h-full object-cover grayscale" alt={selectedProduct.name} />
                <button 
                  onClick={(e) => handleShare(e, selectedProduct)}
                  className="absolute top-6 right-6 w-12 h-12 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 flex items-center justify-center hover:text-primary-600 transition-all"
                >
                  {copiedId === selectedProduct.id ? <Check size={20} className="text-primary-500" /> : <Share2 size={20} />}
                </button>
              </div>
              <div className="md:w-1/2 p-12 lg:p-16 flex flex-col">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-4 block">{selectedProduct.category}</span>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">{selectedProduct.name}</h2>
                  </div>
                  <button onClick={() => setSelectedProduct(null)} className="p-2 text-gray-300 hover:text-gray-950 dark:hover:text-white transition-colors">
                    <X size={28} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-12 font-medium">{selectedProduct.description}</p>
                
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-gray-300">Features</h4>
                <ul className="grid grid-cols-1 gap-4 mb-12 flex-grow">
                  {selectedProduct.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 bg-primary-500"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-12 border-t border-gray-50 dark:border-gray-900 mt-auto">
                  <div className="text-3xl font-black tracking-tighter">${selectedProduct.price.toFixed(2)}</div>
                  <button 
                    onClick={() => { initiatePurchase(selectedProduct); setSelectedProduct(null); }}
                    className="px-12 py-6 bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-950 transition-all flex items-center gap-4"
                  >
                    Buy Now
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
