const asyncHandler = require('express-async-handler');
const TeamMember = require('../models/TeamMember');
const ApiResponse = require('../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const { deleteFile } = require('../middlewares/upload');

const getTeam = asyncHandler(async (req, res) => {
  const { department } = req.query;
  const filter = { status: 'active' };
  if (department) filter.department = department;

  const team = await TeamMember.find(filter).sort({ sortOrder: 1, createdAt: 1 });
  return ApiResponse.success(res, { team });
});

const adminGetTeam = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { department, status, search } = req.query;

  const filter = {};
  if (department) filter.department = department;
  if (status) filter.status = status;
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { designation: { $regex: search, $options: 'i' } },
  ];

  const [team, total] = await Promise.all([
    TeamMember.find(filter).skip(skip).limit(limit).sort({ sortOrder: 1 }),
    TeamMember.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, team, getPaginationMeta(total, page, limit));
});

const createTeamMember = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.avatar = req.file.path;
  const member = await TeamMember.create(data);
  return ApiResponse.created(res, { member }, 'Team member added successfully');
});

const updateTeamMember = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  let member = await TeamMember.findById(req.params.id);
  if (!member) return ApiResponse.notFound(res, 'Team member not found');

  if (req.file) {
    updates.avatar = req.file.path;
    if (member.avatar) await deleteFile(member.avatar);
  }

  member = await TeamMember.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  return ApiResponse.success(res, { member }, 'Team member updated');
});

const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findByIdAndDelete(req.params.id);
  if (!member) return ApiResponse.notFound(res, 'Team member not found');
  if (member.avatar) await deleteFile(member.avatar);
  return ApiResponse.success(res, {}, 'Team member deleted');
});

module.exports = { getTeam, adminGetTeam, createTeamMember, updateTeamMember, deleteTeamMember };
