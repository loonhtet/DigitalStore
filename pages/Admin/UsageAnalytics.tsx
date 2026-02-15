
import React from 'react';
import { BarChart3, Users, PieChart, Activity, ArrowUpRight } from 'lucide-react';
import { MOCK_USAGE_DATA } from '../../constants';

const UsageAnalytics: React.FC = () => {
  const totalActiveUsers = MOCK_USAGE_DATA.reduce((acc, curr) => acc + curr.activeUsers, 0);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-16">
        <div className="flex items-center gap-3 text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-4">
          <Activity size={14} /> System Metrics
        </div>
        <h1 className="text-5xl font-black mb-2 tracking-tighter uppercase text-gray-900 dark:text-white">Usage Insights</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Global Product Adoption & Plan Distribution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          { label: 'Global Active Users', value: totalActiveUsers.toLocaleString(), icon: <Users size={20} />, color: 'text-primary-500' },
          { label: 'Retention Rate', value: '94.2%', icon: <Activity size={20} />, color: 'text-blue-500' },
          { label: 'Avg LTV', value: '$420', icon: <BarChart3 size={20} />, color: 'text-purple-500' },
          { label: 'Growth M/M', value: '+12.4%', icon: <ArrowUpRight size={20} />, color: 'text-emerald-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#0f0f0f] p-8 border border-gray-100 dark:border-gray-800">
             <div className="flex justify-between items-start mb-6">
                <div className={`${stat.color} p-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800`}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
             </div>
             <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-12">
        {MOCK_USAGE_DATA.map((product) => (
          <div key={product.productId} className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Product Header */}
              <div className="lg:w-1/3 p-10 border-r border-gray-50 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-900/10 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-2">{product.productName}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {product.productId}</p>
                </div>
                <div className="mt-12">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Active Node Connections</p>
                   <p className="text-5xl font-black text-primary-500 tracking-tighter">{product.activeUsers.toLocaleString()}</p>
                </div>
              </div>

              {/* Plans Breakdown */}
              <div className="lg:w-2/3 p-10">
                <div className="flex items-center justify-between mb-8">
                   <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Plan Allocation Detail</h4>
                   <PieChart size={16} className="text-gray-300" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {product.plans.map((plan, idx) => {
                    const percentage = ((plan.count / product.activeUsers) * 100).toFixed(1);
                    return (
                      <div key={idx} className="p-6 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-900">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-white">{plan.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{plan.count.toLocaleString()} Users</p>
                          </div>
                          <span className="text-[10px] font-black text-primary-600 bg-primary-500/10 px-2 py-1">{percentage}%</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-[9px] font-bold uppercase text-gray-500">
                            <span>Contribution</span>
                            <span>${plan.revenue.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 bg-white dark:bg-gray-900">
                            <div 
                              className="h-full bg-primary-500 transition-all duration-1000" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsageAnalytics;
