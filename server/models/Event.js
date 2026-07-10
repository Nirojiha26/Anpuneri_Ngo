const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    category: {
      type: String,
      enum: ['fundraiser', 'awareness', 'workshop', 'community', 'celebration', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    visibility: {
      type: String,
      enum: ['published', 'draft', 'hidden'],
      default: 'draft',
    },
    image: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    venue: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    maxAttendees: {
      type: Number,
      default: 0,
    },
    registeredAttendees: {
      type: Number,
      default: 0,
    },
    isRegistrationOpen: {
      type: Boolean,
      default: true,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    ticketPrice: {
      type: Number,
      default: 0,
    },
    organizer: {
      type: String,
      trim: true,
    },
    tags: [{ type: String, trim: true }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

eventSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
