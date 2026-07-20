const asyncHandler = require('express-async-handler');
const Slider = require('../models/Slider');
const ApiResponse = require('../utils/apiResponse');
const fs = require('fs');
const path = require('path');

// @desc    Get all active sliders (public)
// @route   GET /api/sliders
// @access  Public
const getSliders = asyncHandler(async (req, res) => {
  const sliders = await Slider.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 });
  
  return ApiResponse.success(res, { sliders });
});

// @desc    Get all sliders (admin)
// @route   GET /api/admin/sliders
// @access  Admin
const adminGetSliders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, search } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { eyebrow: { $regex: search, $options: 'i' } },
    ];
  }

  const sliders = await Slider.find(filter)
    .populate('createdBy', 'name email')
    .sort({ order: 1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Slider.countDocuments(filter);

  return res.status(200).json({
    success: true,
    message: 'Success',
    data: sliders,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

// @desc    Create slider
// @route   POST /api/admin/sliders
// @access  Admin
const createSlider = asyncHandler(async (req, res) => {
  const data = { ...req.body, createdBy: req.user._id };
  if (req.file) {
    data.image = `/uploads/images/${req.file.filename}`;
  } else {
    return ApiResponse.badRequest(res, 'Slider image is required');
  }
  
  const slider = await Slider.create(data);
  return ApiResponse.created(res, { slider }, 'Slider created successfully');
});

// @desc    Update slider
// @route   PUT /api/admin/sliders/:id
// @access  Admin
const updateSlider = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (req.file) {
    updates.image = `/uploads/images/${req.file.filename}`;
  }

  const slider = await Slider.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  
  if (!slider) return ApiResponse.notFound(res, 'Slider not found');
  return ApiResponse.success(res, { slider }, 'Slider updated successfully');
});

// @desc    Delete slider
// @route   DELETE /api/admin/sliders/:id
// @access  Admin
const deleteSlider = asyncHandler(async (req, res) => {
  const slider = await Slider.findByIdAndDelete(req.params.id);
  if (!slider) return ApiResponse.notFound(res, 'Slider not found');
  
  // Try to remove the file from filesystem
  if (slider.image) {
    const filePath = path.join(__dirname, '..', '..', 'public', slider.image);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error deleting slider image:', err);
      }
    }
  }

  return ApiResponse.success(res, {}, 'Slider deleted successfully');
});

module.exports = { getSliders, adminGetSliders, createSlider, updateSlider, deleteSlider };
