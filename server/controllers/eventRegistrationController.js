const asyncHandler = require('express-async-handler');
const EventRegistration = require('../models/EventRegistration');
const Event = require('../models/Event');
const ApiResponse = require('../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const registerForEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  
  const event = await Event.findById(eventId);
  if (!event) return ApiResponse.notFound(res, 'Event not found');
  if (!event.isRegistrationOpen) return ApiResponse.badRequest(res, 'Registration is closed for this event');
  
  const { name, email, phone, tickets } = req.body;
  const numTickets = tickets ? Number(tickets) : 1;

  if (event.maxAttendees > 0 && event.registeredAttendees + numTickets > event.maxAttendees) {
    return ApiResponse.badRequest(res, 'Not enough tickets available');
  }

  const registration = await EventRegistration.create({
    event: eventId,
    name,
    email,
    phone,
    tickets: numTickets,
  });

  // Increment registered attendees
  event.registeredAttendees += numTickets;
  await event.save();

  return ApiResponse.created(res, { registration }, 'Successfully registered for the event');
});

const adminGetRegistrations = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { eventId, search, status } = req.query;

  const filter = {};
  if (eventId) filter.event = eventId;
  if (status) filter.status = status;
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];

  const [registrations, total] = await Promise.all([
    EventRegistration.find(filter)
      .populate('event', 'title startDate')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    EventRegistration.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, registrations, getPaginationMeta(total, page, limit));
});

module.exports = { registerForEvent, adminGetRegistrations };
