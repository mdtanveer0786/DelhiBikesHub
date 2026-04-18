import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin, Phone, Bike, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', location: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await signup(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fields = [
    { name: 'name', type: 'text', placeholder: 'e.g. John Doe', label: 'Full Name', icon: User, required: true },
    { name: 'email', type: 'email', placeholder: 'e.g. name@email.com', label: 'Email Address', icon: Mail, required: true },
    { name: 'phone', type: 'tel', placeholder: 'e.g. 9876543210', label: 'Mobile Number', icon: Phone, required: true },
    { name: 'location', type: 'text', placeholder: 'e.g. Karol Bagh', label: 'Your Locality', icon: MapPin, required: true },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#f0f2f5] font-sans flex flex-col justify-center pt-24 pb-12 sm:pt-28 sm:pb-16">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 lg:px-16 gap-12 lg:gap-8">
        
        {/* Left Side: Branding & Selling Power */}
        <div className="hidden lg:flex flex-col w-1/2 pr-12 space-y-10">
          <div>
             <div className="w-16 h-16 bg-[#d32f2f] flex items-center justify-center text-white rounded-xl shadow-lg mb-8">
               <Bike size={32} strokeWidth={2.5} />
             </div>
             <h1 className="text-5xl font-extrabold text-[#24272c] leading-[1.1] tracking-tighter mb-6">
               Join Delhi&apos;s Elite <br />
               <span className="text-[#d32f2f]">Seller Network</span>
             </h1>
             <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-md">
               List your bike for free and reach thousands of verified buyers in minutes. No commission, no hidden fees.
             </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {[
              { icon: ShieldCheck, title: 'Verified Profiles', desc: 'Secure community with identity verification.' },
              { icon: CheckCircle2, title: 'Direct Selling', desc: 'Talk to buyers directly without middlemen.' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#d32f2f] shrink-0">
                  <item.icon size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-[#24272c]">{item.title}</h3>
                  <p className="text-sm text-gray-400 font-medium mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Account Creation Form */}
        <div className="w-full max-w-xl bg-white p-6 sm:p-10 lg:p-12 rounded-2xl border border-gray-100 shadow-xl lg:ml-auto">
           <div className="mb-10">
              <h2 className="text-2xl font-black text-[#24272c] tracking-tight">Create Account</h2>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Start your journey</p>
           </div>

           <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg text-xs font-bold text-red-600">
                {error}
              </motion.div>
            )}
           </AnimatePresence>

           <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                {fields.map((f) => (
                   <div key={f.name} className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{f.label}</label>
                      <div className="relative group">
                         <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#d32f2f] transition-colors" size={16} />
                         <input
                           name={f.name} type={f.type} required={f.required}
                           className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 focus:border-[#d32f2f]/30 rounded-xl font-bold text-[#24272c] placeholder:text-gray-300 text-sm focus:ring-4 focus:ring-[#d32f2f]/5 transition-all outline-none"
                           placeholder={f.placeholder}
                           value={formData[f.name]} onChange={handleChange}
                         />
                      </div>
                   </div>
                ))}
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#d32f2f] transition-colors" size={18} />
                    <input
                      name="password" type={showPassword ? 'text' : 'password'} required minLength={6}
                      className="w-full pl-11 pr-12 py-3.5 bg-white border border-gray-200 focus:border-[#d32f2f]/30 rounded-xl font-bold text-[#24272c] placeholder:text-gray-300 text-sm focus:ring-4 focus:ring-[#d32f2f]/5 transition-all outline-none"
                      placeholder="Create safe password"
                      value={formData.password} onChange={handleChange}
                    />
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full btn-primary py-4 rounded-xl text-base flex items-center justify-center gap-2 shadow-lg shadow-[#d32f2f]/20 transition-all active:scale-[0.98] disabled:opacity-70 mt-6"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <>Join Marketplace <ArrowRight size={18} /></>}
              </button>
           </form>

           <div className="mt-10 pt-8 border-t border-gray-50 text-center">
             <p className="text-gray-500 font-bold text-sm">
                A member already?{' '}
                <Link to="/login" className="text-[#d32f2f] hover:underline ml-1">
                   Sign In
                </Link>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
