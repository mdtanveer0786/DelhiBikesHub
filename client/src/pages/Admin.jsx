import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBikes } from '../context/BikeContext';
import ConfirmModal from '../components/ConfirmModal';
import { 
  Shield, Bike, Users, IndianRupee, Trash2, Search, 
  TrendingUp, Eye, CheckCircle, 
  BarChart3, ChevronRight, MoreVertical
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Admin = () => {
  const { currentUser, isDemo } = useAuth();
  const { bikes, deleteBike } = useBikes();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bikeToDelete, setBikeToDelete] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const stats = {
    totalBikes: bikes.length,
    activeBikes: bikes.filter(b => !b.status || b.status === 'active').length,
    totalUsers: 3,
    totalValue: bikes.reduce((acc, b) => acc + parseInt(b.price || 0), 0),
    typeStats: bikes.reduce((acc, b) => { acc[b.type] = (acc[b.type] || 0) + 1; return acc; }, {}),
    brandStats: bikes.reduce((acc, b) => { acc[b.brand] = (acc[b.brand] || 0) + 1; return acc; }, {}),
    newBikesThisWeek: 2,
    newUsersThisWeek: 1,
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const handleDeleteBike = async () => {
    if (bikeToDelete) {
      await deleteBike(bikeToDelete);
      setBikeToDelete(null);
    }
  };

  const openDeleteModal = (id) => {
    setBikeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const filteredBikes = bikes.filter(bike => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return bike.brand?.toLowerCase().includes(q) || bike.model?.toLowerCase().includes(q) || 
           bike.sellerName?.toLowerCase().includes(q) || bike.locality?.toLowerCase().includes(q);
  });

  const tabs = [
    { id: 'overview', label: 'Hub Intelligence', icon: BarChart3 },
    { id: 'listings', label: 'Inventory Manager', icon: Bike },
    { id: 'users', label: 'User Network', icon: Users },
  ];

  const statCards = [
    { label: 'Total Listings', value: stats.totalBikes, icon: Bike, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Network', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Inventory Value', value: formatPrice(stats.totalValue), icon: IndianRupee, color: 'text-[#d32f2f]', bg: 'bg-red-50' },
    { label: 'Verification rate', value: '100%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-50 text-green-700 border-green-100',
      sold: 'bg-red-50 text-red-700 border-red-100',
      pending: 'bg-amber-50 text-amber-700 border-amber-100',
    };
    return styles[status] || styles.active;
  };

  const getImageUrl = (bike) => {
    if (bike.images && bike.images.length > 0) {
      return typeof bike.images[0] === 'string' ? bike.images[0] : bike.images[0].url;
    }
    return `/images/bike${((typeof bike.id === 'number' ? bike.id : 1) % 6) + 1}.jpg`;
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen pt-24 lg:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Institutional Admin Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
           <div>
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 bg-[#24272c] text-white flex items-center justify-center rounded-lg shadow-lg">
                    <Shield size={20} />
                 </div>
                 <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">System Administration</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-[#24272c] tracking-tight">Marketplace Intelligence</h1>
           </div>
           {isDemo && (
             <div className="bg-amber-50 text-amber-700 border border-amber-100 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Sandbox Mode
             </div>
           )}
        </div>

        {/* Tab Navigation (Professional Pill Style) */}
        <div className="flex bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm mb-10 overflow-x-auto hide-scrollbar w-fit max-w-full">
           {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-[#24272c] text-white shadow-lg' : 'text-gray-400 hover:text-[#24272c]'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
           ))}
        </div>

        {/* Intelligence Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {statCards.map((stat, i) => (
                 <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-6`}>
                       <stat.icon size={24} />
                    </div>
                    <div className="text-3xl font-black text-[#24272c] leading-none mb-2">{stat.value}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50/50 rounded-full translate-x-12 -translate-y-12" />
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-black text-[#24272c] uppercase tracking-widest mb-10 border-b border-gray-50 pb-4">Portfolio Distribution</h3>
                  <div className="space-y-6">
                    {Object.entries(stats.brandStats).sort((a,b) => b[1]-a[1]).slice(0, 6).map(([brand, count]) => (
                      <div key={brand} className="flex items-center gap-4">
                        <span className="w-24 text-[11px] font-black text-gray-400 uppercase truncate">{brand}</span>
                        <div className="flex-grow h-2 bg-gray-50 rounded-full overflow-hidden">
                           <div className="h-full bg-[#d32f2f]" style={{ width: `${(count/stats.totalBikes)*100}%` }} />
                        </div>
                        <span className="text-xs font-black text-[#24272c] w-6">{count}</span>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <BarChart3 size={48} className="text-gray-100 mb-6" />
                  <h3 className="text-lg font-bold text-[#24272c]">Growth Analytics</h3>
                  <p className="text-gray-400 text-sm font-medium mt-2 max-w-xs">Connecting specialized BI systems for advanced volume-velocity mapping.</p>
                  <button className="mt-8 text-[10px] font-black uppercase text-[#d32f2f] hover:underline uppercase tracking-widest flex items-center gap-2">
                     Connect BI Suite <ChevronRight size={14} />
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* Inventory Management Table */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
               <div className="relative flex-grow group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#d32f2f]" size={18} />
                  <input
                    type="text" placeholder="Filter by brand, model, or locality..."
                    className="w-full bg-white border border-gray-100 focus:border-[#d32f2f]/30 py-4 pl-12 pr-4 rounded-xl text-sm font-bold text-[#24272c] placeholder:text-gray-400 focus:ring-4 focus:ring-[#d32f2f]/5 transition-all outline-none shadow-sm"
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <div className="bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center text-xs font-black text-gray-500 uppercase tracking-widest">
                  {filteredBikes.length} Records
               </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                           <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Listing Detail</th>
                           <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Seller Profile</th>
                           <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Asset Value</th>
                           <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Market State</th>
                           <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Control</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {filteredBikes.map(bike => (
                           <tr key={bike.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-5 text-sm">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                                       <img src={getImageUrl(bike)} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                       <div className="font-bold text-[#24272c]">{bike.brand} {bike.model}</div>
                                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{bike.year} • {bike.locality}</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-tight text-xs">{bike.sellerName}</td>
                              <td className="px-8 py-5 text-sm font-black text-[#d32f2f]">{formatPrice(bike.price)}</td>
                              <td className="px-8 py-5">
                                 <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(bike.status || 'active')}`}>
                                    {bike.status || 'active'}
                                 </span>
                              </td>
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-3 text-gray-400">
                                    <Link to={`/details/${bike.id}`} className="hover:text-[#24272c] transition-colors"><Eye size={18} /></Link>
                                    <button onClick={() => openDeleteModal(bike.id)} className="hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}

        {/* User Management State */}
        {activeTab === 'users' && (
           <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                 <div>
                    <h2 className="text-xl font-black text-[#24272c] tracking-tight">Access Control</h2>
                    <p className="text-sm font-medium text-gray-400 mt-1">Manage network authentication and merchant privileges.</p>
                 </div>
                 <button className="text-[10px] font-black uppercase text-[#d32f2f] tracking-widest bg-red-50 px-4 py-2 rounded-lg">Invite Merchant</button>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Premium Merchant', ads: 1 },
                  { name: 'Priya Singh', email: 'priya@example.com', role: 'Verified Seller', ads: 1 },
                  { name: 'DelhiBikes Admin', email: 'admin@hub.com', role: 'Super Administrator', ads: 0 }
                ].map((u, i) => (
                  <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-gray-50/50 transition-all">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center font-black text-[#24272c]">
                           {u.name.charAt(0)}
                        </div>
                        <div>
                           <div className="font-bold text-[#24272c]">{u.name}</div>
                           <div className="text-xs text-gray-400 font-medium">{u.email}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-10">
                        <div className="text-right">
                           <div className="text-[10px] font-black text-[#24272c] uppercase tracking-widest">{u.role}</div>
                           <div className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{u.ads} active assets</div>
                        </div>
                        <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors"><MoreVertical size={20} /></button>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBike}
        title="Admin: Execute Asset Deletion?"
        message="This control action will permanently scrub this listing data from the marketplace hub. It cannot be reverted."
        confirmText="Confirm Removal"
      />
    </div>
  );
};

export default Admin;
