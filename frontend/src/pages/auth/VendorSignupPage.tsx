import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Check, ArrowLeft, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BUSINESS_CATEGORIES = [
  'Construction & Heavy Equipment',
  'Events & Entertainment',
  'Photography & Videography',
  'Electronics & Technology',
  'Furniture & Home',
  'Medical Equipment',
  'Sports & Recreation',
  'Automotive',
  'Industrial Tools',
  'Agriculture',
  'Party & Wedding',
  'Other',
];

export default function VendorSignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    businessCategory: '',
    gstin: '',
    address: '',
    city: '',
    state: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const passwordRequirements = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'Contains a number', met: /\d/.test(formData.password) },
  ];

  const isPasswordValid = passwordRequirements.every(req => req.met);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateGSTIN = (gstin: string) => {
    if (!gstin) return true; // Optional
    const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
    return gstinRegex.test(gstin);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.companyName.trim()) {
      setError('Company name is required for vendors');
      return;
    }

    if (!formData.businessCategory) {
      setError('Please select a business category');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.gstin && !validateGSTIN(formData.gstin)) {
      setError('Please enter a valid GSTIN');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    try {
      await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        companyName: formData.companyName,
        businessCategory: formData.businessCategory,
        gstin: formData.gstin || undefined,
        password: formData.password,
        role: 'vendor',
      });
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to="/signup" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-900 mb-4">
          <ArrowLeft size={16} />
          Back to signup options
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <Building2 className="text-primary-900" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-900">Become a Vendor</h2>
            <p className="text-primary-500">List your equipment and start earning</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Personal Information */}
        <div className="border-b border-primary-200 pb-4">
          <h3 className="text-sm font-semibold text-primary-900 mb-3">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="label">First Name</label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="input"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="label">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="input"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="label">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="border-b border-primary-200 pb-4">
          <h3 className="text-sm font-semibold text-primary-900 mb-3">Business Information</h3>
          
          <div>
            <label htmlFor="companyName" className="label">Company / Business Name</label>
            <input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="input"
              placeholder="Your Company Ltd."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="businessCategory" className="label">Business Category</label>
              <select
                id="businessCategory"
                value={formData.businessCategory}
                onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                className="input"
                required
              >
                <option value="">Select a category</option>
                {BUSINESS_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="gstin" className="label">
                GSTIN <span className="text-primary-400">(Optional)</span>
              </label>
              <input
                id="gstin"
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                className={`input ${formData.gstin && !validateGSTIN(formData.gstin) ? 'border-red-300' : ''}`}
                placeholder="29ABCDE1234F1Z5"
                maxLength={15}
              />
              {formData.gstin && !validateGSTIN(formData.gstin) && (
                <p className="text-xs text-red-500 mt-1">Invalid GSTIN format</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="address" className="label">
              Business Address <span className="text-primary-400">(Optional)</span>
            </label>
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input"
              placeholder="Street address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="city" className="label">
                City <span className="text-primary-400">(Optional)</span>
              </label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="input"
                placeholder="Mumbai"
              />
            </div>
            <div>
              <label htmlFor="state" className="label">
                State <span className="text-primary-400">(Optional)</span>
              </label>
              <input
                id="state"
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="input"
                placeholder="Maharashtra"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <h3 className="text-sm font-semibold text-primary-900 mb-3">Security</h3>
          
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
            
            <div className="mt-2 grid grid-cols-2 gap-1">
              {passwordRequirements.map((req) => (
                <div key={req.label} className="flex items-center gap-2 text-xs">
                  <div className={`w-3 h-3 rounded-full flex items-center justify-center ${req.met ? 'bg-green-100 text-green-600' : 'bg-primary-100 text-primary-400'}`}>
                    {req.met && <Check size={10} />}
                  </div>
                  <span className={req.met ? 'text-green-600' : 'text-primary-500'}>{req.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="confirmPassword" className="label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`input ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300' : ''}`}
              placeholder="••••••••"
              required
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-primary-300 text-primary-900 focus:ring-primary-900"
          />
          <span className="text-sm text-primary-600">
            I agree to the{' '}
            <Link to="/terms" className="text-primary-900 hover:underline">Terms of Service</Link>,{' '}
            <Link to="/privacy" className="text-primary-900 hover:underline">Privacy Policy</Link>, and{' '}
            <Link to="/vendor-agreement" className="text-primary-900 hover:underline">Vendor Agreement</Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Create Vendor Account
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-primary-500">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-900 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
