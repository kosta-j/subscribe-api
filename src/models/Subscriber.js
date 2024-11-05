const mongoose = require('mongoose');
const crypto = require('crypto');

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    unsubscribeToken: {
      type: String,
      required: true,
      default: () => crypto.randomBytes(20).toString('hex'),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscriber', subscriberSchema);
