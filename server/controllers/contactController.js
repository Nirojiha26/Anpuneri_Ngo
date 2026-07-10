const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');
const ApiResponse = require('../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const { sendContactConfirmation } = require('../utils/emailService');

const submitContact = asyncHandler(async (req, res) => {
  const contactData = {
    ...req.body,
    ipAddress: req.ip,
  };

  const contact = await Contact.create(contactData);

  // Send confirmation email (non-blocking)
  sendContactConfirmation(contact.name, contact.email).catch(() => {});

  return ApiResponse.created(res, { contact: { id: contact._id } }, 'Message sent successfully! We will get back to you soon.');
});

const adminGetContacts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status, category, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
    { subject: { $regex: search, $options: 'i' } },
  ];

  const [contacts, total] = await Promise.all([
    Contact.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Contact.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, contacts, getPaginationMeta(total, page, limit));
});

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return ApiResponse.notFound(res, 'Contact message not found');

  if (contact.status === 'new') {
    contact.status = 'read';
    await contact.save({ validateBeforeSave: false });
  }

  return ApiResponse.success(res, { contact });
});

const updateContactStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const updates = { status };
  if (adminNotes) updates.adminNotes = adminNotes;
  if (status === 'replied') updates.repliedAt = new Date();

  const contact = await Contact.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!contact) return ApiResponse.notFound(res, 'Contact message not found');
  return ApiResponse.success(res, { contact }, 'Contact updated successfully');
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return ApiResponse.notFound(res, 'Contact message not found');
  return ApiResponse.success(res, {}, 'Contact message deleted');
});

module.exports = { submitContact, adminGetContacts, getContact, updateContactStatus, deleteContact };
