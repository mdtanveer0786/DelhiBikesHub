import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Tag, Bike, ArrowRight, ShieldCheck, Zap, Heart, Star } from 'lucide-react';
import { useBikes } from '../context/BikeContext';
import BikeCard from '../components/BikeCard';
import { motion } from 'framer-motion';

const Home = () => {
  const { bikes } = useBikes();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    brand: '',
    model: '',
    location: '',
  });

  const featuredBikes = bikes.filter(b => b.status !== 'sold').slice(0, 6);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchParams.brand) params.append('brand', searchParams.brand);
    if (searchParams.model) params.append('model', searchParams.model);
    if (searchParams.location) params.append('location', searchParams.location);
    navigate(`/bikes?${params.toString()}`);
  };

  const localities = [
    { name: 'Karol Bagh', icon: '🏪', count: '50+' },
    { name: 'Lajpat Nagar', icon: '🛒', count: '45+' },
    { name: 'Rohini', icon: '🏠', count: '60+' },
    { name: 'Dwarka', icon: '🏙️', count: '55+' },
    { name: 'Shahdara', icon: '🛣️', count: '40+' },
    { name: 'Connaught Place', icon: '🏛️', count: '30+' },
  ];

  const brands = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Yamaha', 'Suzuki', 'Royal Enfield'];
  const locations = ['Karol Bagh', 'Lajpat Nagar', 'Rohini', 'Dwarka', 'Shahdara', 'Connaught Place', 'Pitampura', 'Janakpuri'];

  const stats = [
    { label: 'Active Listings', value: bikes.filter(b => b.status === 'active').length + '+', icon: Bike },
    { label: 'Delhi Localities', value: '20+', icon: MapPin },
    { label: 'Happy Buyers', value: '1000+', icon: Star },
  ];

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: 'Verified Listings',
      desc: 'Genuine sellers and bikes',
      iconBg: 'bg-fuchsia-50',
      iconColor: 'text-fuchsia-600',
    },
    {
      icon: Zap,
      title: 'Instant Listing',
      desc: 'Sell your bike in minutes',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Heart,
      title: 'Trusted Community',
      desc: 'Thousands of happy buyers',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
  ];

  return (
    <div className="space-y-10 sm:space-y-14 lg:space-y-20 pb-10 sm:pb-14 lg:pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover opacity-30"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-900/30"></div>
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full py-10 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-6 leading-tight">
              Buy & Sell Used Bikes{' '}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-500">
                & Scooties in Delhi
              </span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-sm sm:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-10 max-w-2xl mx-auto px-2"
          >
            Find the best deals on pre-owned bikes and scooties across Delhi. 
            Verified listings, honest prices.
          </motion.p>

          {/* Search Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl"
          >
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="relative group">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500" size={16} />
                <select
                  className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-white rounded-xl sm:rounded-2xl text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm"
                  value={searchParams.brand}
                  onChange={(e) => setSearchParams({ ...searchParams, brand: e.target.value })}
                  aria-label="Select Brand"
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>

              <div className="relative group">
                <Bike className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500" size={16} />
                <input
                  type="text"
                  placeholder="e.g. Activa, Splendor"
                  className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-white rounded-xl sm:rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm"
                  value={searchParams.model}
                  onChange={(e) => setSearchParams({ ...searchParams, model: e.target.value })}
                  aria-label="Search by model"
                />
              </div>

              <div className="relative group">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500" size={16} />
                <select
                  className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-white rounded-xl sm:rounded-2xl text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  aria-label="Select Locality"
                >
                  <option value="">Select Locality</option>
                  {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl sm:rounded-2xl py-3 sm:py-3.5 px-6 font-bold text-sm hover:shadow-lg hover:shadow-primary-600/30 transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <Search size={18} />
                <span>Search</span>
              </button>
            </form>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-center gap-6 sm:gap-10 mt-6 sm:mt-10"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-lg sm:text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {trustBadges.map(({ icon: Icon, title, desc, iconBg, iconColor }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className={`w-11 h-11 sm:w-14 sm:h-14 ${iconBg} rounded-xl sm:rounded-2xl flex items-center justify-center ${iconColor} shrink-0`}>
                <Icon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Localities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-5 sm:mb-10">
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">Popular Localities</h2>
            <p className="text-slate-500 mt-1 sm:mt-2 text-xs sm:text-base">Find bikes in your preferred locality</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 lg:gap-6">
          {localities.map((locality, i) => (
            <motion.div
              key={locality.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/bikes?location=${encodeURIComponent(locality.name)}`}
                className="block bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 text-center hover:shadow-lg hover:border-primary-200 transition-all group"
              >
                <span className="text-2xl sm:text-4xl mb-2 sm:mb-3 block group-hover:scale-110 transition-transform">
                  {locality.icon}
                </span>
                <h3 className="font-bold text-slate-900 text-[11px] sm:text-sm">{locality.name}</h3>
                <p className="text-primary-600 text-[10px] sm:text-xs font-bold mt-0.5 sm:mt-1">{locality.count}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Bikes */}
      <section className="bg-slate-50 py-10 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-5 sm:mb-10">
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900">Featured Listings</h2>
              <p className="text-slate-500 mt-1 sm:mt-2 text-xs sm:text-base">Best deals on quality bikes in Delhi</p>
            </div>
            <Link 
              to="/bikes" 
              className="hidden sm:flex items-center space-x-2 text-primary-600 font-bold hover:translate-x-1 transition-transform text-sm"
            >
              <span>View All</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {featuredBikes.map((bike, i) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <BikeCard bike={bike} />
              </motion.div>
            ))}
          </div>

          <div className="sm:hidden mt-5 text-center">
            <Link 
              to="/bikes" 
              className="inline-flex items-center space-x-2 text-primary-600 font-bold text-sm"
            >
              <span>View All Listings</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-2xl sm:rounded-[3rem] overflow-hidden relative p-6 sm:p-12 md:p-16 lg:p-20 text-center">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-36 sm:w-72 lg:w-96 h-36 sm:h-72 lg:h-96 bg-primary-600/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-36 sm:w-72 lg:w-96 h-36 sm:h-72 lg:h-96 bg-primary-400/10 blur-3xl rounded-full"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-6">
              Ready to Sell Your Bike?
            </h2>
            <p className="text-slate-400 text-xs sm:text-base lg:text-lg mb-6 sm:mb-12 max-w-2xl mx-auto">
              Get the best price for your used bike or scooty. List on DelhiBikesHub 
              and connect with genuine buyers across Delhi.
            </p>
            <Link
              to="/add"
              className="bg-white text-slate-900 px-6 sm:px-10 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg lg:text-xl hover:bg-primary-500 hover:text-white transition-all shadow-xl active:scale-95 inline-block"
            >
              List Your Bike Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
