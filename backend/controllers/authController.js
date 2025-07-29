const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendOTP, verifyOTP, resendOTP } = require('../utils/otpService');
const { ValidationError, NotFoundError } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

exports.register = async (req, res, next) => {
  try {
    const { full_name, email, phone, password } = req.body;
    if (!full_name || !email || !phone || !password) {
      throw new ValidationError('All fields are required');
    }
    // Check if user already exists
    const existing = await User.findOne({ where: { [Op.or]: [{ email }, { phone }] } });
    if (existing) {
      throw new ValidationError('Email or phone already registered');
    }
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    // Create user with is_verified = false initially
    const user = await User.create({ 
      full_name, 
      email, 
      phone, 
      password_hash,
      is_verified: false 
    });

    // Send OTP to email
    const otpResult = await sendOTP(email);
    res.status(201).json({ 
      message: 'Registration successful. OTP sent to email.', 
      user_id: user.id,
      expiresIn: otpResult.expiresIn
    });
  } catch (err) { 
    next(err); 
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) throw new NotFoundError('User not found');
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new ValidationError('Invalid credentials');
    if (!user.is_verified) throw new ValidationError('User not verified');
    const token = jwt.sign({ user_id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new ValidationError('Email and OTP are required');
    }
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    // Verify OTP
    const verifyResult = await verifyOTP(email, otp);
    if (verifyResult.success) {
      // Mark user as verified
      user.is_verified = true;
      await user.save();
      res.json({ 
        message: 'User verified successfully',
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } else {
      throw new ValidationError(verifyResult.message);
    }
  } catch (err) { 
    next(err); 
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ValidationError('Email is required');
    }
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    // Check if user is already verified
    if (user.is_verified) {
      throw new ValidationError('User is already verified');
    }
    // Resend OTP
    const otpResult = await resendOTP(email);
    res.json({ 
      message: 'OTP resent successfully',
      expiresIn: otpResult.expiresIn
    });
  } catch (err) { 
    next(err); 
  }
};

exports.getTokenInfo = async (req, res, next) => {
  try {
    res.json({
      user: req.user,
      is_impersonated: req.user.is_impersonated || false,
      impersonated_by: req.user.impersonated_by || null,
      impersonated_at: req.user.impersonated_at || null
    });
  } catch (err) { next(err); }
}; 