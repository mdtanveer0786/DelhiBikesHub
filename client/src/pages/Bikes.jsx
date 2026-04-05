import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useBikes } from '../context/BikeContext';
import BikeCard from '../components/BikeCard';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Bikes = () => {
  const { bikes } = useBikes();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [filteredBikes, setFilteredBikes] = useState(bikes);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: [],
    brand: queryParams.get('brand') ? [queryParams.get('brand')] : [],
    location: queryParams.get('location') ? [queryParams.get('location')] : [],
    minPrice: '',
    maxPrice: '',
    search: queryParams.get('model') || '',
  });
  const [sortBy, setSortBy] = useState('newest');

  const types = ['Bike', 'Scooty'];
  const brands = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Yamaha', 'Suzuki', 'Royal Enfield'];
  const localities = ['Karol Bagh', 'Lajpat Nagar', 'Rohini', 'Dwarka', 'Shahdara', 'Connaught Place', 'Pitampura', 'Janakpuri'];

  useEffect(() => {
    let result = bikes.filter(bike => {
      if (bike.status && bike.status !== 'active') return false;
      if (filters.type.length > 0 && !filters.type.includes(bike.type)) return false;
      if (filters.brand.length > 0 && !filters.brand.includes(bike.brand)) return false;
      if (filters.location.length > 0 && !filters.location.includes(bike.locality)) return false;
      const price = parseInt(bike.price);
      if (filters.minPrice && price < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && price > parseInt(filters.maxPrice)) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return bike.model.toLowerCase().includes(searchLower) || bike.brand.toLowerCase().includes(searchLower);
      }
      return true;
    });

    if (sortBy === 'price-low') result.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    else if (sortBy === 'price-high') result.sort((a, b) => parseInt(b.price) - parseInt(a.price));
    else result.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));

    setFilteredBikes(result);
  }, [filters, bikes, sortBy]);

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = prev[category];
      return current.includes(value)
        ? { ...prev, [category]: current.filter(item => item !== value) }
        : { ...prev, [category]: [...current, value] };
    });
  };

  const clearFilters = () => {
    setFilters({ type: [], brand: [], location: [], minPrice: '', maxPrice: '', search: '' });
  };

  const activeFilterCount = filters.type.length + filters.brand.length + filters.location.length +
    (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0);

  const FilterSection = ({ title, items, category }) => (
    <div>
      <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">{title}</h4>
      <div className="space-y-2">
        {items.map(item => (
          <label key={item} className="flex items-center group cursor-pointer py-0.5">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              checked={filters[category].includes(item)}
              onChange={() => toggleFilter(category, item)}
            />
            <span className="ml-2.5 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 lg:mb-12">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">Explore Bikes</h1>
          <p className="text-slate-500 mt-1 text-sm">{filteredBikes.length} listings found in Delhi</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-grow sm:w-64 lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by model or brand..."
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl text-slate-600 relative shrink-0"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={18} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Mobile Filter Overlay */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)}></div>
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto pb-safe"
              >
                <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between rounded-t-3xl z-10">
                  <h3 className="font-black text-slate-900 flex items-center gap-2">
                    <Filter size={16} className="text-primary-600" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{activeFilterCount}</span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3">
                    <button onClick={clearFilters} className="text-xs font-bold text-primary-600">Clear All</button>
                    <button onClick={() => setShowFilters(false)} className="p-1 text-slate-400">
                      <X size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-6">
                  <FilterSection title="Vehicle Type" items={types} category="type" />
                  <FilterSection title="Popular Brands" items={brands} category="brand" />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Price Range</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" placeholder="Min" className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                        value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
                      <input type="number" placeholder="Max" className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                        value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
                    </div>
                  </div>
                  <FilterSection title="Localities" items={localities} category="location" />
                </div>
                <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4">
                  <button onClick={() => setShowFilters(false)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm active:scale-[0.98]">
                    Show {filteredBikes.length} Results
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:w-64 xl:w-72 shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm">
                <Filter size={16} className="text-primary-600" />
                Filters
              </h3>
              <button onClick={clearFilters} className="text-xs font-bold text-primary-600 hover:text-primary-700">Clear All</button>
            </div>
            <FilterSection title="Vehicle Type" items={types} category="type" />
            <FilterSection title="Popular Brands" items={brands} category="brand" />
            <div>
              <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Price Range</h4>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Min" className="w-full px-3 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                  value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
                <input type="number" placeholder="Max" className="w-full px-3 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                  value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
              </div>
            </div>
            <FilterSection title="Localities" items={localities} category="location" />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-xs sm:text-sm font-bold text-slate-500">
              {filteredBikes.length} results
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-500 hidden sm:inline">Sort:</span>
              <select 
                className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredBikes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredBikes.map((bike, i) => (
                <motion.div
                  key={bike.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <BikeCard bike={bike} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20 bg-white rounded-2xl sm:rounded-[3rem] border border-dashed border-slate-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-slate-400">
                <Search size={32} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">No bikes found</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">
                Try adjusting your filters or search terms.
              </p>
              <button onClick={clearFilters} className="mt-6 sm:mt-8 text-primary-600 font-bold hover:underline text-sm">
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bikes;
