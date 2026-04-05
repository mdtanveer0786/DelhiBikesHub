import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBikes } from '../context/BikeContext';
import BikeCard from '../components/BikeCard';
import { DetailSkeleton } from '../components/SkeletonLoader';
import { 
  MapPin, Calendar, Gauge, Bike as BikeIcon, 
  Phone, Mail, User, ShieldCheck, ArrowLeft,
  Share2, Heart, CheckCircle2, Fuel, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

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
          .slice(0, 3);
        setSimilarBikes(similar);
      }
      setLoading(false);
    };
    load();
    window.scrollTo(0, 0);
  }, [id, bikes, getBikeById]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!bike) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Bike Not Found</h2>
        <p className="text-slate-500 mb-6">This listing may have been removed.</p>
        <Link to="/bikes" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold">Browse Bikes</Link>
      </div>
    );
  }

  const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const getImages = () => {
    if (bike.images && bike.images.length > 0) {
      return bike.images.map(img => typeof img === 'string' ? img : img.url || img);
    }
    return [
      `/images/bike${((typeof bike.id === 'number' ? bike.id : 1) % 6) + 1}.jpg`,
      `/images/bike${(((typeof bike.id === 'number' ? bike.id : 1) + 1) % 6) + 1}.jpg`,
      `/images/bike${(((typeof bike.id === 'number' ? bike.id : 1) + 2) % 6) + 1}.jpg`,
    ];
  };

  const images = getImages();

  const nextImage = () => setMainImageIdx(prev => (prev + 1) % images.length);
  const prevImage = () => setMainImageIdx(prev => (prev - 1 + images.length) % images.length);

  // Handle touch swipe for gallery
  let touchStartX = 0;
  const handleTouchStart = (e) => { touchStartX = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${bike.brand} ${bike.model} - DelhiBikesHub`,
          text: `Check out this ${bike.brand} ${bike.model} for ${formatPrice(bike.price)}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
      {/* Back */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <Link to="/bikes" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-primary-600 font-bold transition-colors text-sm">
          <ArrowLeft size={18} />
          Back to all bikes
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-10">
          {/* Gallery */}
          <div className="space-y-2.5 sm:space-y-4">
            {/* Main Image with nav arrows — ALWAYS VISIBLE on touch devices */}
            <div 
              className="relative aspect-[4/3] sm:aspect-[16/10] rounded-xl sm:rounded-2xl lg:rounded-[2.5rem] overflow-hidden shadow-lg sm:shadow-2xl bg-slate-100 group"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img 
                src={images[mainImageIdx]} 
                alt={`${bike.brand} ${bike.model} - Photo ${mainImageIdx + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/images/bike1.jpg'; }}
              />
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage} 
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg text-slate-700 hover:bg-white transition-all sm:opacity-0 sm:group-hover:opacity-100" 
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={nextImage} 
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg text-slate-700 hover:bg-white transition-all sm:opacity-0 sm:group-hover:opacity-100" 
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              {/* Action buttons */}
              <div className="absolute top-2.5 sm:top-6 right-2.5 sm:right-6 flex gap-2">
                <button 
                  className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg text-slate-600 hover:text-red-500 transition-colors" 
                  aria-label="Add to favorites"
                >
                  <Heart size={18} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg text-slate-600 hover:text-primary-600 transition-colors" 
                  aria-label="Share listing"
                >
                  <Share2 size={18} />
                </button>
              </div>
              {/* Image counter */}
              <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold">
                {mainImageIdx + 1} / {images.length}
              </div>
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImageIdx(idx)}
                    className={`aspect-video rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                      mainImageIdx === idx ? 'border-primary-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/images/bike1.jpg'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Price Card */}
          <div className="lg:hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 sm:p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-600/20 blur-2xl rounded-full"></div>
            <div className="relative z-10">
              <span className="text-primary-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">Listing Price</span>
              <div className="text-2xl sm:text-4xl font-black mt-1 mb-3 sm:mb-4">{formatPrice(bike.price)}</div>
              <button 
                onClick={() => setShowContact(true)}
                className="w-full bg-primary-600 text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base hover:bg-primary-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                Contact Seller
              </button>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            {[
              { icon: Gauge, label: 'Distance', value: `${Number(bike.km).toLocaleString('en-IN')} km` },
              { icon: Calendar, label: 'Year', value: bike.year },
              { icon: Fuel, label: 'Fuel Type', value: 'Petrol' },
              { icon: Settings, label: 'Engine', value: bike.type === 'Scooty' ? '125cc' : '150cc' },
            ].map(({ icon: Icon, label, value }, i) => (
              <div key={i} className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm text-center">
                <Icon className="mx-auto mb-1.5 sm:mb-2 text-primary-600" size={18} />
                <span className="block text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                <span className="text-sm sm:text-lg font-black text-slate-900">{value}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="bg-white p-4 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl lg:rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-base sm:text-2xl font-black text-slate-900 mb-3 sm:mb-6">About this {bike.type}</h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base lg:text-lg italic border-l-4 border-primary-200 pl-3 sm:pl-6">
              "{bike.description}"
            </p>
            
            <div className="mt-6 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">
              <div>
                <h3 className="font-bold text-slate-900 mb-3 sm:mb-6 flex items-center gap-2 text-sm">
                  <ShieldCheck className="text-primary-600" size={18} />
                  Specifications
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    { label: 'Brand', value: bike.brand },
                    { label: 'Model', value: bike.model },
                    { label: 'Type', value: bike.type },
                    { label: 'Owner', value: '1st Owner' },
                  ].map((spec, i) => (
                    <li key={i} className="flex justify-between items-center py-1.5 sm:py-2 border-b border-slate-50 text-xs sm:text-sm">
                      <span className="text-slate-500">{spec.label}</span>
                      <span className="text-slate-900 font-bold">{spec.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-900 mb-3 sm:mb-6 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="text-primary-600" size={18} />
                  Condition
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {['Original Paint', 'Regularly Serviced', 'New Tyres', 'Verified Documents'].map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] sm:text-xs font-bold border border-slate-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Seller Info */}
          <div className="lg:hidden bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 mb-3 sm:mb-4 text-sm">Seller Information</h3>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                <User size={22} />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">{bike.sellerName}</div>
                <div className="flex items-center gap-1 text-slate-500 text-[11px] sm:text-xs">
                  <MapPin size={12} />
                  {bike.locality}, Delhi
                </div>
              </div>
            </div>
            {showContact && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 mb-3 sm:mb-4">
                <a href={`tel:+91${bike.sellerPhone}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-sm hover:bg-slate-100 transition-colors">
                  <Phone size={16} className="text-primary-600 shrink-0" />
                  <span className="font-bold">+91 {bike.sellerPhone}</span>
                </a>
                <a href={`mailto:${bike.sellerEmail}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-sm hover:bg-slate-100 transition-colors">
                  <Mail size={16} className="text-primary-600 shrink-0" />
                  <span className="font-bold break-all">{bike.sellerEmail}</span>
                </a>
              </motion.div>
            )}
            {!showContact && (
              <button onClick={() => setShowContact(true)} className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold text-sm active:scale-[0.98]">
                Show Contact Details
              </button>
            )}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-50 text-[11px] sm:text-xs text-slate-400 space-y-1">
              <p>• Meet seller in a public place</p>
              <p>• Don't pay in advance</p>
              <p>• Verify all documents properly</p>
            </div>
          </div>
        </div>

        {/* Desktop Right Column */}
        <div className="hidden lg:block space-y-8">
          {/* Price Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden sticky top-24">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-600/20 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <span className="text-primary-400 font-black text-xs uppercase tracking-widest">Listing Price</span>
              <div className="text-4xl xl:text-5xl font-black mt-2 mb-8">{formatPrice(bike.price)}</div>
              <button className="w-full bg-primary-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3">
                <Phone size={22} />
                Contact Seller
              </button>
              <p className="text-slate-400 text-center mt-6 text-xs flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-primary-500" />
                Verified Seller Badge
              </p>
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 mb-6 text-sm">Seller Information</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shadow-inner">
                <User size={28} />
              </div>
              <div>
                <div className="font-black text-lg text-slate-900">{bike.sellerName}</div>
                <div className="flex items-center gap-1 text-slate-500 text-xs font-bold">
                  <MapPin size={12} />
                  {bike.locality}, Delhi
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <a href={`tel:+91${bike.sellerPhone}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl group cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-primary-600 shadow-sm transition-colors">
                  <Phone size={16} />
                </div>
                <div className="font-bold text-slate-900 text-sm">+91 {bike.sellerPhone}</div>
              </a>
              <a href={`mailto:${bike.sellerEmail}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl group cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-primary-600 shadow-sm transition-colors">
                  <Mail size={16} />
                </div>
                <div className="font-bold text-slate-900 text-sm break-all">{bike.sellerEmail}</div>
              </a>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-50">
              <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-3 text-center">Safety Tips</h4>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li>• Meet seller in a public place</li>
                <li>• Don't pay in advance</li>
                <li>• Verify all documents properly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Bikes */}
      {similarBikes.length > 0 && (
        <section className="mt-10 sm:mt-16 lg:mt-24 pt-8 sm:pt-12 lg:pt-16 border-t border-slate-100">
          <div className="flex items-end justify-between mb-5 sm:mb-10">
            <div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900">Similar Options</h2>
              <p className="text-slate-500 mt-1 text-xs sm:text-sm">More bikes like this in Delhi</p>
            </div>
            <Link to="/bikes" className="hidden sm:inline-flex font-bold text-primary-600 hover:translate-x-1 transition-transform items-center gap-1 text-sm">
              Browse all <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {similarBikes.map(b => (
              <BikeCard key={b.id} bike={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Details;
