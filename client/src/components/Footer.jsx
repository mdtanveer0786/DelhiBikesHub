import { Link } from 'react-router-dom';
import { Bike, Facebook, Twitter, Instagram, Mail, ChevronRight, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-[#d32f2f] flex items-center justify-center text-white rounded-lg shadow-lg">
                <Bike size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-[#24272c] tracking-tighter leading-none">
                  DELHI<span className="text-[#d32f2f]">BIKES</span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mt-0.5">Marketplace</span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              India&apos;s most trusted marketplace for pre-owned two-wheelers. We facilitate direct connections between verified buyers and sellers in Delhi NCR.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-[#d32f2f] hover:text-white transition-all shadow-sm">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-black text-[#24272c] uppercase tracking-wider mb-6">Marketplace</h3>
            <ul className="space-y-4">
              {[
                { to: '/bikes', label: 'Buy New Bike' },
                { to: '/bikes', label: 'Used Bikes' },
                { to: '/add', label: 'Sell Your Bike' },
                { to: '/bikes?brand=Hero', label: 'Hero Bikes' },
                { to: '/bikes?brand=Honda', label: 'Honda Bikes' }
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm font-bold text-gray-500 hover:text-[#d32f2f] transition-colors flex items-center gap-1">
                    <ChevronRight size={14} className="text-gray-300" /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-black text-[#24272c] uppercase tracking-wider mb-6">Support</h3>
            <ul className="space-y-4">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Support' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Use' }
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm font-bold text-gray-500 hover:text-[#d32f2f] transition-colors flex items-center gap-1">
                    <ChevronRight size={14} className="text-gray-300" /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-black text-[#24272c] uppercase tracking-wider mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#d32f2f] shrink-0" />
                <span className="text-sm font-bold text-gray-500">123, Karol Bagh, Near Metro Pillar, New Delhi - 110005</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#d32f2f] shrink-0" />
                <span className="text-sm font-bold text-gray-500">+91 99999 99999</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#d32f2f] shrink-0" />
                <span className="text-sm font-bold text-gray-500">hello@delhibikeshub.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            &copy; {year} DelhiBikesHub Marketplace. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase text-gray-300 tracking-tighter">Developed by</span>
            <a 
              href="https://mdtanveeralamdev.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] font-black uppercase text-gray-500 hover:text-[#d32f2f] transition-colors"
            >
              Md Tanveer Alam
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
