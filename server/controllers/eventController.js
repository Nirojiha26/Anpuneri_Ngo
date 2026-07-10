const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const ApiResponse = require('../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const getEvents = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { category, status, search, featured, upcoming } = req.query;

  const filter = { visibility: 'published' };
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (featured === 'true') filter.isFeatured = true;
  if (upcoming === 'true') filter.startDate = { $gte: new Date() };
  if (search) filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
    { venue: { $regex: search, $options: 'i' } },
  ];

  const [events, total] = await Promise.all([
    Event.find(filter).skip(skip).limit(limit).sort({ startDate: 1 }),
    Event.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, events, getPaginationMeta(total, page, limit));
});

const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
    visibility: 'published',
  });
  if (!event) return ApiResponse.notFound(res, 'Event not found');
  return ApiResponse.success(res, { event });
});

const adminGetEvents = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { category, status, visibility, search } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (visibility) filter.visibility = visibility;
  if (search) filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { venue: { $regex: search, $options: 'i' } },
  ];

  const [events, total] = await Promise.all([
    Event.find(filter).populate('createdBy', 'name email').skip(skip).limit(limit).sort({ startDate: -1 }),
    Event.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, events, getPaginationMeta(total, page, limit));
});

const createEvent = asyncHandler(async (req, res) => {
  const data = { ...req.body, createdBy: req.user._id };
  if (req.file) data.image = `/uploads/images/${req.file.filename}`;
  const event = await Event.create(data);
  return ApiResponse.created(res, { event }, 'Event created successfully');
});

const updateEvent = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (req.file) updates.image = `/uploads/images/${req.file.filename}`;

  const event = await Event.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!event) return ApiResponse.notFound(res, 'Event not found');
  return ApiResponse.success(res, { event }, 'Event updated successfully');
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return ApiResponse.notFound(res, 'Event not found');
  return ApiResponse.success(res, {}, 'Event deleted successfully');
});

module.exports = { getEvents, getEvent, adminGetEvents, createEvent, updateEvent, deleteEvent };
