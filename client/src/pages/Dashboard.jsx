import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBikes } from '../context/BikeContext';
import { User, Mail, Phone, MapPin, Calendar, Plus, Trash2, Edit, Bike, ShieldCheck, Eye } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { bikes, deleteBike } = useBikes();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const userBikes = bikes.filter(bike => 
    bike.userId === currentUser.id || bike.user_id === currentUser.id
  );

  const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  const getImageUrl = (bike) => {
    if (bike.images && bike.images.length > 0) {
      return typeof bike.images[0] === 'string' ? bike.images[0] : bike.images[0].url;
    }
    return `/images/bike${((typeof bike.id === 'number' ? bike.id : 1) % 6) + 1}.jpg`;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      await deleteBike(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-20 sm:h-24 bg-gradient-to-r from-primary-500 to-primary-700"></div>
            <div className="relative z-10 pt-2 sm:pt-4">
              <div className="w-18 h-18 sm:w-24 sm:h-24 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-xl border-4 border-white mb-3 sm:mb-4">
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-black">
                  {currentUser.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900">{currentUser.name}</h2>
              <div className="flex items-center justify-center gap-1 text-primary-600 font-bold text-xs mt-1">
                <ShieldCheck size={14} />
                Verified Member
              </div>
            </div>

            <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 text-left">
              {[
                { icon: Mail, value: currentUser.email },
                { icon: Phone, value: currentUser.phone },
                { icon: MapPin, value: currentUser.location },
                { icon: Calendar, value: `Joined ${formatDate(currentUser.created_at || currentUser.joinDate)}` },
              ].filter(item => item.value).map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-slate-50 rounded-xl">
                  <item.icon size={15} className="text-slate-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-600 truncate">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-primary-50 rounded-xl p-3 text-center">
                <div className="text-xl font-black text-primary-600">{userBikes.length}</div>
                <div className="text-[10px] font-bold text-primary-500 uppercase">Listings</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="text-xl font-black text-slate-700">{userBikes.filter(b => b.status === 'active' || !b.status).length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Content */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">Your Listings</h1>
            <Link
              to="/add"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 transition-all active:scale-95"
            >
              <Plus size={18} />
              Sell Another Bike
            </Link>
          </div>

          {userBikes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {userBikes.map(bike => (
                <div key={bike.id} className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
                  <div className="flex gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                      <img 
                        src={getImageUrl(bike)} 
                        alt={bike.model} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/images/bike1.jpg'; }}
                      />
                    </div>
                    <div className="flex-grow min-w-0 flex flex-col">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-black text-slate-900 text-sm sm:text-base truncate">{bike.brand} {bike.model}</h3>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase shrink-0 ${
                          bike.status === 'sold' ? 'text-red-600 bg-red-50' :
                          bike.status === 'pending' ? 'text-amber-600 bg-amber-50' :
                          'text-primary-600 bg-primary-50'
                        }`}>
                          {bike.status || bike.type}
                        </span>
                      </div>
                      <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                        {formatPrice(bike.price)}
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-slate-400 text-[10px] sm:text-xs font-bold mt-1 sm:mt-2">
                        <span className="flex items-center gap-1"><Calendar size={11} /> {bike.year}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} /> {bike.locality}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-auto pt-2 sm:pt-3">
                        <Link
                          to={`/details/${bike.id}`}
                          className="p-1.5 sm:p-2 bg-slate-50 text-slate-400 hover:text-primary-600 rounded-lg sm:rounded-xl transition-colors"
                          title="View"
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(bike.id)}
                          className="p-1.5 sm:p-2 bg-slate-50 text-slate-400 hover:text-red-600 rounded-lg sm:rounded-xl transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 lg:py-20 bg-white rounded-2xl sm:rounded-[3rem] border border-dashed border-slate-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-slate-400">
                <Bike size={32} />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900">No listings yet</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">
                Create your first listing and reach buyers in Delhi.
              </p>
              <Link to="/add" className="mt-6 sm:mt-8 inline-block text-primary-600 font-bold text-sm hover:underline">
                Create my first listing
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
