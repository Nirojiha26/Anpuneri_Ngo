const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');
const { upload, uploadLimiter } = require('../middlewares/upload');
const { uploadLimiter: uploadLimit } = require('../middlewares/rateLimiter');

// Controllers
const { adminGetProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { adminGetEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { adminGetNews, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const { adminGetGallery, uploadImage, updateImage, deleteImage } = require('../controllers/galleryController');
const { adminGetVolunteers, getVolunteer, updateVolunteer, deleteVolunteer } = require('../controllers/volunteerController');
const { adminGetDonations, getDonation, updateDonationStatus, getDonationStats } = require('../controllers/donationController');
const { adminGetContacts, getContact, updateContactStatus, deleteContact } = require('../controllers/contactController');
const { adminGetTeam, createTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamController');
const { adminGetTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { adminGetFAQs, createFAQ, updateFAQ, deleteFAQ } = require('../controllers/faqController');
const { adminGetSuccessStories, createSuccessStory, updateSuccessStory, deleteSuccessStory } = require('../controllers/successStoryController');
const { getDashboardStats } = require('../controllers/dashboardController');
const { adminGetSettings, updateSettings, updateSingleSetting } = require('../controllers/settingsController');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('express-async-handler');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin', 'editor'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Projects
router.get('/projects', adminGetProjects);
router.post('/projects', upload.single('image'), createProject);
router.put('/projects/:id', upload.single('image'), updateProject);
router.delete('/projects/:id', authorize('admin'), deleteProject);

// Events
router.get('/events', adminGetEvents);
router.post('/events', upload.single('image'), createEvent);
router.put('/events/:id', upload.single('image'), updateEvent);
router.delete('/events/:id', authorize('admin'), deleteEvent);

// News
router.get('/news', adminGetNews);
router.post('/news', upload.single('image'), createNews);
router.put('/news/:id', upload.single('image'), updateNews);
router.delete('/news/:id', authorize('admin'), deleteNews);

// Gallery
router.get('/gallery', adminGetGallery);
router.post('/gallery', upload.single('image'), uploadImage);
router.put('/gallery/:id', upload.single('image'), updateImage);
router.delete('/gallery/:id', authorize('admin'), deleteImage);

// Volunteers
router.get('/volunteers', adminGetVolunteers);
router.get('/volunteers/:id', getVolunteer);
router.put('/volunteers/:id', updateVolunteer);
router.delete('/volunteers/:id', authorize('admin'), deleteVolunteer);

// Donations
router.get('/donations', adminGetDonations);
router.get('/donations/stats', getDonationStats);
router.get('/donations/:id', getDonation);
router.patch('/donations/:id/status', updateDonationStatus);

// Contacts
router.get('/contacts', adminGetContacts);
router.get('/contacts/:id', getContact);
router.patch('/contacts/:id/status', updateContactStatus);
router.delete('/contacts/:id', authorize('admin'), deleteContact);

// Team
router.get('/team', adminGetTeam);
router.post('/team', upload.single('avatar'), createTeamMember);
router.put('/team/:id', upload.single('avatar'), updateTeamMember);
router.delete('/team/:id', authorize('admin'), deleteTeamMember);

// Testimonials
router.get('/testimonials', adminGetTestimonials);
router.post('/testimonials', upload.single('avatar'), createTestimonial);
router.put('/testimonials/:id', upload.single('avatar'), updateTestimonial);
router.delete('/testimonials/:id', authorize('admin'), deleteTestimonial);

// FAQs
router.get('/faqs', adminGetFAQs);
router.post('/faqs', createFAQ);
router.put('/faqs/:id', updateFAQ);
router.delete('/faqs/:id', authorize('admin'), deleteFAQ);

// Success Stories
router.get('/success-stories', adminGetSuccessStories);
router.post('/success-stories', upload.single('image'), createSuccessStory);
router.put('/success-stories/:id', upload.single('image'), updateSuccessStory);
router.delete('/success-stories/:id', authorize('admin'), deleteSuccessStory);

// Settings
router.get('/settings', adminGetSettings);
router.put('/settings', authorize('admin'), updateSettings);
router.patch('/settings/:key', authorize('admin'), updateSingleSetting);

// Users management (admin only)
router.get('/users', authorize('admin'), asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);
  return ApiResponse.paginated(res, users, getPaginationMeta(total, page, limit));
}));

router.patch('/users/:id/status', authorize('admin'), asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
  if (!user) return ApiResponse.notFound(res, 'User not found');
  return ApiResponse.success(res, { user }, 'User status updated');
}));

router.patch('/users/:id/role', authorize('admin'), asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return ApiResponse.notFound(res, 'User not found');
  return ApiResponse.success(res, { user }, 'User role updated');
}));

module.exports = router;
