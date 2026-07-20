const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, 'Slider image is required'],
    },
    eyebrow: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Slider title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    ctaLabel: {
      type: String,
      trim: true,
      default: 'Donate Now',
    },
    ctaPath: {
      type: String,
      trim: true,
      default: '/donate',
    },
    ctaSecondaryLabel: {
      type: String,
      trim: true,
    },
    ctaSecondaryPath: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Slider', sliderSchema);
