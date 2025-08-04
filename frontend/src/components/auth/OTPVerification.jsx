
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Loader, Shield, Mail } from 'lucide-react';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();

  // Get pending registration email from localStorage
  const pendingEmail = localStorage.getItem('pendingRegistrationEmail');

  useEffect(() => {
    // Redirect if no pending registration
    if (!pendingEmail) {
      navigate('/register');
      return;
    }
    
    // Set initial timer (10 minutes)
    setTimer(10 * 60); // 10 minutes in seconds
  }, [pendingEmail, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          const newTimer = prev - 1;
          if (newTimer <= 0) {
            setCanResend(true);
          }
          return newTimer;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit) && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (otpValue = otp.join('')) => {
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyOtp({ email: pendingEmail, otp: otpValue });
      
      if (result.success) {
        console.log('OTP verification successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');

    try {
      const result = await resendOtp(pendingEmail);
      
      if (result.success) {
        setOtp(['', '', '', '', '', '']);
        setError('');
        setCanResend(false);
        setTimer(10 * 60); // Reset timer to 10 minutes
        inputRefs.current[0].focus();
      } else {
        setError(result.error || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a verification code to{' '}
            <span className="font-semibold text-gray-900">{pendingEmail}</span>
          </p>
        </div>

        {/* Timer */}
        {timer > 0 && (
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              Code expires in <span className="font-semibold text-red-600">{formatTime(timer)}</span>
            </p>
          </div>
        )}

        {/* OTP Input */}
        <div className="flex justify-center space-x-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={1}
            />
          ))}
        </div>

        {error && (
          <div className="text-red-600 text-center mb-4">{error}</div>
        )}

        {/* Verify Button */}
        <button
          onClick={() => handleVerify()}
          disabled={loading || otp.join('').length !== 6}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            'Verify Code'
          )}
        </button>

        {/* Resend Code */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={!canResend || loading}
            className="text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canResend ? 'Resend Code' : `Resend in ${formatTime(timer)}`}
          </button>
        </div>

        {/* Back to Register */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.removeItem('pendingRegistrationEmail');
              navigate('/register');
            }}
            className="text-gray-600 hover:text-gray-700 font-semibold flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
