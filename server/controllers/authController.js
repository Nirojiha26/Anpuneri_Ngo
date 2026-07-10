const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const { generateToken } = require('../middlewares/auth');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return ApiResponse.error(res, 'Email already registered', 400);
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  return ApiResponse.created(res, { user, token }, 'Registration successful');
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return ApiResponse.unauthorized(res, 'Invalid email or password');
  }

  if (!user.isActive) {
    return ApiResponse.unauthorized(res, 'Your account has been deactivated');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return ApiResponse.unauthorized(res, 'Invalid email or password');
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);
  const userObj = user.toJSON();

  return ApiResponse.success(res, { user: userObj, token }, 'Login successful');
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return ApiResponse.success(res, { user }, 'User profile retrieved');
});

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const updates = { name, phone };

  if (req.file) {
    updates.avatar = `/uploads/images/${req.file.filename}`;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return ApiResponse.success(res, { user }, 'Profile updated successfully');
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return ApiResponse.error(res, 'Current password is incorrect', 400);
  }

  user.password = newPassword;
  await user.save();

  const token = generateToken(user._id);
  return ApiResponse.success(res, { token }, 'Password changed successfully');
});

module.exports = { register, login, getMe, updateProfile, changePassword };
