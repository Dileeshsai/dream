const { Profile, User } = require('../models');
const { NotFoundError, ValidationError } = require('../middlewares/errorHandler');

exports.getProfile = async (req, res, next) => {
  try {
    let userId = req.user.id;
    if (req.query.user_id && ['admin', 'moderator'].includes(req.user.role)) {
      userId = req.query.user_id;
    }
    let profile = await Profile.findOne({ where: { user_id: userId } });
    
    // If profile doesn't exist, create an empty one
    if (!profile) {
      profile = await Profile.create({ 
        user_id: userId,
        // All other fields will be null/empty by default
      });
    }
    
    res.json(profile);
  } catch (err) { next(err); }
};

exports.createProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const exists = await Profile.findOne({ where: { user_id: userId } });
    if (exists) throw new ValidationError('Profile already exists');
    
    // Handle date of birth validation
    const data = { ...req.body, user_id: userId };
    if (data.dob) {
      const dobDate = new Date(data.dob);
      if (isNaN(dobDate.getTime())) {
        // Invalid date, set to null
        data.dob = null;
      } else {
        // Valid date, format it properly
        data.dob = dobDate.toISOString().split('T')[0];
      }
    }
    
    const profile = await Profile.create(data);
    res.status(201).json(profile);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log('Updating profile for user:', userId);
    console.log('Update data:', req.body);
    
    // Handle date of birth validation
    const updateData = { ...req.body };
    if (updateData.dob) {
      const dobDate = new Date(updateData.dob);
      if (isNaN(dobDate.getTime())) {
        // Invalid date, set to null
        updateData.dob = null;
      } else {
        // Valid date, format it properly
        updateData.dob = dobDate.toISOString().split('T')[0];
      }
    }
    
    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile) {
      console.log('Profile not found, creating new one');
      const newProfile = await Profile.create({ 
        user_id: userId,
        ...updateData
      });
      return res.json(newProfile);
    }
    
    console.log('Found existing profile, updating...');
    Object.assign(profile, updateData);
    await profile.save();
    console.log('Profile updated successfully');
    res.json(profile);
  } catch (err) { 
    console.error('Error updating profile:', err);
    next(err); 
  }
}; 