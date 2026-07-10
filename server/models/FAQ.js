const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      maxlength: [500, 'Question cannot exceed 500 characters'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
    },
    category: {
      type: String,
      enum: ['general', 'donation', 'volunteer', 'projects', 'events', 'other'],
      default: 'general',
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FAQ', faqSchema);
