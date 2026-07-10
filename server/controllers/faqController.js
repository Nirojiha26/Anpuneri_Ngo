const asyncHandler = require('express-async-handler');
const FAQ = require('../models/FAQ');
const ApiResponse = require('../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const getFAQs = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { status: 'published' };
  if (category) filter.category = category;

  const faqs = await FAQ.find(filter).sort({ sortOrder: 1, createdAt: 1 });
  return ApiResponse.success(res, { faqs });
});

const adminGetFAQs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status, category } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const [faqs, total] = await Promise.all([
    FAQ.find(filter).skip(skip).limit(limit).sort({ sortOrder: 1 }),
    FAQ.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, faqs, getPaginationMeta(total, page, limit));
});

const createFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.create(req.body);
  return ApiResponse.created(res, { faq }, 'FAQ created');
});

const updateFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!faq) return ApiResponse.notFound(res, 'FAQ not found');
  return ApiResponse.success(res, { faq }, 'FAQ updated');
});

const deleteFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);
  if (!faq) return ApiResponse.notFound(res, 'FAQ not found');
  return ApiResponse.success(res, {}, 'FAQ deleted');
});

module.exports = { getFAQs, adminGetFAQs, createFAQ, updateFAQ, deleteFAQ };
