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

    // Update profile with new photo URL
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

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: {
        photoUrl: uploadResult.photoUrl,
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

    // Update profile with new photo URL
    profile.photo_url = updateResult.photoUrl;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully',
      data: {
        photoUrl: updateResult.photoUrl,
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

    res.status(200).json({
      success: true,
      data: {
        photoUrl: profile.photo_url,
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