import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Bike } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[#f0f2f5] font-sans">
      <Helmet>
        <title>404 - Hub Not Found | DelhiBikesHub</title>
      </Helmet>
      <div className="text-center max-w-lg bg-white p-12 rounded-2xl border border-gray-100 shadow-xl">
        <div className="w-20 h-20 bg-gray-50 flex items-center justify-center text-gray-300 rounded-full mx-auto mb-8">
           <Bike size={40} strokeWidth={1.5} />
        </div>
        <div className="text-8xl font-black text-[#24272c] tracking-tighter mb-4">
          404
        </div>
        <h1 className="text-2xl font-black text-[#24272c] mb-4 uppercase tracking-widest">Hub Disconnected</h1>
        <p className="text-gray-500 mb-10 font-medium leading-relaxed">
          The listing or page you&apos;re looking for is no longer active in our marketplace hub.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary py-4 px-10 rounded-xl text-sm transition-all shadow-lg shadow-[#d32f2f]/20"
          >
            <div className="flex items-center gap-2">
               <Home size={18} />
               Return to Marketplace
            </div>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline py-4 px-10 rounded-xl text-sm"
          >
            <div className="flex items-center gap-2">
               <ArrowLeft size={18} />
               Previous Page
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
