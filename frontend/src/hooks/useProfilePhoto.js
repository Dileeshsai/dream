import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import profilePhotoService from '../services/profilePhotoService';

export const useProfilePhoto = () => {
  const { user } = useAuth();
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load profile photo on mount
  useEffect(() => {
    if (user) {
      loadProfilePhoto();
    }
  }, [user]);

  const loadProfilePhoto = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await profilePhotoService.getProfilePhoto();
      if (response.success && response.data.hasPhoto) {
        setPhotoUrl(response.data.photoUrl);
      } else {
        setPhotoUrl(null);
      }
    } catch (err) {
      console.error('Error loading profile photo:', err);
      
      // Try to fix the URL if there's an error
      try {
        console.log('Attempting to fix profile photo URL...');
        const fixResponse = await profilePhotoService.fixProfilePhotoUrl();
        if (fixResponse.success && fixResponse.data.hasPhoto) {
          setPhotoUrl(fixResponse.data.photoUrl);
          console.log('Profile photo URL fixed successfully');
        } else {
          setPhotoUrl(null);
        }
      } catch (fixErr) {
        console.error('Failed to fix profile photo URL:', fixErr);
        setError('Failed to load profile photo');
        setPhotoUrl(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file, onProgress) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);

    try {
      const response = await profilePhotoService.uploadProfilePhoto(file, onProgress);
      if (response.success) {
        setPhotoUrl(response.data.photoUrl);
        return response;
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError(err.message || 'Failed to upload photo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePhoto = async (file, onProgress) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);

    try {
      const response = await profilePhotoService.updateProfilePhoto(file, onProgress);
      if (response.success) {
        setPhotoUrl(response.data.photoUrl);
        return response;
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (err) {
      console.error('Error updating photo:', err);
      setError(err.message || 'Failed to update photo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async () => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);

    try {
      const response = await profilePhotoService.deleteProfilePhoto();
      if (response.success) {
        setPhotoUrl(null);
        return response;
      } else {
        throw new Error(response.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError(err.message || 'Failed to delete photo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshPhoto = () => {
    loadProfilePhoto();
  };

  return {
    photoUrl,
    loading,
    error,
    uploadPhoto,
    updatePhoto,
    deletePhoto,
    refreshPhoto,
    loadProfilePhoto
  };
}; 