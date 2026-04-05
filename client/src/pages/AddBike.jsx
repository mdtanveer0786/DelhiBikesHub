import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBikes } from '../context/BikeContext';
import { useAuth } from '../context/AuthContext';
import { Bike, MapPin, Tag, Calendar, Gauge, IndianRupee, FileText, Loader2, CheckCircle } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

const AddBike = () => {
  const { addBike, uploadImages } = useBikes();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Bike',
    brand: '',
    model: '',
    year: '',
    km: '',
    price: '',
    description: '',
    locality: '',
  });

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrls = [];

      // Upload images if any
      if (images.length > 0) {
        const files = images.filter(img => img.file).map(img => img.file);
        if (files.length > 0) {
          const uploadResult = await uploadImages(files);
          if (uploadResult.success) {
            imageUrls = uploadResult.images.map(img => img.url);
          }
        }
      }

      const bikeData = {
        ...formData,
        images: imageUrls,
        userId: currentUser.id,
        user_id: currentUser.id,
        sellerName: currentUser.name,
        sellerPhone: currentUser.phone,
        sellerEmail: currentUser.email,
      };

      const result = await addBike(bikeData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const brands = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Yamaha', 'Suzuki', 'Royal Enfield'];
  const localities = ['Karol Bagh', 'Lajpat Nagar', 'Rohini', 'Dwarka', 'Shahdara', 'Connaught Place', 'Pitampura', 'Janakpuri'];

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Listing Created!</h2>
          <p className="text-slate-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 lg:py-12">
      <div className="bg-white rounded-2xl sm:rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 sm:p-10 lg:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-primary-600/20 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 sm:mb-4">Sell Your Bike</h1>
            <p className="text-slate-400 text-sm sm:text-base">Fill in the details to list for thousands of buyers in Delhi</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-8 lg:p-12 space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Basic Info */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 flex items-center gap-2">
              <Tag size={18} className="text-primary-600" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Vehicle Type</label>
                <div className="flex gap-3">
                  {['Bike', 'Scooty'].map(type => (
                    <button
                      key={type}
                      type="button"
                      className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm transition-all ${
                        formData.type === type
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                      onClick={() => setFormData({ ...formData, type })}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Brand</label>
                <select
                  name="brand" required
                  className="w-full px-4 py-3 sm:py-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-600 font-medium text-sm"
                  value={formData.brand} onChange={handleChange}
                >
                  <option value="">Select Brand</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Model Name</label>
                <input
                  name="model" type="text" required
                  className="w-full px-4 py-3 sm:py-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-600 font-medium text-sm"
                  placeholder="e.g. Splendor Plus, Activa 6G"
                  value={formData.model} onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Location in Delhi</label>
                <select
                  name="locality" required
                  className="w-full px-4 py-3 sm:py-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-600 font-medium text-sm"
                  value={formData.locality} onChange={handleChange}
                >
                  <option value="">Select Locality</option>
                  {localities.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Technical Info */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 flex items-center gap-2">
              <Calendar size={18} className="text-primary-600" />
              Technical Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Registration Year</label>
                <input name="year" type="number" required className="w-full px-4 py-3 sm:py-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-600 font-medium text-sm"
                  placeholder="YYYY" value={formData.year} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">KMs Driven</label>
                <input name="km" type="number" required className="w-full px-4 py-3 sm:py-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-600 font-medium text-sm"
                  placeholder="e.g. 15000" value={formData.km} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Expected Price (₹)</label>
                <input name="price" type="number" required className="w-full px-4 py-3 sm:py-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-600 font-medium text-sm"
                  placeholder="e.g. 45000" value={formData.price} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Description & Photos */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-primary-600" />
              Description & Photos
            </h2>
            <textarea
              name="description" rows="4" required
              className="w-full px-4 py-3 sm:py-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-600 font-medium text-sm resize-none"
              placeholder="Tell buyers about the condition, service history, and any special features..."
              value={formData.description} onChange={handleChange}
            />
            <ImageUploader images={images} onChange={setImages} maxFiles={5} disabled={submitting} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 text-white py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl font-black text-lg sm:text-xl hover:bg-primary-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Posting...
              </>
            ) : (
              'Post My Ad'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBike;
