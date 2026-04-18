import { 
  Phone, Mail, MapPin, CheckCircle2, 
  ShieldCheck, Fuel, User, Heart, Share2, ChevronLeft, ChevronRight, Gauge, Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useBikes } from '../context/BikeContext';
import BikeCard from '../components/BikeCard';
import { DetailSkeleton } from '../components/SkeletonLoader';

const Details = () => {
  const { id } = useParams();
  const { bikes, getBikeById } = useBikes();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [similarBikes, setSimilarBikes] = useState([]);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const foundBike = await getBikeById(id);
      if (foundBike) {
        setBike(foundBike);
        setMainImageIdx(0);
        const similar = bikes
          .filter(b => b.id !== foundBike.id && (b.brand === foundBike.brand || b.type === foundBike.type))
          .filter(b => !b.status || b.status === 'active')
          .slice(0, 4);
        setSimilarBikes(similar);
      }
      setLoading(false);
    };
    load();
    window.scrollTo(0, 0);
  }, [id, bikes, getBikeById]);

  if (loading) return <DetailSkeleton />;

  if (!bike) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center bg-white">
        <h2 className="text-2xl font-black text-[#24272c] mb-2">Listing Not Found</h2>
        <p className="text-gray-500 mb-6 font-medium">This bike may have been sold or removed.</p>
        <Link to="/bikes" className="btn-primary py-3 px-8">Return to Directory</Link>
      </div>
    );
  }

  const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const images = bike.images && bike.images.length > 0 
    ? bike.images.map(img => typeof img === 'string' ? img : img.url || img)
    : [`/images/bike${((typeof bike.id === 'number' ? bike.id : 1) % 6) + 1}.jpg`];

  const nextImage = () => setMainImageIdx(prev => (prev + 1) % images.length);
  const prevImage = () => setMainImageIdx(prev => (prev - 1 + images.length) % images.length);

  return (
    <div className="bg-[#f0f2f5] min-h-screen pb-20 pt-24 lg:pt-32">
      <Helmet>
        <title>{`${bike.brand} ${bike.model} Price in Delhi, Specs & Reviews`}</title>
      </Helmet>
      
      {/* Breadcrumbs & Actions Header */}
      <div className="bg-white border-b border-gray-100 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-[#d32f2f]">Home</Link>
            <ChevronRight size={10} />
            <Link to="/bikes" className="hover:text-[#d32f2f]">Inventory</Link>
            <ChevronRight size={10} />
            <span className="text-gray-600 truncate max-w-[100px] sm:max-w-none">{bike.brand} {bike.model}</span>
          </nav>
          <div className="flex items-center gap-3">
             <button className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-lg text-gray-400 hover:text-[#d32f2f] hover:bg-red-50 transition-all">
               <Share2 size={18} />
             </button>
             <button className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-lg text-gray-400 hover:text-[#d32f2f] hover:bg-red-50 transition-all">
               <Heart size={18} />
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Marketplace Content Area (Left) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Gallery Card */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="relative aspect-[16/10] bg-gray-100">
                <img 
                  src={images[mainImageIdx]} 
                  alt={bike.model} 
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-[#d32f2f] transition-all"><ChevronLeft size={24} /></button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-[#d32f2f] transition-all"><ChevronRight size={24} /></button>
                  </>
                )}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest leading-none">
                  {mainImageIdx + 1} / {images.length} Photos
                </div>
              </div>
              <div className="p-4 flex gap-3 overflow-x-auto hide-scrollbar">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setMainImageIdx(i)} className={`w-20 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${mainImageIdx === i ? 'border-[#d32f2f]' : 'border-transparent opacity-60'}`}>
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Specs & Highlights */}
            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
               <div className="flex flex-wrap items-center gap-2 mb-6">
                 <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Verified Merchant</span>
                 <span className="bg-green-50 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-green-100">Excellent Condition</span>
               </div>
               <h1 className="text-3xl lg:text-4xl font-extrabold text-[#24272c] mb-2">{bike.brand} {bike.model}</h1>
               <div className="flex items-center gap-4 text-gray-400 font-bold text-sm mb-8">
                 <div className="flex items-center gap-1.5"><MapPin size={14} /> {bike.locality}</div>
                 <div className="w-1 h-1 rounded-full bg-gray-200" />
                 <div>{bike.year} Model</div>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-gray-50">
                  {[
                    { label: 'Driven', value: `${bike.km} km`, icon: Gauge },
                    { label: 'MFG Year', value: bike.year, icon: Calendar },
                    { label: 'Fuel Type', value: 'Petrol', icon: Fuel },
                    { label: 'Ownership', value: '1st Owner', icon: User }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center sm:items-start">
                      <item.icon size={20} className="text-[#d32f2f] mb-2" />
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</div>
                      <div className="text-sm font-black text-[#24272c]">{item.value}</div>
                    </div>
                  ))}
               </div>

               <div className="mt-8">
                  <h3 className="text-sm font-black text-[#24272c] uppercase tracking-wider mb-4">Seller Description</h3>
                  <p className="text-gray-500 font-medium leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100 italic font-serif text-lg">
                    &ldquo;{bike.description}&rdquo;
                  </p>
               </div>
            </div>

            {/* Technical Details */}
            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
               <h3 className="text-sm font-black text-[#24272c] uppercase tracking-wider mb-6">Device Portfolio</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                  {[
                    { k: 'Registration', v: 'DL RTO' },
                    { k: 'Insurance', v: 'Full Comprehensive' },
                    { k: 'Service History', v: 'Available' },
                    { k: 'Last Serviced', v: '2 months ago' },
                    { k: 'Key Status', v: 'Dual Keys Avail.' },
                    { k: 'Condition', v: 'Pristine / No Dent' }
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between py-4 border-b border-gray-50 text-sm">
                      <span className="text-gray-400 font-bold">{s.k}</span>
                      <span className="text-[#24272c] font-black">{s.v}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Inquiry Widget (Right Stack) */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-md sticky top-32">
                <div className="mb-8">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Market Price</div>
                  <div className="text-3xl lg:text-4xl font-black text-[#d32f2f] mb-1">{formatPrice(bike.price)}</div>
                  <div className="text-[10px] font-black text-green-600 uppercase tracking-tighter">* Non-negotiable Institutional Price</div>
                </div>

                {showContact ? (
                  <div className="space-y-4 animate-fadeIn">
                     <a href={`tel:${bike.sellerPhone}`} className="w-full flex items-center justify-center gap-3 bg-[#d32f2f] text-white py-4 rounded-lg font-black text-lg shadow-lg shadow-[#d32f2f]/20">
                        <Phone size={24} /> Call Merchant
                     </a>
                     <a href={`mailto:${bike.sellerEmail}`} className="w-full flex items-center justify-center gap-3 bg-gray-100 text-[#24272c] py-3 rounded-lg font-bold text-sm">
                        <Mail size={18} /> Email Connection
                     </a>
                     <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-[10px] font-bold text-yellow-800 leading-relaxed">
                        ⚠️ CAUTION: Only pay after meeting the seller and verifying the bike documents in person.
                     </div>
                  </div>
                ) : (
                  <button onClick={() => setShowContact(true)} className="w-full btn-primary py-5 rounded-lg shadow-lg shadow-[#d32f2f]/20 text-sm">
                    CHECK MERCHANT NUMBER
                  </button>
                )}

                <div className="mt-10 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <User size={24} />
                     </div>
                     <div>
                        <div className="text-xs font-black text-[#24272c] truncate max-w-[150px]">{bike.sellerName}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Seller</div>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500"><ShieldCheck size={14} className="text-blue-500" /> Buyer Protection Applied</div>
                     <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500"><CheckCircle2 size={14} className="text-green-500" /> Inspected by DelhiBikesHub</div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Similar Listings Feed */}
        {similarBikes.length > 0 && (
          <section className="mt-24 pt-24 border-t border-gray-100">
             <div className="flex justify-between items-end mb-12">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-[#24272c]">Bikes recommended for you</h2>
                <Link to="/bikes" className="text-sm font-bold text-[#d32f2f] hover:underline">View Comparison</Link>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarBikes.map(b => (
                   <BikeCard key={b.id} bike={b} />
                ))}
             </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Details;
