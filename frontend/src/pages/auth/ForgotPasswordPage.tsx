import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Check, Eye, EyeOff, Lock, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type Step = 'email' | 'otp' | 'reset' | 'success';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword, verifyOtp, resetPassword } = useAuth();
  
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expiresIn, setExpiresIn] = useState(10);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer
  useEffect(() => {
    if (step === 'otp' && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [step, resendTimer]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await forgotPassword(email);
      setExpiresIn(result.expiresInMinutes);
      setStep('otp');
      setResendTimer(60);
      setCanResend(false);
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      otpRefs.current[nextIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = value.replace(/\D/g, '');
      setOtp(newOtp);
      
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await verifyOtp(email, otpValue);
      setStep('reset');
    } catch {
      setError('Invalid or expired OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const otpValue = otp.join('');
      await resetPassword(email, otpValue, newPassword);
      setStep('success');
    } catch {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setResendTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch {
      setError('Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success step
  if (step === 'success') {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check size={32} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary-900">Password Reset!</h2>
          <p className="text-primary-500 mt-2">
            Your password has been successfully reset.<br />
            You can now sign in with your new password.
          </p>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="btn btn-primary w-full"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Reset password step
  if (step === 'reset') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setStep('otp')}
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-900"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <h2 className="text-2xl font-bold text-primary-900">Set new password</h2>
          <p className="text-primary-500 mt-1">
            Create a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleResetSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="newPassword" className="label">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={20} />
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input pl-10 pr-12"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-primary-400 mt-1">Must be at least 8 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={20} />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    );
  }

  // OTP verification step
  if (step === 'otp') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setStep('email')}
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-900"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound size={32} className="text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary-900">Enter OTP</h2>
          <p className="text-primary-500 mt-1">
            We sent a 6-digit code to<br />
            <span className="font-medium text-primary-900">{email}</span>
          </p>
          <p className="text-xs text-primary-400 mt-2">
            Code expires in {expiresIn} minutes
          </p>
        </div>

        <form onSubmit={handleOtpSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (otpRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-primary-500">
          Didn't receive the code?{' '}
          {canResend ? (
            <button
              onClick={handleResendOtp}
              disabled={isLoading}
              className="text-primary-900 font-medium hover:underline"
            >
              Resend OTP
            </button>
          ) : (
            <span className="text-primary-400">
              Resend in {resendTimer}s
            </span>
          )}
        </p>
      </div>
    );
  }

  // Email step (default)
  return (
    <div className="space-y-6">
      <Link to="/login" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-900">
        <ArrowLeft size={18} />
        Back to Sign In
      </Link>

      <div>
        <h2 className="text-2xl font-bold text-primary-900">Forgot password?</h2>
        <p className="text-primary-500 mt-1">
          No worries, we'll send you an OTP to reset it.
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-5">
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
              Send OTP
            </>
          )}
        </button>
      </form>
    </div>
  );
}
