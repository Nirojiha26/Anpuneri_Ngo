const asyncHandler = require('express-async-handler');
const Testimonial = require('../models/Testimonial');
const ApiResponse = require('../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const getTestimonials = asyncHandler(async (req, res) => {
  const { category, featured } = req.query;
  const filter = { status: 'published' };
  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;

  const testimonials = await Testimonial.find(filter).sort({ sortOrder: 1, createdAt: -1 });
  return ApiResponse.success(res, { testimonials });
});

const adminGetTestimonials = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status, category } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const [testimonials, total] = await Promise.all([
    Testimonial.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Testimonial.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, testimonials, getPaginationMeta(total, page, limit));
});

const createTestimonial = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.avatar = `/uploads/images/${req.file.filename}`;
  const testimonial = await Testimonial.create(data);
  return ApiResponse.created(res, { testimonial }, 'Testimonial created');
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (req.file) updates.avatar = `/uploads/images/${req.file.filename}`;

  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!testimonial) return ApiResponse.notFound(res, 'Testimonial not found');
  return ApiResponse.success(res, { testimonial }, 'Testimonial updated');
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) return ApiResponse.notFound(res, 'Testimonial not found');
  return ApiResponse.success(res, {}, 'Testimonial deleted');
});

module.exports = { getTestimonials, adminGetTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
