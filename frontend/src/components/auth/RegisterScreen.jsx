
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Loader } from 'lucide-react';
import Captcha from '../common/Captcha';
import { apiPost } from '../../services/apiService';
import WelcomeHeader from '../welcome/WelcomeHeader';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [captchaValid, setCaptchaValid] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const { register, loading, pendingRegistration } = useAuth();
  const navigate = useNavigate();

  // Redirect to OTP verification if there's already a pending registration
  useEffect(() => {
    if (pendingRegistration) {
      navigate('/verify-otp');
    }
  }, [pendingRegistration, navigate]);

  // Debounced email check
  useEffect(() => {
    const checkEmail = async () => {
      if (formData.email && /\S+@\S+\.\S+/.test(formData.email)) {
        setIsCheckingEmail(true);
        try {
          // This would be a backend endpoint to check if email exists
          // For now, we'll rely on the registration error handling
          setIsCheckingEmail(false);
        } catch (error) {
          setIsCheckingEmail(false);
        }
      }
    };

    const timeoutId = setTimeout(checkEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password should be at least 8 characters for better security';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!captchaValid) {
      newErrors.captcha = 'Please complete the security verification';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms and Conditions to continue';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log('Starting registration process...');
        // Prepare payload for backend
        const payload = {
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        };
        console.log('Registration payload:', payload);
        
        const result = await register(payload);
        console.log('Registration result:', result);
        
        // Only navigate if registration was successful
        if (result && result.success !== false) {
          console.log('Registration successful, navigating to OTP verification...');
          navigate('/verify-otp');
        } else {
          console.log('Registration failed, not navigating');
          setErrors({ submit: 'Registration failed. Please try again.' });
        }
      } catch (error) {
        console.error('Registration error:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        let errorMessage = 'Registration failed. Please try again.';
        
        // Handle different types of errors
        if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const errorData = error.response.data;
          
          if (status === 404) {
            errorMessage = 'Server not found. Please try again later.';
          } else if (status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (status === 503) {
            errorMessage = 'Service temporarily unavailable. Please try again later.';
          } else if (status === 400) {
            // Check for specific validation errors from backend
            if (errorData && errorData.error) {
              if (errorData.error.includes('already registered') || errorData.error.includes('already exists')) {
                errorMessage = 'User already exists. Please use a different email or phone number.';
              } else if (errorData.error.includes('All fields are required')) {
                errorMessage = 'Please fill in all required fields.';
              } else if (errorData.error.includes('Email or phone already registered')) {
                errorMessage = 'Email or phone number already registered. Please use different credentials.';
              } else {
                errorMessage = errorData.error;
              }
            } else {
              errorMessage = 'Invalid request. Please check your information.';
            }
          } else if (status >= 400 && status < 500) {
            errorMessage = 'Invalid request. Please check your information.';
          } else if (status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          }
        } else if (error.request) {
          // Request was made but no response received
          errorMessage = 'No response from server. Please check your connection and try again.';
        } else if (error.message) {
          // Other error with message
          if (error.message.includes('timeout')) {
            errorMessage = 'Request timeout. Please try again.';
          } else if (error.message.includes('canceled')) {
            errorMessage = 'Request was canceled. Please try again.';
          } else if (error.message.includes('already registered') || error.message.includes('already exists')) {
            errorMessage = 'User already exists. Please use a different email or phone number.';
          } else {
            // Use the actual error message if it's meaningful
            errorMessage = error.message;
          }
        }
        
        setErrors({ submit: errorMessage });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear submit error when user starts typing
    if (errors.submit) {
      setErrors(prev => ({
        ...prev,
        submit: ''
      }));
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    // Open PDF in a new tab without download
    window.open('/DREAMS_Terms_Conditions.pdf', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <WelcomeHeader />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative"
           style={{
             backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.5) 100%), url("back.png")',
             backgroundPosition: 'center',
             backgroundRepeat: 'no-repeat',
             backgroundSize: 'cover',
           }}>
        <div className="max-w-md w-full relative z-10">
          {/* Form Container */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">

              <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}>Create Account</h2>
              <p className="text-gray-600" style={{fontFamily: 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}>Join UNITY Nest today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{fontFamily: 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}>
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                    style={{fontFamily: 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{fontFamily: 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                    style={{fontFamily: 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{fontFamily: 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}>
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+91 9876543210"
                    style={{fontFamily: 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{fontFamily: 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create a password"
                    style={{fontFamily: 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{fontFamily: 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}>
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                    style={{fontFamily: 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Captcha Field */}
              <Captcha onValidationChange={setCaptchaValid} />
              {errors.captcha && (
                <p className="mt-1 text-sm text-red-600">{errors.captcha}</p>
              )}

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label className="text-sm text-gray-700" style={{fontFamily: 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}>
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={handleTermsClick}
                      className="text-blue-600 hover:text-blue-700 underline font-medium"
                      style={{fontFamily: 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}
                    >
                      Terms and Conditions
                    </button>
                    {' '}of UNITY Nest
                  </label>
                  {errors.acceptTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 shadow-lg"
                style={{fontFamily: 'Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  'Create Account'
                )}
              </button>
              
              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center shadow-sm">
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.submit}
                  </div>
                </div>
              )}
            </form>

            {/* Links */}
            <div className="mt-6 text-center">
              <div className="text-gray-600" style={{fontFamily: 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif'}}>
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
