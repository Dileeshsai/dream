import React, { useState } from 'react';
import { User } from 'lucide-react';

const ProfileImage = ({ 
  photoUrl, 
  size = 'md', 
  className = '', 
  alt = 'Profile Image',
  loading = false,
  showFallback = true,
  onClick,
  border = false,
  borderColor = 'border-white'
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Size classes
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
    '3xl': 'w-32 h-32'
  };

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
    '2xl': 'w-12 h-12',
    '3xl': 'w-16 h-16'
  };

  const spinnerSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
    '3xl': 'w-12 h-12'
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const shouldShowImage = photoUrl && !imageError && !loading;
  const shouldShowFallback = (!photoUrl || imageError) && showFallback;

  return (
    <div 
      className={`
        relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center
        ${sizeClasses[size]} 
        ${border ? `border-4 ${borderColor}` : ''}
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className={`${spinnerSizeClasses[size]} border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin`}></div>
        </div>
      )}

      {/* Profile Image */}
      {shouldShowImage && (
        <img
          src={photoUrl}
          alt={alt}
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {/* Fallback Icon */}
      {shouldShowFallback && !loading && (
        <User className={`text-gray-400 ${iconSizeClasses[size]}`} />
      )}

      {/* Image Loading Overlay */}
      {imageLoading && shouldShowImage && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className={`${spinnerSizeClasses[size]} border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin`}></div>
        </div>
      )}
    </div>
  );
};

export default ProfileImage; 