// Import necessary modules
const mongoose = require('mongoose');

// Define the OTP schema
const  BankUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true  },
    mobile: { type: String ,required: true },
    userType: { type: string,required: true },
    reportingTo: { type: string,required: true },
  },
  {
    timestamps: true,
  }
);

const BankUserModal = mongoose.model('User', BankUserSchema);
module.exports = {  BankUserModal };