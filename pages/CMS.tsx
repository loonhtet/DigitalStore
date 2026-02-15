
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ListTodo, BarChart3 } from 'lucide-react';
import { Product, User } from '../types';

interface CMSProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  user: User | null;
}

const CMS: React.FC<CMSProps> = ({ user }) => {
  const location = useLocation();
  
  if (!user?.isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center">
        <h1 className="text-4xl font-black mb-4 tracking-tight uppercase">Access Denied</h1>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Administrator privilege required.</p>
      </div>
    );
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-white dark:bg-gray-950">
      
      {/* CMS Sidebar */}
      <aside className="w-full lg:w-72 border-r border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 z-20 overflow-x-auto lg:overflow-x-hidden no-scrollbar">
        <div className="flex lg:flex-col h-full lg:pt-12 p-4 lg:p-0 gap-2">
          <div className="hidden lg:block px-8 mb-8">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Administration</p>
          </div>
          
          <Link 
            to="/cms"
            className={`flex items-center gap-4 px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all shrink-0 lg:shrink-1 border-b-2 lg:border-b-0 lg:border-l-4 ${
              isActive('/cms') 
                ? 'text-primary-600 border-primary-600 bg-primary-50/10' 
                : 'text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50'
            }`}
          >
            <LayoutDashboard size={18} />
            Inventory
          </Link>
          
          <Link 
            to="/cms/orders"
            className={`flex items-center gap-4 px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all shrink-0 lg:shrink-1 border-b-2 lg:border-b-0 lg:border-l-4 ${
              isActive('/cms/orders') 
                ? 'text-primary-600 border-primary-600 bg-primary-50/10' 
                : 'text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50'
            }`}
          >
            <ShoppingBag size={18} />
            Order History
          </Link>

          <Link 
            to="/cms/inquiries"
            className={`flex items-center gap-4 px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all shrink-0 lg:shrink-1 border-b-2 lg:border-b-0 lg:border-l-4 ${
              isActive('/cms/inquiries') 
                ? 'text-primary-600 border-primary-600 bg-primary-50/10' 
                : 'text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50'
            }`}
          >
            <ListTodo size={18} />
            Inquiries
          </Link>

          <Link 
            to="/cms/usage"
            className={`flex items-center gap-4 px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all shrink-0 lg:shrink-1 border-b-2 lg:border-b-0 lg:border-l-4 ${
              isActive('/cms/usage') 
                ? 'text-primary-600 border-primary-600 bg-primary-50/10' 
                : 'text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50'
            }`}
          >
            <BarChart3 size={18} />
            Usage Insights
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 lg:p-12 xl:p-20 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-gray-950">
        <Outlet />
      </main>
    </div>
  );
};

export default CMS;
