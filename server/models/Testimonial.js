const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    designation: {
      type: String,
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      maxlength: [1000, 'Content cannot exceed 1000 characters'],
    },
    avatar: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    category: {
      type: String,
      enum: ['donor', 'volunteer', 'beneficiary', 'partner', 'community'],
      default: 'community',
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'hidden'],
      default: 'draft',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
