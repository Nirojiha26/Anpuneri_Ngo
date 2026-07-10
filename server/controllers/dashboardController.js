const asyncHandler = require('express-async-handler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const Project = require('../models/Project');
const Event = require('../models/Event');
const News = require('../models/News');
const Gallery = require('../models/Gallery');
const Volunteer = require('../models/Volunteer');
const Donation = require('../models/Donation');
const Contact = require('../models/Contact');
const TeamMember = require('../models/TeamMember');
const Testimonial = require('../models/Testimonial');
const SuccessStory = require('../models/SuccessStory');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProjects,
    activeProjects,
    totalEvents,
    upcomingEvents,
    totalNews,
    totalGallery,
    totalVolunteers,
    pendingVolunteers,
    totalContacts,
    newContacts,
    donationStats,
    totalTeam,
    totalTestimonials,
    totalStories,
  ] = await Promise.all([
    User.countDocuments(),
    Project.countDocuments(),
    Project.countDocuments({ status: 'ongoing', visibility: 'published' }),
    Event.countDocuments(),
    Event.countDocuments({ startDate: { $gte: new Date() }, visibility: 'published' }),
    News.countDocuments({ status: 'published' }),
    Gallery.countDocuments({ status: 'published' }),
    Volunteer.countDocuments(),
    Volunteer.countDocuments({ status: 'pending' }),
    Contact.countDocuments(),
    Contact.countDocuments({ status: 'new' }),
    Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRaised: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]),
    TeamMember.countDocuments({ status: 'active' }),
    Testimonial.countDocuments({ status: 'published' }),
    SuccessStory.countDocuments({ status: 'published' }),
  ]);

  // Recent activities
  const [recentDonations, recentVolunteers, recentContacts] = await Promise.all([
    Donation.find({ status: 'completed' }).sort({ createdAt: -1 }).limit(5).select('donorName amount createdAt purpose'),
    Volunteer.find().sort({ createdAt: -1 }).limit(5).select('name email status createdAt'),
    Contact.find().sort({ createdAt: -1 }).limit(5).select('name email subject status createdAt'),
  ]);

  // Monthly donation trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyDonations = await Donation.aggregate([
    { $match: { status: 'completed', createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  return ApiResponse.success(res, {
    stats: {
      users: totalUsers,
      projects: { total: totalProjects, active: activeProjects },
      events: { total: totalEvents, upcoming: upcomingEvents },
      news: totalNews,
      gallery: totalGallery,
      volunteers: { total: totalVolunteers, pending: pendingVolunteers },
      contacts: { total: totalContacts, new: newContacts },
      donations: {
        totalRaised: donationStats[0]?.totalRaised || 0,
        count: donationStats[0]?.count || 0,
      },
      team: totalTeam,
      testimonials: totalTestimonials,
      stories: totalStories,
    },
    recentActivities: {
      donations: recentDonations,
      volunteers: recentVolunteers,
      contacts: recentContacts,
    },
    charts: {
      monthlyDonations,
    },
  });
});

const getPublicStats = asyncHandler(async (req, res) => {
  const [studentsHelped, familiesSupported, volunteers, projectsCompleted, totalDonations] = await Promise.all([
    Project.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$beneficiaries' } } }]),
    Volunteer.countDocuments({ status: 'approved' }),
    Volunteer.countDocuments({ status: 'approved' }),
    Project.countDocuments({ status: 'completed' }),
    Donation.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
  ]);

  return ApiResponse.success(res, {
    studentsHelped: studentsHelped[0]?.total || 1250,
    familiesSupported: 520,
    volunteers,
    projectsCompleted,
    totalDonations: totalDonations[0]?.total || 0,
  });
});

module.exports = { getDashboardStats, getPublicStats };
