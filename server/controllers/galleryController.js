const asyncHandler = require('express-async-handler');
const Gallery = require('../models/Gallery');
const ApiResponse = require('../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const { deleteFile } = require('../middlewares/upload');

const getGallery = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { category, featured } = req.query;

  const filter = { status: 'published' };
  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;

  const [images, total] = await Promise.all([
    Gallery.find(filter).skip(skip).limit(limit).sort({ sortOrder: 1, createdAt: -1 }),
    Gallery.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, images, getPaginationMeta(total, page, limit));
});

const adminGetGallery = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { category, status } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;

  const [images, total] = await Promise.all([
    Gallery.find(filter).populate('uploadedBy', 'name').skip(skip).limit(limit).sort({ createdAt: -1 }),
    Gallery.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, images, getPaginationMeta(total, page, limit));
});

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) return ApiResponse.error(res, 'No image uploaded', 400);

  const data = {
    ...req.body,
    image: req.file.path,
    uploadedBy: req.user._id,
  };

  const image = await Gallery.create(data);
  return ApiResponse.created(res, { image }, 'Image uploaded successfully');
});

const updateImage = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  let image = await Gallery.findById(req.params.id);
  if (!image) return ApiResponse.notFound(res, 'Image not found');

  if (req.file) {
    updates.image = req.file.path;
    if (image.image) await deleteFile(image.image);
  }

  image = await Gallery.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  return ApiResponse.success(res, { image }, 'Image updated successfully');
});

const deleteImage = asyncHandler(async (req, res) => {
  const image = await Gallery.findByIdAndDelete(req.params.id);
  if (!image) return ApiResponse.notFound(res, 'Image not found');
  if (image.image) await deleteFile(image.image);
  return ApiResponse.success(res, {}, 'Image deleted successfully');
});

module.exports = { getGallery, adminGetGallery, uploadImage, updateImage, deleteImage };
