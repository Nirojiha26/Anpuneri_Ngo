const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: [true, 'Donor name is required'],
      trim: true,
    },
    donorEmail: {
      type: String,
      required: [true, 'Donor email is required'],
      lowercase: true,
      trim: true,
    },
    donorPhone: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Amount must be at least 1'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    purpose: {
      type: String,
      enum: ['general', 'education', 'emergency', 'scholarship', 'community', 'supplies'],
      default: 'general',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'bank', 'paypal', 'other'],
      default: 'card',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
    },
  },
  { timestamps: true }
);

donationSchema.pre('save', function (next) {
  if (!this.transactionId) {
    this.transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Donation', donationSchema);
