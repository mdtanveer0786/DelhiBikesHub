import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin, Phone, Bike, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    { name: 'name', type: 'text', placeholder: 'Full Name', icon: User, required: true },
    { name: 'email', type: 'email', placeholder: 'Email address', icon: Mail, required: true },
    { name: 'phone', type: 'tel', placeholder: 'Phone Number', icon: Phone, required: true },
    { name: 'location', type: 'text', placeholder: 'Your Locality (e.g. Rohini)', icon: MapPin, required: true },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-lg w-full bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-28 sm:w-32 h-28 sm:h-32 bg-primary-50 rounded-full -translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl sm:rounded-[2rem] shadow-lg shadow-primary-600/20 mb-4 sm:mb-6">
            <Bike size={32} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Join DelhiBikesHub</h2>
          <p className="text-slate-500 mt-1 sm:mt-2 text-sm">Start buying and selling in Delhi today</p>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 text-red-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <form className="mt-6 sm:mt-8 space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {fields.map(({ name, type, placeholder, icon: Icon, required }) => (
              <div key={name} className="relative group">
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                <input
                  name={name} type={type} required={required}
                  className="w-full pl-11 pr-4 py-3 sm:py-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-600 font-medium text-slate-900 text-sm"
                  placeholder={placeholder}
                  value={formData[name]} onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <div className="relative group sm:col-span-2">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
            <input
              name="password" type={showPassword ? 'text' : 'password'} required minLength={6}
              className="w-full pl-11 pr-12 py-3 sm:py-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-600 font-medium text-slate-900 text-sm"
              placeholder="Create Password (min 6 chars)"
              value={formData.password} onChange={handleChange}
            />
            <button type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white py-3.5 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-primary-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 font-medium mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-black hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
