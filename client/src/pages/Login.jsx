import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Bike, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 sm:w-32 h-28 sm:h-32 bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl sm:rounded-[2rem] shadow-lg shadow-primary-600/20 mb-4 sm:mb-6">
            <Bike size={32} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-1 sm:mt-2 text-sm">Login to manage your listings</p>
        </div>

        {isDemo && (
          <div className="mt-4 bg-amber-50 text-amber-700 p-3 rounded-xl text-xs font-medium border border-amber-100">
            <strong>Demo Mode:</strong> Use <code className="bg-amber-100 px-1 rounded">rahul@example.com</code> / <code className="bg-amber-100 px-1 rounded">password123</code>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 text-red-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3 sm:space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
              <input
                type="email" required
                className="w-full pl-11 pr-4 py-3 sm:py-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-600 font-medium text-slate-900 text-sm"
                placeholder="Email address"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"} required
                className="w-full pl-11 pr-12 py-3 sm:py-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-600 font-medium text-slate-900 text-sm"
                placeholder="Password"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white py-3.5 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-primary-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <>
                <span>Login</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 font-medium mt-6 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 font-black hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
