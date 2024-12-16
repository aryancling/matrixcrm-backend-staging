// Import necessary modules
const mongoose = require('mongoose');

// Define the OTP schema
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true  },
    mobile: { type: String ,required: true },
    role: { type: String,required: true },
  },
  {
    timestamps: true,
  }
);

const UserModal = mongoose.model('User', UserSchema);
module.exports = { UserModal };