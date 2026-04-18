import { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { PageLoader } from './components/SkeletonLoader';
import { BikeProvider } from './context/BikeContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import PageTransition from './components/PageTransition';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Suspense fallback={<PageLoader />}><PageTransition><Home /></PageTransition></Suspense>} />
        <Route path="/bikes" element={<Suspense fallback={<PageLoader />}><PageTransition><Bikes /></PageTransition></Suspense>} />
        <Route path="/details/:id" element={<Suspense fallback={<PageLoader />}><PageTransition><Details /></PageTransition></Suspense>} />
        <Route path="/add" element={
          <Suspense fallback={<PageLoader />}><ProtectedRoute><PageTransition><AddBike /></PageTransition></ProtectedRoute></Suspense>
        } />
        <Route path="/dashboard" element={
          <Suspense fallback={<PageLoader />}><ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute></Suspense>
        } />
        <Route path="/login" element={<Suspense fallback={<PageLoader />}><PageTransition><Login /></PageTransition></Suspense>} />
        <Route path="/signup" element={<Suspense fallback={<PageLoader />}><PageTransition><Signup /></PageTransition></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={<PageLoader />}><PageTransition><Admin /></PageTransition></Suspense>} />
        <Route path="*" element={<Suspense fallback={<PageLoader />}><PageTransition><NotFound /></PageTransition></Suspense>} />
      </Routes>
    </AnimatePresence>
  );
};

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Bikes = lazy(() => import('./pages/Bikes'));
const Details = lazy(() => import('./pages/Details'));
const AddBike = lazy(() => import('./pages/AddBike'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <BikeProvider>
              <Router>
                <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                  <Navbar />
                  <main className="flex-grow">
                    <AnimatedRoutes />
                  </main>
                  <Footer />
                </div>
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#0f172a', // will be contextual later if needed
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 600,
                    },
                  }}
                />
              </Router>
            </BikeProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
