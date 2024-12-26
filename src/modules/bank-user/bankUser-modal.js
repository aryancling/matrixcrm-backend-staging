const mongoose = require("mongoose");

const BankUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    user_type: { type: String, required: true },
    profileImage: { type: String, required: true },
    reporting_to: { type: mongoose.Types.ObjectId, ref: "Bankuser", required: false },
    bankId: { type: mongoose.Types.ObjectId, ref: "Bank" },
  },
  {
    timestamps: true,
  }
);

const BankUserModal = mongoose.model("BankUser", BankUserSchema);
module.exports = { BankUserModal };
