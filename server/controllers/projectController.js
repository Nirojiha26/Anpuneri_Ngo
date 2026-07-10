const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

// @desc    Get all projects (public)
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { category, status, search, featured } = req.query;

  const filter = { visibility: 'published' };
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (featured === 'true') filter.isFeatured = true;
  if (search) filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
  ];

  const [projects, total] = await Promise.all([
    Project.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Project.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, projects, getPaginationMeta(total, page, limit));
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
    visibility: 'published',
  });
  if (!project) return ApiResponse.notFound(res, 'Project not found');
  return ApiResponse.success(res, { project });
});

// @desc    Get all projects (admin)
// @route   GET /api/admin/projects
// @access  Admin
const adminGetProjects = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { category, status, visibility, search } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (visibility) filter.visibility = visibility;
  if (search) filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
  ];

  const [projects, total] = await Promise.all([
    Project.find(filter).populate('createdBy', 'name email').skip(skip).limit(limit).sort({ createdAt: -1 }),
    Project.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, projects, getPaginationMeta(total, page, limit));
});

// @desc    Create project
// @route   POST /api/admin/projects
// @access  Admin
const createProject = asyncHandler(async (req, res) => {
  const data = { ...req.body, createdBy: req.user._id };
  if (req.file) data.image = `/uploads/images/${req.file.filename}`;
  const project = await Project.create(data);
  return ApiResponse.created(res, { project }, 'Project created successfully');
});

// @desc    Update project
// @route   PUT /api/admin/projects/:id
// @access  Admin
const updateProject = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (req.file) updates.image = `/uploads/images/${req.file.filename}`;

  const project = await Project.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!project) return ApiResponse.notFound(res, 'Project not found');
  return ApiResponse.success(res, { project }, 'Project updated successfully');
});

// @desc    Delete project
// @route   DELETE /api/admin/projects/:id
// @access  Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return ApiResponse.notFound(res, 'Project not found');
  return ApiResponse.success(res, {}, 'Project deleted successfully');
});

module.exports = { getProjects, getProject, adminGetProjects, createProject, updateProject, deleteProject };
