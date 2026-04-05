import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBikes } from '../context/BikeContext';
import { adminAPI } from '../lib/api';
import { 
  Shield, Bike, Users, IndianRupee, Trash2, Search, 
  TrendingUp, Eye, CheckCircle, 
  BarChart3, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { currentUser, isAdmin, isDemo } = useAuth();
  const { bikes, deleteBike } = useBikes();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Auth guard
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Derive stats from context
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

  const handleDeleteBike = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      await deleteBike(id);
    }
  };

  const filteredBikes = bikes.filter(bike => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return bike.brand?.toLowerCase().includes(q) || bike.model?.toLowerCase().includes(q) || 
           bike.sellerName?.toLowerCase().includes(q) || bike.locality?.toLowerCase().includes(q);
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'listings', label: 'Listings', icon: Bike },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const statCards = [
    { label: 'Total Listings', value: stats.totalBikes, icon: Bike, bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', change: `+${stats.newBikesThisWeek} this week` },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, bg: 'bg-blue-50', text: 'text-blue-600', change: `+${stats.newUsersThisWeek} this week` },
    { label: 'Active Listings', value: stats.activeBikes, icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-600', change: `${Math.round((stats.activeBikes/(stats.totalBikes||1))*100)}% active` },
    { label: 'Market Value', value: formatPrice(stats.totalValue), icon: IndianRupee, bg: 'bg-amber-50', text: 'text-amber-600', change: 'Total inventory' },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-50 text-green-700 border-green-200',
      sold: 'bg-red-50 text-red-700 border-red-200',
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      rejected: 'bg-slate-50 text-slate-700 border-slate-200',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-8 lg:mb-12">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900">Admin Panel</h1>
            <p className="text-slate-500 font-bold text-[11px] sm:text-sm">Platform management & analytics</p>
          </div>
        </div>
        {isDemo && (
          <div className="sm:ml-auto bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-200 self-start">
            Demo Mode
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl sm:rounded-2xl mb-5 sm:mb-8 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-5 sm:space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-white p-3.5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm">
                <div className={`w-9 h-9 sm:w-12 sm:h-12 ${stat.bg} ${stat.text} rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 sm:mb-4`}>
                  <stat.icon size={18} />
                </div>
                <div className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="text-slate-400 font-bold text-[9px] sm:text-xs uppercase tracking-wider mt-0.5">{stat.label}</div>
                <div className="text-[9px] sm:text-xs text-green-600 font-bold mt-1.5 sm:mt-2 flex items-center gap-1">
                  <TrendingUp size={11} />
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          {/* Brand & Type Distribution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-sm sm:text-base font-black text-slate-900 mb-3 sm:mb-6">By Brand</h3>
              <div className="space-y-2.5 sm:space-y-3">
                {Object.entries(stats.brandStats).sort((a, b) => b[1] - a[1]).map(([brand, count]) => (
                  <div key={brand} className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-slate-600 font-medium">{brand}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 sm:w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                          style={{ width: `${(count / (stats.totalBikes || 1)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-500 w-5 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-sm sm:text-base font-black text-slate-900 mb-3 sm:mb-6">By Type</h3>
              <div className="flex gap-4 sm:gap-6 items-center justify-center h-28 sm:h-40">
                {Object.entries(stats.typeStats).map(([type, count]) => {
                  const pct = Math.round((count / (stats.totalBikes || 1)) * 100);
                  return (
                    <div key={type} className="text-center">
                      <div className="relative w-16 h-16 sm:w-24 sm:h-24 mx-auto">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="#f1f5f9" strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke={type === 'Bike' ? '#d946ef' : '#3b82f6'} strokeWidth="3"
                            strokeDasharray={`${pct}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-base sm:text-xl font-black text-slate-900">{pct}%</span>
                        </div>
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500 mt-1.5 sm:mt-2 block">{type} ({count})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text" placeholder="Search listings..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="text-xs font-bold text-slate-500">{filteredBikes.length} listings</span>
          </div>

          {/* Responsive Table / Cards */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 lg:px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bike</th>
                    <th className="px-4 lg:px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Seller</th>
                    <th className="px-4 lg:px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                    <th className="px-4 lg:px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-4 lg:px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredBikes.map(bike => (
                    <tr key={bike.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <img src={getImageUrl(bike)} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = '/images/bike1.jpg'; }} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{bike.brand} {bike.model}</div>
                            <div className="text-[10px] font-bold text-slate-400">{bike.locality} • {bike.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="text-sm font-bold text-slate-600">{bike.sellerName}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="text-sm font-black text-primary-600">{formatPrice(bike.price)}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusBadge(bike.status || 'active')}`}>
                          {bike.status || 'active'}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-1">
                          <a href={`/details/${bike.id}`} className="p-1.5 text-slate-300 hover:text-primary-500 transition-colors" aria-label="View listing">
                            <Eye size={16} />
                          </a>
                          <button onClick={() => handleDeleteBike(bike.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors" aria-label="Delete listing">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredBikes.map(bike => (
                <div key={bike.id} className="p-3.5 sm:p-4 flex items-center gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={getImageUrl(bike)} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = '/images/bike1.jpg'; }} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="font-bold text-slate-900 text-sm truncate">{bike.brand} {bike.model}</div>
                    <div className="text-[11px] text-slate-500">{bike.sellerName} • {bike.locality}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-black text-primary-600">{formatPrice(bike.price)}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusBadge(bike.status || 'active')}`}>
                        {bike.status || 'active'}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteBike(bike.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors shrink-0" aria-label="Delete listing">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-50">
              <h2 className="text-sm sm:text-base font-black text-slate-900">Registered Users</h2>
              <p className="text-xs text-slate-500 mt-1">
                {isDemo ? 'Demo data — connect Supabase for real user management' : 'Manage platform users and roles'}
              </p>
            </div>

            <div className="divide-y divide-slate-50">
              {[
                { name: 'Rahul Sharma', email: 'rahul@example.com', location: 'Karol Bagh', role: 'user', listings: 1 },
                { name: 'Priya Singh', email: 'priya@example.com', location: 'Lajpat Nagar', role: 'user', listings: 1 },
                { name: 'Admin User', email: 'admin@delhibikeshub.com', location: 'Delhi', role: 'admin', listings: 0 },
              ].map((user, i) => (
                <div key={i} className="p-3.5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{user.location} • {user.listings} listings</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border self-start sm:self-auto ${
                    user.role === 'admin' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
