import { Link } from 'react-router-dom';
import { MapPin, Calendar, Gauge, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const BikeCard = ({ bike }) => {
  if (!bike) return null;

  const getImageUrl = () => {
    if (bike.images && bike.images.length > 0) {
      return typeof bike.images[0] === 'string' ? bike.images[0] : bike.images[0].url || bike.images[0];
    }
    const imageNum = (typeof bike.id === 'number' ? bike.id % 6 : 0) + 1;
    return `/images/bike${imageNum}.jpg`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="market-card group cursor-pointer h-full flex flex-col"
    >
      {/* Product Image Area */}
      <div className="relative h-44 sm:h-52 overflow-hidden bg-gray-100">
        <img
          src={getImageUrl()}
          alt={`${bike.brand} ${bike.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {bike.status === 'sold' && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white font-black px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase">SOLD OUT</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-gray-600 shadow-sm flex items-center gap-1">
          <Star size={10} className="text-yellow-500 fill-yellow-500" /> 4.2
        </div>
      </div>

      {/* Product Info Area */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-bold text-[#24272c] line-clamp-1">
            {bike.brand} {bike.model}
          </h3>
        </div>
        
        <div className="text-xl font-extrabold text-[#24272c] mb-4">
          {formatPrice(bike.price)}
          <span className="text-[10px] font-bold text-gray-400 ml-1.5 uppercase tracking-tighter">* On-road Price</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
            <Gauge size={14} className="text-gray-400" />
            {Number(bike.km).toLocaleString()} km
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
            <Calendar size={14} className="text-gray-400" />
            {bike.year}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 col-span-2">
            <MapPin size={14} className="text-gray-400" />
            {bike.locality}
          </div>
        </div>

        <div className="mt-auto pt-2">
            <Link
              to={`/details/${bike.id}`}
              className="w-full btn-outline text-center text-xs py-2.5 flex items-center justify-center group-hover:bg-[#d32f2f] group-hover:text-white group-hover:border-[#d32f2f] transition-all"
            >
              Check Offers
            </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BikeCard;
