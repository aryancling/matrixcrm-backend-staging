const mongoose = require("mongoose");

const BankUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    user_type: { type: string, required: true },
    reporting_to: { type: string, required: true },
  },
  {
    timestamps: true,
  }
);

const BankUserModal = mongoose.model("BankUser", BankUserSchema);
module.exports = { BankUserModal };
