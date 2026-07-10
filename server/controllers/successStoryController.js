const asyncHandler = require('express-async-handler');
const SuccessStory = require('../models/SuccessStory');
const ApiResponse = require('../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const getSuccessStories = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { category, featured } = req.query;

  const filter = { status: 'published' };
  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;

  const [stories, total] = await Promise.all([
    SuccessStory.find(filter).populate('relatedProject', 'title').skip(skip).limit(limit).sort({ createdAt: -1 }),
    SuccessStory.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, stories, getPaginationMeta(total, page, limit));
});

const getSuccessStory = asyncHandler(async (req, res) => {
  const story = await SuccessStory.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
    status: 'published',
  }).populate('relatedProject', 'title');

  if (!story) return ApiResponse.notFound(res, 'Success story not found');
  return ApiResponse.success(res, { story });
});

const adminGetSuccessStories = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { category, status } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;

  const [stories, total] = await Promise.all([
    SuccessStory.find(filter).populate('createdBy', 'name').skip(skip).limit(limit).sort({ createdAt: -1 }),
    SuccessStory.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, stories, getPaginationMeta(total, page, limit));
});

const createSuccessStory = asyncHandler(async (req, res) => {
  const data = { ...req.body, createdBy: req.user._id };
  if (req.file) data.image = `/uploads/images/${req.file.filename}`;
  const story = await SuccessStory.create(data);
  return ApiResponse.created(res, { story }, 'Success story created');
});

const updateSuccessStory = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (req.file) updates.image = `/uploads/images/${req.file.filename}`;

  const story = await SuccessStory.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!story) return ApiResponse.notFound(res, 'Success story not found');
  return ApiResponse.success(res, { story }, 'Success story updated');
});

const deleteSuccessStory = asyncHandler(async (req, res) => {
  const story = await SuccessStory.findByIdAndDelete(req.params.id);
  if (!story) return ApiResponse.notFound(res, 'Success story not found');
  return ApiResponse.success(res, {}, 'Success story deleted');
});

module.exports = { getSuccessStories, getSuccessStory, adminGetSuccessStories, createSuccessStory, updateSuccessStory, deleteSuccessStory };
