const express = require('express');
const router = express.Router();

const { getProjects, getProject } = require('../controllers/projectController');
const { getEvents, getEvent } = require('../controllers/eventController');
const { registerForEvent } = require('../controllers/eventRegistrationController');
const { getNews, getSingleNews } = require('../controllers/newsController');
const { getGallery } = require('../controllers/galleryController');
const { applyVolunteer } = require('../controllers/volunteerController');
const { createDonation } = require('../controllers/donationController');
const { submitContact } = require('../controllers/contactController');
const { getTeam } = require('../controllers/teamController');
const { getTestimonials } = require('../controllers/testimonialController');
const { getFAQs } = require('../controllers/faqController');
const { getSuccessStories, getSuccessStory } = require('../controllers/successStoryController');
const { getPublicStats } = require('../controllers/dashboardController');
const { getPublicSettings } = require('../controllers/settingsController');
const { contactLimiter } = require('../middlewares/rateLimiter');

// Stats
router.get('/stats', getPublicStats);
router.get('/settings', getPublicSettings);

// Projects
router.get('/projects', getProjects);
router.get('/projects/:id', getProject);

// Events
router.get('/events', getEvents);
router.get('/events/:id', getEvent);
router.post('/events/:eventId/register', registerForEvent);

// News
router.get('/news', getNews);
router.get('/news/:id', getSingleNews);

// Gallery
router.get('/gallery', getGallery);

// Team
router.get('/team', getTeam);

// Testimonials
router.get('/testimonials', getTestimonials);

// FAQs
router.get('/faqs', getFAQs);

// Success Stories
router.get('/success-stories', getSuccessStories);
router.get('/success-stories/:id', getSuccessStory);

// Volunteer Application
router.post('/volunteer', applyVolunteer);

// Donation
router.post('/donate', createDonation);

// Contact
router.post('/contact', contactLimiter, submitContact);

module.exports = router;
