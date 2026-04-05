import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Gauge } from 'lucide-react';

const BikeCard = ({ bike }) => {
  // Use uploaded Cloudinary images, fallback to static placeholders
  const getImageUrl = () => {
    if (bike.images && bike.images.length > 0) {
      return typeof bike.images[0] === 'string' ? bike.images[0] : bike.images[0].url || bike.images[0];
    }
    const imageNum = (typeof bike.id === 'number' ? bike.id % 6 : 0) + 1;
    return `/images/bike${imageNum}.jpg`;
  };

  const imageUrl = getImageUrl();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col">
      <div className="relative h-40 xs:h-44 sm:h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={`${bike.brand} ${bike.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { e.target.src = '/images/bike1.jpg'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-black text-primary-600 shadow-sm uppercase tracking-wide">
          {bike.type}
        </div>
        {bike.status === 'sold' && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-xl font-black text-sm">SOLD</span>
          </div>
        )}
      </div>
      
      <div className="p-3.5 sm:p-4 md:p-5 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 truncate">
          {bike.brand} {bike.model}
        </h3>
        
        <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 text-slate-500 text-[11px] sm:text-xs md:text-sm mb-2.5 sm:mb-3">
          <div className="flex items-center gap-1">
            <Gauge size={12} className="text-slate-400 shrink-0" />
            <span>{Number(bike.km).toLocaleString('en-IN')} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} className="text-slate-400 shrink-0" />
            <span>{bike.year}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-1.5 sm:pt-2">
          <div className="text-base sm:text-lg md:text-xl font-black text-primary-600">
            {formatPrice(bike.price)}
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[10px] sm:text-[11px] md:text-xs">
            <MapPin size={10} className="shrink-0" />
            <span className="truncate max-w-[70px] sm:max-w-[80px]">{bike.locality}</span>
          </div>
        </div>
        
        <Link
          to={`/details/${bike.id}`}
          className="mt-3 sm:mt-4 block w-full text-center py-2.5 sm:py-3 bg-slate-900 text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-primary-600 transition-colors shadow-sm active:scale-[0.98]"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BikeCard;
