import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check size={32} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary-900">Check your email</h2>
          <p className="text-primary-500 mt-2">
            We've sent a password reset link to<br />
            <span className="font-medium text-primary-900">{email}</span>
          </p>
        </div>
        <p className="text-sm text-primary-500">
          Didn't receive the email?{' '}
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-primary-900 font-medium hover:underline"
          >
            Try again
          </button>
        </p>
        <Link to="/login" className="btn btn-secondary w-full">
          <ArrowLeft size={18} />
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/login" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-900">
        <ArrowLeft size={18} />
        Back to Sign In
      </Link>

      <div>
        <h2 className="text-2xl font-bold text-primary-900">Forgot password?</h2>
        <p className="text-primary-500 mt-1">
          No worries, we'll send you reset instructions.
        </p>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
            required
          />
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
              <Mail size={18} />
              Send Reset Link
            </>
          )}
        </button>
      </form>
    </div>
  );
}
