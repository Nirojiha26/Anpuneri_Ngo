const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    occupation: {
      type: String,
      trim: true,
    },
    skills: [{ type: String, trim: true }],
    availability: {
      type: String,
      enum: ['weekdays', 'weekends', 'both', 'flexible'],
      default: 'flexible',
    },
    hoursPerWeek: {
      type: Number,
      min: 1,
      max: 40,
    },
    interests: [{ type: String }],
    motivation: {
      type: String,
      maxlength: [1000, 'Motivation cannot exceed 1000 characters'],
    },
    experience: {
      type: String,
      maxlength: [1000, 'Experience cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'inactive'],
      default: 'pending',
    },
    joinedDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Volunteer', volunteerSchema);
