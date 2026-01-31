import { Link } from 'react-router-dom';
import { User, Building2, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary-900">Create an account</h2>
        <p className="text-primary-500 mt-1">Choose how you want to use RentFlow</p>
      </div>

      <div className="space-y-4">
        {/* Customer Option */}
        <Link
          to="/signup/customer"
          className="block p-6 border-2 border-primary-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all group"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
              <User className="text-blue-600" size={28} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary-900">I want to rent equipment</h3>
                <ArrowRight className="text-primary-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <p className="text-sm text-primary-500 mt-1">
                Browse and rent equipment from trusted vendors. Perfect for individuals and businesses looking for rental solutions.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">Browse catalogs</span>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">Easy booking</span>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">Track orders</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Vendor Option */}
        <Link
          to="/signup/vendor"
          className="block p-6 border-2 border-primary-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all group"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
              <Building2 className="text-green-600" size={28} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary-900">I want to list my equipment</h3>
                <ArrowRight className="text-primary-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <p className="text-sm text-primary-500 mt-1">
                List your equipment for rent and reach thousands of customers. Manage inventory, orders, and grow your rental business.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">List products</span>
                <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">Manage orders</span>
                <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">Analytics</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <p className="text-center text-sm text-primary-500">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-900 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
