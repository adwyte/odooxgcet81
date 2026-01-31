import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth, getDemoCredentials } from '../../context/AuthContext';
import { UserRole } from '../../types';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    const creds = getDemoCredentials(role);
    setFormData(creds);
    try {
      await login(creds.email, creds.password);
      navigate('/dashboard');
    } catch {
      setError('Demo login failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary-900">Welcome back</h2>
        <p className="text-primary-500 mt-1">Sign in to your account to continue</p>
      </div>

      {/* Demo Login Buttons */}
      <div className="space-y-2">
        <p className="text-sm text-primary-500">Quick demo access:</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('customer')}
            className="btn btn-secondary text-sm flex-1"
            disabled={isLoading}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('vendor')}
            className="btn btn-secondary text-sm flex-1"
            disabled={isLoading}
          >
            Vendor
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('admin')}
            className="btn btn-secondary text-sm flex-1"
            disabled={isLoading}
          >
            Admin
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-primary-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-primary-500">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">Email Address</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input pr-12"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-primary-300 text-primary-900 focus:ring-primary-900" />
            <span className="text-sm text-primary-600">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-primary-900 hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-primary-500">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary-900 font-medium hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
