import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, Link } from 'react-router-dom';
import { useBikes } from '../context/BikeContext';
import BikeCard from '../components/BikeCard';
import { Search, Filter, SlidersHorizontal, X, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardGridSkeleton } from '../components/SkeletonLoader';

const Bikes = () => {
  const { bikes, loading } = useBikes();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [filteredBikes, setFilteredBikes] = useState([]);
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
  const brands = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Yamaha', 'Suzuki', 'Royal Enfield', 'KTM'];
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
    <div className="mb-8 border-b border-gray-100 pb-6 last:border-0">
      <h4 className="text-sm font-bold text-[#24272c] mb-4 flex justify-between items-center cursor-pointer">
        {title}
        <ChevronDown size={14} className="text-gray-400" />
      </h4>
      <div className="space-y-3">
        {items.map(item => (
          <label key={item} className="flex items-center gap-3 group cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-[#d32f2f] focus:ring-[#d32f2f] transition-all cursor-pointer"
              checked={filters[category].includes(item)}
              onChange={() => toggleFilter(category, item)}
            />
            <span className={`text-sm transition-colors ${filters[category].includes(item) ? 'text-[#d32f2f] font-bold' : 'text-gray-600 group-hover:text-[#24272c]'}`}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-[#f0f2f5] min-h-screen font-sans">
      <Helmet>
        <title>New & Used Bikes Directory | DelhiBikesHub</title>
      </Helmet>

      {/* Directory Header (Functional) */}
      <div className="bg-white pt-24 lg:pt-32 pb-10 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                <Link to="/" className="hover:text-[#d32f2f]">Home</Link>
                <ChevronRight size={10} />
                <span className="text-gray-600">Bikes Directory</span>
              </nav>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-[#24272c] tracking-tight">
                Marketplace Inventory
              </h1>
            </div>
            
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d32f2f]" size={20} />
              <input
                type="text"
                placeholder="Search brands or models..."
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#d32f2f]/30 py-3 pl-12 pr-4 rounded-lg text-sm font-bold text-[#24272c] placeholder:text-gray-400 focus:ring-4 focus:ring-[#d32f2f]/5 transition-all outline-none"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Marketplace Sidebar Filters */}
          <aside className="hidden lg:block lg:w-72 shrink-0">
            <div className={`bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-32 max-h-[calc(100vh-160px)] overflow-y-auto hide-scrollbar`}>
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
                <h3 className="font-bold text-[#24272c] flex items-center gap-2 text-base">
                  <Filter size={18} className="text-[#d32f2f]" />
                  Filters
                </h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-[10px] font-black uppercase text-[#d32f2f] hover:underline">Reset</button>
                )}
              </div>
              
              <FilterSection title="Vehicle Type" items={types} category="type" />
              <FilterSection title="Top Brands" items={brands} category="brand" />
              
              <div className="mb-8 border-b border-gray-100 pb-6">
                <h4 className="text-sm font-bold text-[#24272c] mb-4">Budget Range</h4>
                <div className="flex flex-col gap-3">
                  <input type="number" placeholder="Min Price" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-[#24272c] placeholder:text-gray-400 rounded-lg text-sm font-bold focus:ring-2 focus:ring-[#d32f2f]/20 outline-none transition-all"
                    value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
                  <input type="number" placeholder="Max Price" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-[#24272c] placeholder:text-gray-400 rounded-lg text-sm font-bold focus:ring-2 focus:ring-[#d32f2f]/20 outline-none transition-all"
                    value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
                </div>
              </div>

              <FilterSection title="Localities" items={localities} category="location" />
            </div>
          </aside>

          {/* Catalog Grid Area */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="text-sm font-bold text-gray-500">
                Displaying <span className="text-[#24272c]">{filteredBikes.length}</span> verified results
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-black text-gray-600 shadow-sm"
                >
                  <SlidersHorizontal size={14} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>
                <div className="relative bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center shadow-sm">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide mr-3">Sort by</span>
                  <select 
                    className="bg-transparent text-xs font-bold text-[#24272c] focus:outline-none cursor-pointer appearance-none pr-4"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Latest Uploads</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {loading ? (
                <CardGridSkeleton count={6} />
              ) : filteredBikes.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                  {filteredBikes.map((bike) => (
                    <BikeCard key={bike.id} bike={bike} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center p-8 shadow-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                    <Search size={40} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-[#24272c]">No exact matches found</h3>
                  <p className="text-gray-500 mt-2 max-w-sm font-medium">
                    Try adjusting your filters or search terms to find more results in our hub.
                  </p>
                  <button onClick={clearFilters} className="mt-8 btn-primary px-8">
                    Clear Searches
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFilters(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[110] max-h-[90vh] overflow-y-auto p-6 lg:hidden">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-[#24272c]">Refine Hub</h3>
                  <button onClick={() => setShowFilters(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"><X size={18} /></button>
                </div>
                <FilterSection title="Vehicle Type" items={types} category="type" />
                <FilterSection title="Top Brands" items={brands} category="brand" />
                <FilterSection title="Price Filter" items={[]} category="price" />
                <button onClick={() => setShowFilters(false)} className="btn-primary w-full py-4 mt-6">Show {filteredBikes.length} Bikes</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bikes;
