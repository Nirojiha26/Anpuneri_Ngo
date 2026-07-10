const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    personName: {
      type: String,
      required: [true, 'Person name is required'],
      trim: true,
    },
    age: {
      type: Number,
    },
    location: {
      type: String,
      trim: true,
    },
    story: {
      type: String,
      required: [true, 'Story is required'],
    },
    excerpt: {
      type: String,
      maxlength: [400, 'Excerpt cannot exceed 400 characters'],
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['education', 'health', 'livelihood', 'community', 'emergency', 'scholarship'],
      default: 'education',
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'draft',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    tags: [{ type: String, trim: true }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

successStorySchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('SuccessStory', successStorySchema);
