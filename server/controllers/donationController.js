const asyncHandler = require('express-async-handler');
const Donation = require('../models/Donation');
const ApiResponse = require('../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const createDonation = asyncHandler(async (req, res) => {
  const donationData = {
    ...req.body,
    ipAddress: req.ip,
    status: 'completed', // Dummy payment — mark as completed
  };

  const donation = await Donation.create(donationData);
  return ApiResponse.created(res, { donation }, 'Thank you for your generous donation!');
});

const adminGetDonations = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status, purpose, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (purpose) filter.purpose = purpose;
  if (search) filter.$or = [
    { donorName: { $regex: search, $options: 'i' } },
    { donorEmail: { $regex: search, $options: 'i' } },
    { transactionId: { $regex: search, $options: 'i' } },
  ];

  const [donations, total] = await Promise.all([
    Donation.find(filter).populate('project', 'title').skip(skip).limit(limit).sort({ createdAt: -1 }),
    Donation.countDocuments(filter),
  ]);

  // Calculate total donated amount
  const totalAmount = await Donation.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  return ApiResponse.paginated(
    res,
    donations,
    { ...getPaginationMeta(total, page, limit), totalAmount: totalAmount[0]?.total || 0 }
  );
});

const getDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id).populate('project', 'title');
  if (!donation) return ApiResponse.notFound(res, 'Donation not found');
  return ApiResponse.success(res, { donation });
});

const updateDonationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const donation = await Donation.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!donation) return ApiResponse.notFound(res, 'Donation not found');
  return ApiResponse.success(res, { donation }, 'Donation status updated');
});

const getDonationStats = asyncHandler(async (req, res) => {
  const stats = await Donation.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: '$purpose',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalDonors = await Donation.distinct('donorEmail').countDocuments();
  const totalRaised = await Donation.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  return ApiResponse.success(res, {
    byPurpose: stats,
    totalRaised: totalRaised[0]?.total || 0,
    totalDonors,
  });
});

module.exports = { createDonation, adminGetDonations, getDonation, updateDonationStatus, getDonationStats };
