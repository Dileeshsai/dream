const { User, Profile, EducationDetail, EmploymentDetail } = require('../models');
const { NotFoundError, ValidationError } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id !== Number(id) && !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const user = await User.findByPk(id, { 
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Profile,
          as: 'profile',
          attributes: ['photo_url', 'village', 'mandal', 'district', 'native_place', 'caste', 'subcaste', 'marital_status', 'dob', 'gender']
        },
        {
          model: EducationDetail,
          as: 'educationDetails',
          attributes: ['degree', 'institution', 'year_of_passing', 'grade'],
          order: [['id', 'DESC']]
        },
        {
          model: EmploymentDetail,
          as: 'employmentDetails',
          attributes: ['role', 'company_name', 'years_of_experience', 'currently_working'],
          order: [['id', 'DESC']]
        }
      ]
    });
    if (!user) throw new NotFoundError('User not found');
    res.json(user);
  } catch (err) { next(err); }
};

exports.updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id !== Number(id) && !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const user = await User.findByPk(id);
    if (!user) throw new NotFoundError('User not found');
    const { full_name, email, phone, role } = req.body;
    if (email || phone) {
          // Check for unique email/phone
    const exists = await User.findOne({ where: { [Op.or]: [{ email }, { phone }], id: { [Op.ne]: id } } });
      if (exists) throw new ValidationError('Email or phone already in use');
    }
    if (full_name) user.full_name = full_name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role && ['admin', 'moderator'].includes(req.user.role)) user.role = role;
    await user.save();
    res.json({ message: 'User updated' });
  } catch (err) { next(err); }
};

exports.getAllMembers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, sortBy = 'recent' } = req.query;
    const offset = (page - 1) * limit;
    
    // Build where clause for search
    const where = { role: 'member' };
    if (search) {
      where[User.sequelize.Op.or] = [
        { full_name: { [User.sequelize.Op.like]: `%${search}%` } },
        { email: { [User.sequelize.Op.like]: `%${search}%` } }
      ];
    }

    // Build order clause
    let order = [];
    switch (sortBy) {
      case 'name':
        order = [['full_name', 'ASC']];
        break;
      case 'recent':
        order = [['created_at', 'DESC']];
        break;
      default:
        order = [['created_at', 'DESC']];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Profile,
          as: 'profile',
          attributes: ['photo_url', 'village', 'mandal', 'district', 'native_place', 'caste', 'subcaste']
        },
        {
          model: EducationDetail,
          as: 'educationDetails',
          attributes: ['degree', 'institution', 'year_of_passing', 'grade'],
          limit: 1,
          order: [['id', 'DESC']]
        },
        {
          model: EmploymentDetail,
          as: 'employmentDetails',
          attributes: ['role', 'company_name', 'years_of_experience', 'currently_working'],
          limit: 1,
          order: [['id', 'DESC']]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order
    });

    // Transform data for frontend
    const members = users.map(user => ({
      id: user.id,
      name: user.full_name,
      email: user.email,
      phone: user.phone,
      avatar: user.profile?.photo_url || '/placeholder.svg',
      location: user.profile?.district || user.profile?.mandal || user.profile?.village || 'Location not specified',
      title: user.employmentDetails?.[0]?.role || 'Professional',
      company: user.employmentDetails?.[0]?.company_name || '',
      education: user.educationDetails?.[0]?.degree || '',
      institution: user.educationDetails?.[0]?.institution || '',
      yearOfPassing: user.educationDetails?.[0]?.year_of_passing || '',
      grade: user.educationDetails?.[0]?.grade || '',
      yearsOfExperience: user.employmentDetails?.[0]?.years_of_experience || '',
      currentlyWorking: user.employmentDetails?.[0]?.currently_working || false,
      village: user.profile?.village || '',
      mandal: user.profile?.mandal || '',
      district: user.profile?.district || '',
      native_place: user.profile?.native_place || '',
      caste: user.profile?.caste || '',
      subcaste: user.profile?.subcaste || '',
      mutualConnections: Math.floor(Math.random() * 20) + 1, // Placeholder for now
      joinedDate: user.created_at
    }));

    res.json({
      members,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (err) { 
    next(err); 
  }
}; 