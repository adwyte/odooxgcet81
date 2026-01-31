import { Outlet, Navigate, Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-900 p-12 flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Package size={24} className="text-primary-900" />
            </div>
            <span className="text-2xl font-bold text-white">RentFlow</span>
          </Link>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Simplify Your<br />Rental Business
          </h1>
          <p className="text-lg text-primary-300">
            Manage quotations, orders, inventory, and invoicing all in one place. 
            Built for modern rental businesses.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-primary-300">Active Vendors</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-white">10K+</p>
              <p className="text-sm text-primary-300">Rentals/Month</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm text-primary-300">Satisfaction Rate</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-sm text-primary-300">Support</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-primary-400">
          © 2024 RentFlow. All rights reserved.
        </p>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center">
                <Package size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-primary-900">RentFlow</span>
            </Link>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
}
