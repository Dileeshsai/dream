
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Loader, Shield, Mail } from 'lucide-react';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const inputRefs = useRef([]);
  const { verifyOTP, resendOTP, loading, pendingRegistration, clearPendingRegistration } = useAuth();
  const navigate = useNavigate();

  // Reset navigation flag when component mounts
  useEffect(() => {
    setIsNavigatingBack(false);
  }, []);

  useEffect(() => {
    // Redirect if no pending registration and not intentionally navigating back
    if (!pendingRegistration && !isNavigatingBack) {
      navigate('/register');
      return;
    }
    
    // Calculate timer based on expiry time
    if (pendingRegistration && pendingRegistration.expiresIn) {
      const expiryTime = new Date(pendingRegistration.timestamp).getTime() + (pendingRegistration.expiresIn * 60 * 1000);
      const remainingTime = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setTimer(remainingTime);
      setCanResend(remainingTime <= 0);
    }
  }, [pendingRegistration, navigate, isNavigatingBack]);

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

    const isValid = await verifyOTP(otpValue);
    if (isValid) {
      navigate('/dashboard');
    } else {
      setError('Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP();
      setOtp(['', '', '', '', '', '']);
      setError('');
      setCanResend(false);
      inputRefs.current[0].focus();
    } catch (error) {
      setError(error.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button 
          onClick={() => {
            // Set flag to prevent automatic redirect
            setIsNavigatingBack(true);
            // Clear pending registration when going back
            clearPendingRegistration();
            navigate('/register');
          }}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Register
        </button>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Account</h2>
            <p className="text-gray-600 mb-4">
              We've sent a 6-digit code to your email address.
              Enter it below to continue.
            </p>
            {pendingRegistration && (
              <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                <Mail className="w-4 h-4 mr-2" />
                {pendingRegistration.email}
              </div>
            )}
          </div>

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
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Resend Code
                </button>
              ) : (
                <p className="text-gray-600">
                  Resend code in {timer} seconds
                </p>
              )}
              
              {/* OTP Info */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Check your email for the OTP code (for development, check the backend console)
                </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
