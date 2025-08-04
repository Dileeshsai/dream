
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/apiService';
import profilePhotoService from '../services/profilePhotoService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState({
    url: null,
    loading: false,
    error: null,
    lastLoaded: null
  });

  // Load profile photo
  const loadProfilePhoto = useCallback(async (forceRefresh = false) => {
    if (!user) return;

    // Check if we should skip loading (not forced and recently loaded)
    if (!forceRefresh && profilePhoto.lastLoaded) {
      const timeSinceLastLoad = Date.now() - profilePhoto.lastLoaded;
      if (timeSinceLastLoad < 5 * 60 * 1000) { // 5 minutes
        return;
      }
    }

    try {
      setProfilePhoto(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await profilePhotoService.getProfilePhoto();
      
      if (response.success) {
        setProfilePhoto({
          url: response.data.photoUrl || null,
          loading: false,
          error: null,
          lastLoaded: Date.now()
        });
      } else {
        setProfilePhoto({
          url: null,
          loading: false,
          error: response.message || 'Failed to load profile photo',
          lastLoaded: null
        });
      }
    } catch (error) {
      console.error('Error loading profile photo:', error);
      setProfilePhoto({
        url: null,
        loading: false,
        error: error.message || 'Failed to load profile photo',
        lastLoaded: null
      });
    }
  }, [user]);

  // Update profile photo URL
  const updateProfilePhoto = useCallback((newUrl) => {
    setProfilePhoto({
      url: newUrl,
      loading: false,
      error: null,
      lastLoaded: Date.now()
    });
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('AuthContext: Checking token:', token ? 'Token exists' : 'No token found');
        if (token) {
          console.log('AuthContext: Making /auth/me request with token');
          const response = await api.get('/auth/me');
          console.log('AuthContext: /auth/me response:', response.data);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Monitor user state changes
  useEffect(() => {
    console.log('AuthContext: User state changed:', user ? { id: user.id, role: user.role } : null);
  }, [user]);

  // Don't automatically load profile photo when user changes
  // Profile photo will be loaded explicitly when needed (e.g., on dashboard)

  const login = async (credentials) => {
    try {
      console.log('AuthContext: Attempting login with credentials:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('AuthContext: Login response:', response.data);
      const { token, user: userData } = response.data;
      
      console.log('AuthContext: Storing token in localStorage');
      localStorage.setItem('token', token);
      console.log('AuthContext: Token stored, setting user:', userData);
      setUser(userData);
      console.log('AuthContext: User state updated, should trigger re-render');
      
      // Reset profile photo state after login
      setProfilePhoto({ url: null, loading: false, error: null, lastLoaded: null });
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user: newUser } = response.data;
      
      localStorage.setItem('token', token);
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfilePhoto({ url: null, loading: false, error: null, lastLoaded: null });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    profilePhoto,
    loadProfilePhoto,
    updateProfilePhoto
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
