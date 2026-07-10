const asyncHandler = require('express-async-handler');
const Volunteer = require('../models/Volunteer');
const ApiResponse = require('../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const { sendVolunteerConfirmation } = require('../utils/emailService');

const applyVolunteer = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existing = await Volunteer.findOne({ email });
  if (existing) {
    return ApiResponse.error(res, 'This email is already registered as a volunteer', 400);
  }

  const volunteer = await Volunteer.create(req.body);

  // Send confirmation email (non-blocking)
  sendVolunteerConfirmation(volunteer.name, volunteer.email).catch(() => {});

  return ApiResponse.created(res, { volunteer }, 'Volunteer application submitted successfully!');
});

const adminGetVolunteers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status, availability, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (availability) filter.availability = availability;
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
    { city: { $regex: search, $options: 'i' } },
  ];

  const [volunteers, total] = await Promise.all([
    Volunteer.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Volunteer.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, volunteers, getPaginationMeta(total, page, limit));
});

const getVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);
  if (!volunteer) return ApiResponse.notFound(res, 'Volunteer not found');
  return ApiResponse.success(res, { volunteer });
});

const updateVolunteer = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (updates.status === 'approved' && !updates.joinedDate) {
    updates.joinedDate = new Date();
  }

  const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!volunteer) return ApiResponse.notFound(res, 'Volunteer not found');
  return ApiResponse.success(res, { volunteer }, 'Volunteer updated successfully');
});

const deleteVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
  if (!volunteer) return ApiResponse.notFound(res, 'Volunteer not found');
  return ApiResponse.success(res, {}, 'Volunteer record deleted');
});

module.exports = { applyVolunteer, adminGetVolunteers, getVolunteer, updateVolunteer, deleteVolunteer };
