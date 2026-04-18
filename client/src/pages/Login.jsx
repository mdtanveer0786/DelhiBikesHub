import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Bike, ArrowRight, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] bg-[#f0f2f5] font-sans flex flex-col justify-center pt-24 pb-12 sm:pt-28 sm:pb-16">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 lg:px-16 gap-12 lg:gap-8">
        
        {/* Left Side: Branding & Trust (Marketplace Style) */}
        <div className="hidden lg:flex flex-col w-1/2 pr-16 space-y-10">
          <div>
            <div className="w-16 h-16 bg-[#d32f2f] flex items-center justify-center text-white rounded-xl shadow-lg mb-8">
              <Bike size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-5xl font-extrabold text-[#24272c] leading-[1.1] tracking-tighter mb-6">
              India&apos;s Most Trusted <br />
              <span className="text-[#d32f2f]">Bike Marketplace</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg">
              Log in to manage your listings, view inquiries, and connect with thousands of verified buyers across Delhi.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: ShieldCheck, title: 'Verified Buyers', desc: 'Secure connections with genuine seekers.' },
              { icon: CheckCircle2, title: 'Zero Commission', desc: 'Keep 100% of your bike&apos;s selling price.' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-[#d32f2f] shrink-0">
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#24272c]">{item.title}</h3>
                  <p className="text-sm text-gray-400 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full max-w-md bg-white p-6 sm:p-10 lg:p-12 rounded-2xl border border-gray-100 shadow-xl lg:ml-auto">
          <div className="mb-10">
            <h2 className="text-2xl font-black text-[#24272c] tracking-tight">Login</h2>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Merchant Access</p>
          </div>

          {isDemo && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-lg text-[11px] font-bold text-amber-700 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Demo Account: <span className="text-[#24272c]">rahul@example.com / password123</span></span>
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg text-xs font-bold text-red-600"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#d32f2f] transition-colors" size={18} />
                  <input
                    type="email" required
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 focus:border-[#d32f2f]/30 rounded-xl font-bold text-[#24272c] placeholder:text-gray-300 focus:ring-4 focus:ring-[#d32f2f]/5 transition-all outline-none"
                    placeholder="Enter your email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                  <Link to="#" className="text-[10px] font-black text-[#d32f2f] hover:underline uppercase tracking-widest">Forgot?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#d32f2f] transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"} required
                    className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 focus:border-[#d32f2f]/30 rounded-xl font-bold text-[#24272c] placeholder:text-gray-300 focus:ring-4 focus:ring-[#d32f2f]/5 transition-all outline-none"
                    placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full btn-primary py-4 rounded-xl text-base flex items-center justify-center gap-2 shadow-lg shadow-[#d32f2f]/20 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
            >
               {loading ? <Loader2 size={24} className="animate-spin" /> : <>Login to Marketplace <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-500 font-bold text-sm">
              New to DelhiBikesHub?{' '}
              <Link to="/signup" className="text-[#d32f2f] hover:underline ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
