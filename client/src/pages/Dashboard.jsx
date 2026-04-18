import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBikes } from '../context/BikeContext';
import { Mail, Phone, MapPin, Calendar, Plus, Trash2, Bike, ShieldCheck, Eye, ChevronRight } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { bikes, deleteBike } = useBikes();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bikeToDelete, setBikeToDelete] = useState(null);

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

  const handleDelete = async () => {
    if (bikeToDelete) {
      await deleteBike(bikeToDelete);
      setBikeToDelete(null);
    }
  };

  const openDeleteModal = (id) => {
    setBikeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen pt-24 lg:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* User Profile Card (Sticky) */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-32">
              <div className="h-24 bg-[#d32f2f]/5 border-b border-gray-50 flex items-center px-8">
                 <div className="bg-white px-3 py-1 rounded-full text-[10px] font-black uppercase text-[#d32f2f] border border-[#d32f2f]/20">
                    Merchant Profile
                 </div>
              </div>
              <div className="px-8 pb-10 -mt-10">
                <div className="w-20 h-20 bg-white border-4 border-white shadow-lg rounded-2xl flex items-center justify-center text-2xl font-black text-[#d32f2f] mb-6 overflow-hidden">
                   {currentUser.profileImage ? (
                     <img src={currentUser.profileImage} className="w-full h-full object-cover" />
                   ) : currentUser.name?.charAt(0).toUpperCase()}
                </div>
                
                <h2 className="text-2xl font-black text-[#24272c] tracking-tight">{currentUser.name}</h2>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-1">
                   <ShieldCheck size={14} className="text-[#d32f2f]" /> Verified Member Since 2026
                </div>

                <div className="mt-10 space-y-4">
                   {[
                     { icon: Mail, value: currentUser.email, label: 'Email' },
                     { icon: Phone, value: currentUser.phone, label: 'Mobile' },
                     { icon: MapPin, value: currentUser.location, label: 'Location' },
                     { icon: Calendar, value: `Joined ${formatDate(currentUser.created_at || currentUser.joinDate)}`, label: 'Member' },
                   ].filter(i => i.value).map((item, idx) => (
                     <div key={idx} className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition-colors">
                        <item.icon size={16} className="text-gray-400 mt-0.5" />
                        <div className="flex-grow min-w-0">
                           <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{item.label}</div>
                           <div className="text-sm font-bold text-[#24272c] truncate">{item.value}</div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
                   <div className="text-center">
                      <div className="text-2xl font-black text-[#d32f2f]">{userBikes.length}</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Ads</div>
                   </div>
                   <div className="text-center border-l border-gray-50">
                      <div className="text-2xl font-black text-[#24272c]">0</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inquiries</div>
                   </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Activity/Ads Center */}
          <main className="lg:col-span-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
               <div>
                  <h1 className="text-3xl font-extrabold text-[#24272c] tracking-tight">Your Inventory</h1>
                  <p className="text-gray-500 font-medium">Manage and track your active bike listings.</p>
               </div>
               <Link to="/add" className="btn-primary flex items-center gap-2 py-4 px-8 rounded-xl text-sm shadow-lg shadow-[#d32f2f]/20">
                  <Plus size={18} /> Sell New Bike
               </Link>
            </div>

            {userBikes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userBikes.map(bike => (
                  <div key={bike.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
                     <div className="relative h-40 overflow-hidden bg-gray-100">
                        <img src={getImageUrl(bike)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-4 left-4">
                           <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-lg ${
                             bike.status === 'sold' ? 'bg-red-600 text-white' : 
                             bike.status === 'pending' ? 'bg-amber-400 text-white' : 'bg-[#d32f2f] text-white'
                           }`}>
                             {bike.status || 'Active'}
                           </span>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                           <Link to={`/details/${bike.id}`} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-[#d32f2f] shadow-sm"><Eye size={16} /></Link>
                           <button onClick={() => openDeleteModal(bike.id)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-red-600 shadow-sm"><Trash2 size={16} /></button>
                        </div>
                     </div>
                     <div className="p-6">
                        <h3 className="text-lg font-bold text-[#24272c] mb-1">{bike.brand} {bike.model}</h3>
                        <div className="text-2xl font-black text-[#d32f2f] mb-4">{formatPrice(bike.price)}</div>
                        <div className="flex items-center gap-4 py-4 border-t border-gray-50">
                           <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400"><Calendar size={14} /> {bike.year}</div>
                           <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400"><MapPin size={14} /> {bike.locality}</div>
                        </div>
                        <button className="w-full py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#d32f2f] hover:border-[#d32f2f]/20 transition-all flex items-center justify-center gap-1">
                           Manage Ad <ChevronRight size={14} />
                        </button>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 border-dashed p-20 text-center shadow-sm">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                    <Bike size={40} />
                 </div>
                 <h3 className="text-xl font-bold text-[#24272c]">You haven&apos;t listed any bikes yet</h3>
                 <p className="text-gray-500 mt-2 font-medium">Be part of Delhi&apos;s biggest marketplace and sell your bike faster.</p>
                 <Link to="/add" className="btn-primary mt-8 inline-flex px-10 py-4 shadow-lg shadow-[#d32f2f]/20">Start Selling Now</Link>
              </div>
            )}
          </main>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Remove Product Listing?"
        message="This will permanently delete your bike advertisement from our marketplace results. This action cannot be undone."
        confirmText="Confirm Deletion"
      />
    </div>
  );
};

export default Dashboard;
