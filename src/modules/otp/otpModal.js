// Import necessary modules
const mongoose = require('mongoose');
const otplib = require('otplib');
const twilio = require('twilio');
require('dotenv').config();

// Define the OTP schema
const OtpSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

const OtpModel = mongoose.model('OTP', OtpSchema);
module.exports = { OtpModel };