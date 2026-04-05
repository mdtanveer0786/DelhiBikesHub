import React from 'react';
import { Link } from 'react-router-dom';
import { Bike, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
          {/* Brand Info */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-5">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white">
                <Bike size={20} />
              </div>
              <span className="text-xl font-black text-white">
                Delhi<span className="text-primary-400">Bikes</span>Hub
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm">
              Delhi's trusted marketplace for buying and selling used bikes and scooties.
              Connecting buyers and sellers across Delhi.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-slate-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all" aria-label="Social media">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-black uppercase tracking-wider mb-4 sm:mb-6">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/bikes', label: 'All Bikes' },
                { to: '/add', label: 'Sell Bike' },
                { to: '/dashboard', label: 'Dashboard' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Localities */}
          <div>
            <h3 className="text-white text-sm font-black uppercase tracking-wider mb-4 sm:mb-6">Localities</h3>
            <ul className="space-y-2 sm:space-y-3">
              {['Karol Bagh', 'Lajpat Nagar', 'Rohini', 'Dwarka'].map(loc => (
                <li key={loc}>
                  <Link to={`/bikes?location=${encodeURIComponent(loc)}`} className="text-sm hover:text-primary-400 transition-colors">
                    {loc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-white text-sm font-black uppercase tracking-wider mb-4 sm:mb-6">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin size={16} className="text-primary-400 shrink-0 mt-0.5" />
                <span>Delhi, India</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone size={16} className="text-primary-400 shrink-0" />
                <span>+91 8252574286</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail size={16} className="text-primary-400 shrink-0" />
                <span className="break-all">info@delhibikeshub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>&copy; {year} DelhiBikesHub. All rights reserved.</p>
          <p>
            Developed by{' '}
            <a href="https://mdtanveeralamdev.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline font-bold">
              Md Tanveer Alam
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
