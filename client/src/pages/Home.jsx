import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bike, ChevronRight, Zap, Star, ShieldCheck } from 'lucide-react';
import { useBikes } from '../context/BikeContext';


const Home = () => {
  const { bikes } = useBikes();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('brand');
  const [searchTerm, setSearchTerm] = useState('');

  const popularBikes = useMemo(() => bikes.filter(b => b.price < 100000).slice(0, 4), [bikes]);

  const brands = [
    { name: 'Hero', logo: 'https://v3h9g9n6.rocketcdn.me/wp-content/uploads/2021/01/Hero-Logo.png' },
    { name: 'Honda', logo: 'https://v3h9g9n6.rocketcdn.me/wp-content/uploads/2021/01/Honda-Logo.png' },
    { name: 'Bajaj', logo: 'https://v3h9g9n6.rocketcdn.me/wp-content/uploads/2021/01/Bajaj-Logo.png' },
    { name: 'TVS', logo: 'https://v3h9g9n6.rocketcdn.me/wp-content/uploads/2021/01/TVS-Logo.png' },
    { name: 'Yamaha', logo: 'https://v3h9g9n6.rocketcdn.me/wp-content/uploads/2021/01/Yamaha-Logo.png' },
    { name: 'Suzuki', logo: 'https://v3h9g9n6.rocketcdn.me/wp-content/uploads/2021/01/Suzuki-Logo.png' },
    { name: 'Royal Enfield', logo: 'https://v3h9g9n6.rocketcdn.me/wp-content/uploads/2021/01/Royal-Enfield-Logo.png' },
    { name: 'KTM', logo: 'https://v3h9g9n6.rocketcdn.me/wp-content/uploads/2021/01/KTM-Logo.png' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/bikes?model=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen font-sans pb-20">
      <Helmet>
        <title>DelhiBikesHub | New Bikes, Used Bikes, Prices & Reviews</title>
      </Helmet>

      {/* Hero / Search Section */}
      <section className="bg-white pt-32 pb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-[#24272c] leading-tight mb-6">
                Find your right bike
              </h1>
              
              <div className="market-search animate-fadeIn">
                <div className="flex gap-8 border-b border-gray-100 mb-6">
                  {['brand', 'budget'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-black uppercase tracking-wider transition-all ${activeTab === tab ? 'text-[#d32f2f] border-b-2 border-[#d32f2f]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      By {tab}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder={activeTab === 'brand' ? "Search for Brand or Model" : "Enter your budget (e.g. 1 Lakh)"}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:border-[#d32f2f]/30 focus:ring-4 focus:ring-[#d32f2f]/5 transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary py-4 rounded-lg shadow-lg shadow-[#d32f2f]/20">
                    SEARCH BIKES
                  </button>
                </form>
              </div>
            </div>

            <div className="hidden lg:block">
              <img 
                src="https://stimg.cardekho.com/images/carexteriorimages/630x420/Hero/Splendor-Plus/10665/1689679169649/front-view-118.jpg" 
                alt="New Bike" 
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Top Brands Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-8">
            <h2 className="section-title mb-0">Popular Brands</h2>
            <Link to="/bikes" className="text-sm font-bold text-[#d32f2f] flex items-center gap-1 hover:underline">
              View All Brands <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid-cols-brand grid gap-6">
            {brands.map((brand) => (
              <Link 
                key={brand.name} 
                to={`/bikes?brand=${brand.name}`}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="brand-circle">
                  <span className="font-black text-[10px] text-gray-400 group-hover:text-[#d32f2f]">{brand.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-600 group-hover:text-[#24272c]">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Bikes Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title">The Most Searched Bikes</h2>
          <div className="flex gap-4 mb-8 overflow-x-auto hide-scrollbar pb-2">
            {['Popular', 'Upcoming', 'Latest'].map((c) => (
              <button key={c} className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${c === 'Popular' ? 'bg-[#d32f2f] text-white border-[#d32f2f]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                {c} Bikes
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularBikes.map(bike => (
              <div key={bike.id} className="market-card h-full flex flex-col">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={bike.images?.[0]?.url || `/images/bike${(bike.id % 6) + 1}.jpg`} 
                    alt={bike.model}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-fuchsia-600 text-white text-[9px] font-black px-2 py-1 rounded">TRENDING</div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-[#24272c] mb-1">{bike.brand} {bike.model}</h3>
                  <div className="text-lg font-extrabold text-[#24272c] mb-4">
                    ₹{bike.price.toLocaleString()}
                  </div>
                  <Link to={`/details/${bike.id}`} className="mt-auto btn-outline text-center text-xs py-2.5">
                    Check Offers
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections Ad */}
      <section className="py-8 bg-blue-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Best Mileage Bikes', icon: Zap, color: 'text-yellow-600' },
              { title: 'Electric Scooters', icon: Bike, color: 'text-green-600' },
              { title: 'Certified Used', icon: ShieldCheck, color: 'text-blue-600' }
            ].map((col, i) => (
              <div key={i} className="bg-white p-6 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-blue-100/50">
                <div className={`p-3 rounded-full bg-slate-50 ${col.color}`}>
                  <col.icon size={24} />
                </div>
                <span className="font-extrabold text-sm text-slate-800">{col.title}</span>
                <ChevronRight size={16} className="ml-auto text-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-[#d32f2f] rounded-full flex items-center justify-center mb-6">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#24272c] mb-2">India&apos;s #1 Hub</h3>
              <p className="text-sm text-gray-500 font-medium">Largest marketplace in Delhi NCR for premium pre-owned bikes.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#24272c] mb-2">Verified Sellers</h3>
              <p className="text-sm text-gray-500 font-medium">Every seller is strictly verified to ensure 100% genuine listings.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#24272c] mb-2">Instant Support</h3>
              <p className="text-sm text-gray-500 font-medium">Dedicated support team to assist you in your buying/selling journey.</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
