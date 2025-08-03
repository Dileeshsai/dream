import React, { useState } from 'react';
import { useProfilePhoto } from '../../hooks/useProfilePhoto';
import profilePhotoService from '../../services/profilePhotoService';
import ProfileImage from '../common/ProfileImage';

const ProfilePhotoDebug = () => {
  const { photoUrl, loading, error, refreshPhoto } = useProfilePhoto();
  const [debugInfo, setDebugInfo] = useState(null);
  const [isFixing, setIsFixing] = useState(false);

  const handleFixUrl = async () => {
    setIsFixing(true);
    try {
      const response = await profilePhotoService.fixProfilePhotoUrl();
      setDebugInfo({
        success: response.success,
        message: response.message,
        data: response.data
      });
      // Refresh the photo after fixing
      refreshPhoto();
    } catch (err) {
      setDebugInfo({
        success: false,
        message: err.message,
        data: null
      });
    } finally {
      setIsFixing(false);
    }
  };

  const handleGetPhoto = async () => {
    try {
      const response = await profilePhotoService.getProfilePhoto();
      setDebugInfo({
        success: response.success,
        message: 'Get photo response',
        data: response.data
      });
    } catch (err) {
      setDebugInfo({
        success: false,
        message: err.message,
        data: null
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Profile Photo Debug</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-2">Current State</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
            <p><strong>Photo URL:</strong> {photoUrl ? 'Present' : 'None'}</p>
            {photoUrl && (
              <p className="text-xs break-all bg-gray-100 p-2 rounded">
                {photoUrl}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <ProfileImage
            photoUrl={photoUrl}
            size="xl"
            loading={loading}
            alt="Debug Profile"
            border={true}
            borderColor="border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={handleGetPhoto}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Get Photo
          </button>
          <button
            onClick={handleFixUrl}
            disabled={isFixing}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isFixing ? 'Fixing...' : 'Fix URL'}
          </button>
          <button
            onClick={refreshPhoto}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {debugInfo && (
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Debug Info</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Success:</strong> {debugInfo.success ? 'Yes' : 'No'}</p>
            <p><strong>Message:</strong> {debugInfo.message}</p>
            {debugInfo.data && (
              <div>
                <p><strong>Data:</strong></p>
                <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                  {JSON.stringify(debugInfo.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoDebug; 