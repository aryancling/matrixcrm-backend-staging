const mongoose = require("mongoose");

const BankSchema = new mongoose.Schema(
  {
    bank_name: { type: String, required: true, unique: true },
    bank_address: { type: String },
  },
  {
    timestamps: true,
  }
);

const BankModel = mongoose.model("Bank", BankSchema);
module.exports = { BankModel };
