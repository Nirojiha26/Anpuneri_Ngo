const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
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
      enum: ['education', 'health', 'community', 'emergency', 'scholarship', 'supplies', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['planning', 'ongoing', 'completed', 'archived'],
      default: 'ongoing',
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
    gallery: [{ type: String }],
    targetAmount: {
      type: Number,
      default: 0,
    },
    raisedAmount: {
      type: Number,
      default: 0,
    },
    beneficiaries: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    location: {
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

projectSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
