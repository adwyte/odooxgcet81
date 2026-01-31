import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    gstin: '',
    password: '',
    confirmPassword: '',
    couponCode: '',
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

  const validateGSTIN = (gstin: string) => {
    // Basic GSTIN validation (15 characters)
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validateGSTIN(formData.gstin)) {
      setError('Please enter a valid GSTIN');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        companyName: formData.companyName,
        gstin: formData.gstin,
        password: formData.password,
        couponCode: formData.couponCode || undefined,
      });
      navigate('/dashboard');
    } catch {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-900">Create an account</h2>
        <p className="text-primary-500 mt-1">Start managing your rentals today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="label">Full Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
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
        </div>

        <div>
          <label htmlFor="companyName" className="label">Company Name</label>
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

        <div>
          <label htmlFor="gstin" className="label">
            GSTIN <span className="text-primary-400">(Required for invoicing)</span>
          </label>
          <input
            id="gstin"
            type="text"
            value={formData.gstin}
            onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
            className={`input ${formData.gstin && !validateGSTIN(formData.gstin) ? 'input-error' : ''}`}
            placeholder="29ABCDE1234F1Z5"
            maxLength={15}
            required
          />
          {formData.gstin && !validateGSTIN(formData.gstin) && (
            <p className="text-sm text-red-500 mt-1">Please enter a valid 15-character GSTIN</p>
          )}
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
          
          {/* Password requirements */}
          <div className="mt-2 space-y-1">
            {passwordRequirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-100 text-green-600' : 'bg-primary-100 text-primary-400'}`}>
                  {req.met && <Check size={12} />}
                </div>
                <span className={req.met ? 'text-green-600' : 'text-primary-500'}>{req.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className={`input ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'input-error' : ''}`}
            placeholder="••••••••"
            required
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>

        <div>
          <label htmlFor="couponCode" className="label">
            Coupon Code <span className="text-primary-400">(Optional)</span>
          </label>
          <input
            id="couponCode"
            type="text"
            value={formData.couponCode}
            onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
            className="input"
            placeholder="WELCOME20"
          />
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
            <a href="#" className="text-primary-900 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary-900 hover:underline">Privacy Policy</a>
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
              Create Account
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
