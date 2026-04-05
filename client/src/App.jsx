import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { PageLoader } from './components/SkeletonLoader';
import { BikeProvider } from './context/BikeContext';
import { AuthProvider } from './context/AuthContext';

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
    <ErrorBoundary>
      <AuthProvider>
        <BikeProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-50">
              <Navbar />
              <main className="flex-grow">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/bikes" element={<Bikes />} />
                    <Route path="/details/:id" element={<Details />} />
                    <Route path="/add" element={
                      <ProtectedRoute><AddBike /></ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#0f172a',
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
    </ErrorBoundary>
  );
}

export default App;
