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
    const data = { ...req.body, user_id: userId };
    const profile = await Profile.create(data);
    res.status(201).json(profile);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log('Updating profile for user:', userId);
    console.log('Update data:', req.body);
    
    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile) {
      console.log('Profile not found, creating new one');
      const newProfile = await Profile.create({ 
        user_id: userId,
        ...req.body
      });
      return res.json(newProfile);
    }
    
    console.log('Found existing profile, updating...');
    Object.assign(profile, req.body);
    await profile.save();
    console.log('Profile updated successfully');
    res.json(profile);
  } catch (err) { 
    console.error('Error updating profile:', err);
    next(err); 
  }
}; 