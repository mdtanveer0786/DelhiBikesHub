import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBikes } from '../context/BikeContext';
import { useAuth } from '../context/AuthContext';
import { Tag, Calendar, FileText, Loader2, CheckCircle, Bike, MapPin, IndianRupee } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import { toast } from 'react-hot-toast';

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

  const validate = () => {
    const currentYear = new Date().getFullYear();
    if (!formData.brand) return "Please select a brand";
    if (!formData.model.trim()) return "Please enter a model name";
    if (formData.year < 1990 || formData.year > currentYear) return `Year must be between 1990 and ${currentYear}`;
    if (formData.km < 0) return "Kilometers cannot be negative";
    if (formData.price <= 0) return "Price must be greater than zero";
    if (!formData.locality) return "Please select a locality";
    if (!formData.description.trim()) return "Please provide a description";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errorMsg = validate();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    setSubmitting(true);

    try {
      let imageUrls = [];

      if (images.length > 0) {
        const files = images.filter(img => img.file).map(img => img.file);
        if (files.length > 0) {
          const uploadPromise = uploadImages(files);
          toast.promise(uploadPromise, {
            loading: 'Uploading hub assets...',
            success: 'Photos attached successfully!',
            error: 'Failed to upload photos.',
          });
          
          const uploadResult = await uploadPromise;
          if (uploadResult.success) {
            imageUrls = uploadResult.images.map(img => img.url);
          } else {
            setSubmitting(false);
            return;
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
        toast.success("Listing published successfully!");
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        toast.error(result.message || "Failed to create listing");
      }
    } catch (err) {
      console.error('Submit error:', err);
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const brands = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Yamaha', 'Suzuki', 'Royal Enfield', 'KTM', 'Jawa'];
  const localities = ['Karol Bagh', 'Lajpat Nagar', 'Rohini', 'Dwarka', 'Shahdara', 'Connaught Place', 'Pitampura', 'Janakpuri'];

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[#f0f2f5]">
        <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-xl text-center max-w-sm w-full animate-fadeIn">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-[#24272c] mb-2 tracking-tight">Listing Live!</h2>
          <p className="text-gray-400 font-medium">Your bike has been added to the hub. Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f2f5] min-h-screen pt-24 lg:pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
           <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-[#24272c] tracking-tight">Post Your Bike Ad</h1>
              <p className="text-gray-500 font-medium mt-1">Ready to find a new owner in Delhi NCR?</p>
           </div>
           <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500" /> Standard Listing: <span className="text-[#24272c]">Free</span>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Main Info Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm space-y-8">
            <h2 className="text-sm font-black text-[#24272c] uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 pb-4">
              <Tag size={18} className="text-[#d32f2f]" /> Basic Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle Category</label>
                  <div className="flex gap-4">
                    {['Bike', 'Scooty'].map(type => (
                      <button
                        key={type} type="button"
                        onClick={() => setFormData({ ...formData, type })}
                        className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all border ${
                          formData.type === type
                            ? 'bg-[#d32f2f] text-white border-[#d32f2f] shadow-lg shadow-[#d32f2f]/20'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Brand</label>
                  <select
                    name="brand" required
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#d32f2f]/30 rounded-xl font-bold text-[#24272c] placeholder:text-gray-300 focus:ring-4 focus:ring-[#d32f2f]/5 transition-all outline-none text-sm appearance-none"
                    value={formData.brand} onChange={handleChange}
                  >
                    <option value="">Choose manufacturer...</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Model Name</label>
                  <div className="relative group">
                    <Bike className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#d32f2f] transition-colors" size={18} />
                    <input
                      name="model" type="text" required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#d32f2f]/30 rounded-xl font-bold text-[#24272c] placeholder:text-gray-300 text-sm focus:ring-4 focus:ring-[#d32f2f]/5 transition-all outline-none"
                      placeholder="e.g. Royal Enfield Himalayan"
                      value={formData.model} onChange={handleChange}
                    />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Hub (Locality)</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#d32f2f] transition-colors" size={18} />
                    <select
                      name="locality" required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#d32f2f]/30 rounded-xl font-bold text-[#24272c] placeholder:text-gray-300 text-sm focus:ring-4 focus:ring-[#d32f2f]/5 transition-all outline-none appearance-none"
                      value={formData.locality} onChange={handleChange}
                    >
                      <option value="">Select location...</option>
                      {localities.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
               </div>
            </div>
          </div>

          {/* Practical Info Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm space-y-8">
            <h2 className="text-sm font-black text-[#24272c] uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 pb-4">
              <Calendar size={18} className="text-[#d32f2f]" /> Technical Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">MFG Year</label>
                  <input name="year" type="number" required placeholder="YYYY" className="w-full px-4 py-4 bg-gray-50 border border-gray-100 focus:bg-white rounded-xl font-bold text-[#24272c] focus:ring-2 focus:ring-[#d32f2f]/10 outline-none text-sm"
                    value={formData.year} onChange={handleChange} />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">KM Driven</label>
                  <input name="km" type="number" required placeholder="e.g. 12000" className="w-full px-4 py-4 bg-gray-50 border border-gray-100 focus:bg-white rounded-xl font-bold text-[#24272c] focus:ring-2 focus:ring-[#d32f2f]/10 outline-none text-sm"
                    value={formData.km} onChange={handleChange} />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asking Price (₹)</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#d32f2f] transition-colors" size={18} />
                    <input name="price" type="number" required placeholder="e.g. 85000" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 focus:bg-white rounded-xl font-bold text-[#24272c] focus:ring-2 focus:ring-[#d32f2f]/10 outline-none text-sm"
                      value={formData.price} onChange={handleChange} />
                  </div>
               </div>
            </div>
          </div>

          {/* Description & Assets Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm space-y-8">
            <h2 className="text-sm font-black text-[#24272c] uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 pb-4">
              <FileText size={18} className="text-[#d32f2f]" /> Marketplace Statement
            </h2>
            <textarea
              name="description" rows="5" required
              className="w-full px-6 py-6 bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#d32f2f]/30 rounded-xl font-medium text-[#24272c] placeholder:text-gray-300 focus:ring-4 focus:ring-[#d32f2f]/5 transition-all outline-none resize-none text-base"
              placeholder="Describe the condition, maintenance history, and specific features to win buyer trust..."
              value={formData.description} onChange={handleChange}
            />
            <div className="pt-4 border-t border-gray-50">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-4 block">Upload Hub Visuals (Max 5)</label>
               <ImageUploader images={images} onChange={setImages} maxFiles={5} disabled={submitting} />
            </div>
          </div>

          <button
            type="submit" disabled={submitting}
            className="w-full btn-primary py-6 rounded-xl font-black text-lg shadow-xl shadow-[#d32f2f]/20 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {submitting ? (
              <><Loader2 size={24} className="animate-spin" /> Publishing Ad...</>
            ) : (
              'List Bike for Sale'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBike;
