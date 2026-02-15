
import React, { useState } from 'react';
import { ShoppingBag, CheckCircle2, Clock, Receipt, Search, User as UserIcon, ExternalLink } from 'lucide-react';
import { Order } from '../../types';
import { MOCK_ORDERS } from '../../constants';

const ITEMS_PER_PAGE = 5;

const Orders: React.FC = () => {
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.items[0]?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const currentItems = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'bg-primary-500/10 text-primary-600 border-primary-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { label: 'Total Volume', value: orders.length, icon: <Receipt size={20} />, color: 'text-blue-500' },
          { label: 'Successful Delivery', value: orders.filter(o => o.status === 'completed').length, icon: <CheckCircle2 size={20} />, color: 'text-emerald-500' },
          { label: 'Pending Processing', value: orders.filter(o => o.status === 'pending').length, icon: <Clock size={20} />, color: 'text-yellow-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#0f0f0f] p-8 border border-gray-100 dark:border-gray-800 flex items-center gap-6">
             <div className={`${stat.color} p-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800`}>
               {stat.icon}
             </div>
             <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <h1 className="text-5xl font-black mb-2 tracking-tighter uppercase text-gray-900 dark:text-white">Order History</h1>
        <div className="mt-8 relative max-w-md">
           <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
           <input type="text" placeholder="SEARCH LOGS..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 text-[10px] font-black tracking-[0.2em] outline-none" />
        </div>
      </div>

      <div className="border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#080808] border-b border-gray-100 dark:border-gray-900">
              <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Asset</th>
              <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Client</th>
              <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Valuation</th>
              <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-right">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-900/50">
            {currentItems.map(order => (
              <tr key={order.id} className="group">
                <td className="px-10 py-10">
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white">{order.items[0]?.name}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">REF: {order.id}</p>
                </td>
                <td className="px-10 py-10">
                  <div className="flex items-center gap-3">
                     <UserIcon size={14} className="text-gray-400" />
                     <span className="text-[10px] font-black uppercase text-gray-500">{order.userId}</span>
                  </div>
                </td>
                <td className="px-10 py-10">
                  <span className="font-black text-sm text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                  <span className={`block w-fit px-2 py-0.5 text-[8px] font-black uppercase border mt-2 ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-10 py-10 text-right">
                  <button className="p-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 text-gray-300 hover:text-primary-600 transition-all">
                     <ExternalLink size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
