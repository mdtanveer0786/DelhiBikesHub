import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to your error reporting service in production
    if (import.meta.env.PROD) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-red-500" />
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              Something Went Wrong
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mb-8 leading-relaxed">
              We hit an unexpected error. Don't worry — your data is safe. 
              Try refreshing or head back to the homepage.
            </p>

            {/* Error details in dev */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left bg-slate-900 text-red-300 p-4 rounded-2xl text-xs font-mono overflow-auto max-h-40">
                <summary className="cursor-pointer text-slate-400 font-bold mb-2">
                  Error Details (Dev Only)
                </summary>
                <pre className="whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-primary-600 transition-all active:scale-95"
              >
                <RefreshCw size={18} />
                Refresh Page
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
              >
                <Home size={18} />
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
