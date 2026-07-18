const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'object', 'array'],
      default: 'string',
    },
    inputType: {
      type: String,
      enum: ['text', 'textarea'],
      default: 'text',
    },
    group: {
      type: String,
      enum: ['general', 'social', 'contact', 'seo', 'stats', 'appearance', 'about_values', 'about_explore', 'about', 'legal'],
      default: 'general',
    },
    label: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
