const asyncHandler = require('express-async-handler');
const News = require('../models/News');
const ApiResponse = require('../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const getNews = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { category, search, featured } = req.query;

  const filter = { status: 'published' };
  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;
  if (search) filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { content: { $regex: search, $options: 'i' } },
  ];

  const [news, total] = await Promise.all([
    News.find(filter).populate('author', 'name avatar').skip(skip).limit(limit).sort({ publishedAt: -1 }),
    News.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, news, getPaginationMeta(total, page, limit));
});

const getSingleNews = asyncHandler(async (req, res) => {
  const news = await News.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
    status: 'published',
  }).populate('author', 'name avatar');

  if (!news) return ApiResponse.notFound(res, 'News not found');

  news.views += 1;
  await news.save({ validateBeforeSave: false });

  return ApiResponse.success(res, { news });
});

const adminGetNews = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { category, status, search } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (search) filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { content: { $regex: search, $options: 'i' } },
  ];

  const [news, total] = await Promise.all([
    News.find(filter).populate('author', 'name email').skip(skip).limit(limit).sort({ createdAt: -1 }),
    News.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, news, getPaginationMeta(total, page, limit));
});

const createNews = asyncHandler(async (req, res) => {
  const data = { ...req.body, author: req.user._id };
  if (req.file) data.image = `/uploads/images/${req.file.filename}`;
  const news = await News.create(data);
  return ApiResponse.created(res, { news }, 'News created successfully');
});

const updateNews = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (req.file) updates.image = `/uploads/images/${req.file.filename}`;

  const news = await News.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!news) return ApiResponse.notFound(res, 'News not found');
  return ApiResponse.success(res, { news }, 'News updated successfully');
});

const deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findByIdAndDelete(req.params.id);
  if (!news) return ApiResponse.notFound(res, 'News not found');
  return ApiResponse.success(res, {}, 'News deleted successfully');
});

module.exports = { getNews, getSingleNews, adminGetNews, createNews, updateNews, deleteNews };
