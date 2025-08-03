const { Profile } = require('../models');
const s3Service = require('../services/s3Service');
const { ValidationError, NotFoundError } = require('../middlewares/errorHandler');

/**
 * Upload a new profile photo
 * @route POST /api/profile-photo/upload
 * @access Private
 */
exports.uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError('No file uploaded');
    }

    const userId = req.user.id;
    const file = req.file;

    // Validate file using S3 service
    const validation = s3Service.validateFile(file);
    if (!validation.valid) {
      throw new ValidationError(validation.message);
    }

    // Get current profile to check if there's an existing photo
    let profile = await Profile.findOne({ where: { user_id: userId } });
    let oldPhotoUrl = null;

    if (profile && profile.photo_url) {
      oldPhotoUrl = profile.photo_url;
    }

    // Upload to S3
    const uploadResult = await s3Service.uploadProfilePhoto(
      file.buffer,
      file.originalname,
      userId,
      file.mimetype
    );

    // Delete old photo if it exists
    if (oldPhotoUrl) {
      try {
        await s3Service.deleteProfilePhoto(oldPhotoUrl);
      } catch (deleteError) {
        console.warn('Failed to delete old photo:', deleteError.message);
        // Don't fail the upload if deletion fails
      }
    }

    // Update profile with new photo URL (S3 key)
    if (profile) {
      profile.photo_url = uploadResult.photoUrl;
      await profile.save();
    } else {
      // Create new profile if it doesn't exist
      profile = await Profile.create({
        user_id: userId,
        photo_url: uploadResult.photoUrl
      });
    }

    // Generate presigned URL for immediate access
    const presignedUrl = await s3Service.generatePresignedUrl(uploadResult.photoUrl, 3600);

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: {
        photoUrl: presignedUrl,
        fileName: uploadResult.fileName,
        profile: profile
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing profile photo
 * @route PUT /api/profile-photo/update
 * @access Private
 */
exports.updateProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError('No file uploaded');
    }

    const userId = req.user.id;
    const file = req.file;

    // Validate file
    const validation = s3Service.validateFile(file);
    if (!validation.valid) {
      throw new ValidationError(validation.message);
    }

    // Get current profile
    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    const oldPhotoUrl = profile.photo_url;

    // Update photo in S3
    const updateResult = await s3Service.updateProfilePhoto(
      file.buffer,
      file.originalname,
      userId,
      file.mimetype,
      oldPhotoUrl
    );

    // Update profile with new photo URL (S3 key)
    profile.photo_url = updateResult.photoUrl;
    await profile.save();

    // Generate presigned URL for immediate access
    const presignedUrl = await s3Service.generatePresignedUrl(updateResult.photoUrl, 3600);

    res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully',
      data: {
        photoUrl: presignedUrl,
        fileName: updateResult.fileName,
        profile: profile
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Delete profile photo
 * @route DELETE /api/profile-photo/delete
 * @access Private
 */
exports.deleteProfilePhoto = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get current profile
    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile || !profile.photo_url) {
      throw new NotFoundError('No profile photo found');
    }

    const photoUrl = profile.photo_url;

    // Delete from S3
    const deleteResult = await s3Service.deleteProfilePhoto(photoUrl);

    // Update profile to remove photo URL
    profile.photo_url = null;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile photo deleted successfully',
      data: {
        profile: profile
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get profile photo URL
 * @route GET /api/profile-photo
 * @access Private
 */
exports.getProfilePhoto = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get profile
    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile || !profile.photo_url) {
      return res.status(200).json({
        success: true,
        data: {
          photoUrl: null,
          hasPhoto: false
        }
      });
    }

    // Generate presigned URL for the stored S3 key
    const presignedUrl = await s3Service.generatePresignedUrl(profile.photo_url, 3600);

    res.status(200).json({
      success: true,
      data: {
        photoUrl: presignedUrl,
        hasPhoto: true,
        profile: profile
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get presigned URL for private photo access (if needed)
 * @route GET /api/profile-photo/presigned
 * @access Private
 */
exports.getPresignedUrl = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { expiresIn = 3600 } = req.query; // Default 1 hour

    // Get profile
    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile || !profile.photo_url) {
      throw new NotFoundError('No profile photo found');
    }

    // Generate presigned URL
    const presignedUrl = await s3Service.generatePresignedUrl(profile.photo_url, parseInt(expiresIn));

    res.status(200).json({
      success: true,
      data: {
        presignedUrl,
        expiresIn: parseInt(expiresIn),
        originalUrl: profile.photo_url
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Fix current user's profile photo URL (if it's stored as presigned URL)
 * @route POST /api/profile-photo/fix
 * @access Private
 */
exports.fixProfilePhotoUrl = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get profile
    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile || !profile.photo_url) {
      return res.status(200).json({
        success: true,
        message: 'No profile photo to fix',
        data: { photoUrl: null, hasPhoto: false }
      });
    }

    const currentUrl = profile.photo_url;
    let fixed = false;

    // Check if it's already a presigned URL
    if (currentUrl.includes('?X-Amz-')) {
      // Extract the S3 key from the presigned URL
      const urlWithoutParams = currentUrl.split('?')[0];
      const urlParts = urlWithoutParams.split('/');
      
      // Find the index after the bucket name
      const bucketIndex = urlParts.findIndex(part => part.includes('s3'));
      let key;
      
      if (bucketIndex !== -1) {
        key = urlParts.slice(bucketIndex + 1).join('/');
      } else {
        // Fallback: try to extract from the end
        key = urlParts.slice(-2).join('/'); // profile-photos/user-16/filename.jpg
      }
      
      // Clean the key - remove any URL encoding
      key = decodeURIComponent(key);
      
      // Verify the key exists in S3
      try {
        // Try to generate a new presigned URL to verify the key is valid
        await s3Service.generatePresignedUrl(key, 3600);
        
        // Update the database with the clean S3 key
        profile.photo_url = key;
        await profile.save();
        
        fixed = true;
      } catch (s3Error) {
        // Remove the invalid URL
        profile.photo_url = null;
        await profile.save();
        
        return res.status(200).json({
          success: true,
          message: 'Invalid photo URL removed',
          data: { photoUrl: null, hasPhoto: false }
        });
      }
    } else if (currentUrl.includes('amazonaws.com/') && !currentUrl.includes('?X-Amz-')) {
      // Direct S3 URL - extract key
      const urlParts = currentUrl.split('.amazonaws.com/');
      const key = urlParts[1];
      
      // Update the database with the S3 key
      profile.photo_url = key;
      await profile.save();
      
      fixed = true;
    }

    // Generate new presigned URL
    const presignedUrl = await s3Service.generatePresignedUrl(profile.photo_url, 3600);

    res.status(200).json({
      success: true,
      message: fixed ? 'Profile photo URL fixed successfully' : 'Profile photo URL is already correct',
      data: {
        photoUrl: presignedUrl,
        hasPhoto: true,
        profile: profile
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Refresh presigned URL for profile photo
 * @route POST /api/profile-photo/refresh-url
 * @access Private
 */
exports.refreshPhotoUrl = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { expiresIn = 3600 } = req.body; // Default 1 hour

    // Get profile
    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile || !profile.photo_url) {
      throw new NotFoundError('No profile photo found');
    }

    // Refresh presigned URL (profile.photo_url contains the S3 key)
    const newPresignedUrl = await s3Service.refreshPresignedUrl(profile.photo_url, parseInt(expiresIn));

    // Note: We don't update the profile with the presigned URL since it expires
    // The profile keeps the S3 key, and we return the fresh presigned URL

    res.status(200).json({
      success: true,
      message: 'Profile photo URL refreshed successfully',
      data: {
        photoUrl: newPresignedUrl,
        expiresIn: parseInt(expiresIn),
        profile: profile
      }
    });

  } catch (error) {
    next(error);
  }
}; 