
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiPost } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get user from localStorage on initial load
    const savedUser = localStorage.getItem('dreamSocietyUser');
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    
    // If user exists but doesn't have phone field, we'll need to refresh the data
    if (parsedUser && !parsedUser.phone) {
      console.log('User data missing phone field, will refresh on next login');
    }
    
    return parsedUser;
  });
  const [loading, setLoading] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState(() => {
    // Try to get pending registration from localStorage
    const saved = localStorage.getItem('pendingRegistration');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiPost('/auth/login', { email, password });
      const data = response.data;

      if (!data.token || !data.user) {
        setLoading(false);
        throw new Error(data.message || 'Invalid email or password');
      }

      const loggedInUser = {
        id: data.user.id,
        name: data.user.full_name,
        email: data.user.email,
        phone: data.user.phone,
        role: data.user.role,
        token: data.token,
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        membershipType: 'premium',
        profileComplete: 85,
      };

      setUser(loggedInUser);
      localStorage.setItem('dreamSocietyUser', JSON.stringify(loggedInUser));
      localStorage.setItem('token', data.token); // Store JWT for API use
      setLoading(false);
      return loggedInUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      console.log('AuthContext: Starting registration process');
      console.log('AuthContext: User data:', userData);
      
      // Call the backend registration endpoint
      const response = await apiPost('/auth/register', userData);
      console.log('AuthContext: Backend registration response:', response.data);
      
      // Store registration data temporarily for OTP verification
      const registrationData = {
        ...userData,
        userId: response.data.user_id,
        expiresIn: response.data.expiresIn,
        timestamp: new Date().toISOString()
      };
      
      setPendingRegistration(registrationData);
      localStorage.setItem('pendingRegistration', JSON.stringify(registrationData));
      
      setLoading(false);
      console.log('AuthContext: Registration data stored temporarily');
      return { success: true, data: registrationData };
    } catch (error) {
      setLoading(false);
      console.log('AuthContext: Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    // Clear user from localStorage
    localStorage.removeItem('dreamSocietyUser');
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('dreamSocietyUser', JSON.stringify(updatedUser));
  };

  const clearPendingRegistration = () => {
    setPendingRegistration(null);
    localStorage.removeItem('pendingRegistration');
  };

  const resendOTP = async () => {
    if (!pendingRegistration) {
      throw new Error('No pending registration found');
    }
    
    try {
      const response = await apiPost('/auth/resend-otp', {
        email: pendingRegistration.email
      });
      
      // Update the pending registration with new expiry time
      const updatedRegistration = {
        ...pendingRegistration,
        expiresIn: response.data.expiresIn,
        timestamp: new Date().toISOString()
      };
      
      setPendingRegistration(updatedRegistration);
      localStorage.setItem('pendingRegistration', JSON.stringify(updatedRegistration));
      
      return response.data;
    } catch (error) {
      console.log('AuthContext: Resend OTP error:', error);
      throw error;
    }
  };

    const verifyOTP = async (otp) => {
    setLoading(true);
    try {
      console.log('AuthContext: Verifying OTP');
      
      if (!pendingRegistration) {
        throw new Error('No pending registration found');
      }
      
      // Verify the OTP with the backend using email
      const verifyResponse = await apiPost('/auth/verify-otp', {
        email: pendingRegistration.email,
        otp: otp
      });
      console.log('AuthContext: OTP verified:', verifyResponse.data);
      
      // Now login the user to get the token
      const loginResponse = await apiPost('/auth/login', {
        email: pendingRegistration.email,
        password: pendingRegistration.password
      });
      console.log('AuthContext: User logged in:', loginResponse.data);
      
      // Set the user as logged in
      const loggedInUser = {
        id: loginResponse.data.user.id,
        name: loginResponse.data.user.full_name,
        email: loginResponse.data.user.email,
        phone: loginResponse.data.user.phone,
        role: loginResponse.data.user.role,
        token: loginResponse.data.token,
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        membershipType: 'premium',
        profileComplete: 85,
      };
      
      setUser(loggedInUser);
      localStorage.setItem('dreamSocietyUser', JSON.stringify(loggedInUser));
      localStorage.setItem('token', loginResponse.data.token);
      
      // Clear pending registration
      setPendingRegistration(null);
      localStorage.removeItem('pendingRegistration');
      
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      console.log('AuthContext: OTP verification error:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    verifyOTP,
    resendOTP,
    clearPendingRegistration,
    updateUser,
    loading,
    isAuthenticated: !!user,
    pendingRegistration
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
