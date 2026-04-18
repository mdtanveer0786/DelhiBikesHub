import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bike, Search, Menu, X, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/bikes?model=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const navLinks = [
    { name: 'New Bikes', path: '/bikes' },
    { name: 'Used Bikes', path: '/bikes' },
    { name: 'Sell Bike', path: '/add' },
    { name: 'Localities', path: '/#hubs' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white border-b border-gray-100'}`}>
      {/* Top Utility Bar (Secondary) */}
      <div className="hidden lg:block bg-gray-50 border-b border-gray-100 py-1.5">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="flex gap-6">
            <span>Verified Listings</span>
            <span>Zero Commission</span>
            <span>Direct Connection</span>
          </div>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-primary-red transition-colors">Support</Link>
            <Link to="/about" className="hover:text-primary-red transition-colors">About Hub</Link>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 lg:px-6 h-16 lg:h-20 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 bg-[#d32f2f] flex items-center justify-center text-white rounded-lg shadow-lg group-hover:scale-105 transition-transform">
            <Bike size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-[#24272c] tracking-tighter leading-none">
              DELHI<span className="text-[#d32f2f]">BIKES</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mt-0.5">Marketplace</span>
          </div>
        </Link>

        {/* Categories (Desktop) */}
        <div className="hidden lg:flex items-center gap-8 h-full shrink-0">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path}
              className={`text-sm font-bold uppercase tracking-wider h-full flex items-center border-b-2 transition-all ${location.pathname === link.path ? 'border-[#d32f2f] text-[#24272c]' : 'border-transparent text-gray-500 hover:text-[#d32f2f]'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Global Search Box (Desktop) */}
        <div className="hidden lg:flex flex-grow max-w-xl">
           <form onSubmit={handleSearch} className="w-full relative group">
              <input
                type="text"
                placeholder="Search brands, models or localities..."
                className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-[#d32f2f]/30 py-2.5 pl-12 pr-4 rounded-lg text-sm font-bold text-[#24272c] placeholder:text-gray-400 focus:ring-4 focus:ring-[#d32f2f]/5 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d32f2f]" size={18} />
           </form>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-black uppercase text-gray-500 hover:text-[#d32f2f] transition-colors tracking-tight">
                <LayoutDashboard size={16} />
                <span>Account</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="hidden sm:flex items-center gap-2 text-sm font-black uppercase text-amber-600 hover:text-amber-700 transition-colors tracking-tight">
                  <Shield size={16} />
                  <span>Admin</span>
                </Link>
              )}
              <button 
                onClick={logout}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-[#d32f2f] transition-all"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-[10px] sm:text-xs">
              SIGN IN
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[60] p-8 lg:hidden"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-black text-[#24272c]">MENU</span>
                <button onClick={() => setIsOpen(false)}><X size={24} /></button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-bold text-gray-500 hover:text-[#d32f2f] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="border-gray-100" />
                {currentUser ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-bold text-gray-500">
                      <LayoutDashboard size={20} />
                      My Dashboard
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-bold text-amber-600">
                        <Shield size={20} />
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center gap-3 text-lg font-bold text-red-500">
                      <LogOut size={20} />
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn-primary">
                    SIGN IN NOW
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
