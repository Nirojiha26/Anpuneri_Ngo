const asyncHandler = require('express-async-handler');
const Testimonial = require('../models/Testimonial');
const ApiResponse = require('../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const { deleteFile } = require('../middlewares/upload');

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
  if (req.file) data.avatar = req.file.path;
  const testimonial = await Testimonial.create(data);
  return ApiResponse.created(res, { testimonial }, 'Testimonial created');
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  let testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return ApiResponse.notFound(res, 'Testimonial not found');

  if (req.file) {
    updates.avatar = req.file.path;
    if (testimonial.avatar) await deleteFile(testimonial.avatar);
  }

  testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  return ApiResponse.success(res, { testimonial }, 'Testimonial updated');
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) return ApiResponse.notFound(res, 'Testimonial not found');
  if (testimonial.avatar) await deleteFile(testimonial.avatar);
  return ApiResponse.success(res, {}, 'Testimonial deleted');
});

const submitPublicTestimonial = asyncHandler(async (req, res) => {
  const data = {
    ...req.body,
    status: 'draft', // Always draft when submitted by public
    rating: req.body.rating || 5, // Default 5 stars
  };
  
  if (req.file) data.avatar = req.file.path;
  
  const testimonial = await Testimonial.create(data);
  return ApiResponse.created(res, { testimonial }, 'Thank you! Your review has been submitted and is pending approval.');
});

module.exports = { getTestimonials, adminGetTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, submitPublicTestimonial };
