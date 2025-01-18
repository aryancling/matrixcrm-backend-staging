const mongoose = require("mongoose");

const BankUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    user_type: { type: String, enum: ["admin", "bankUser"], required: true },
    designation: {
      type: String,
      required: function () {
        return this.user_type === "bankUser";
      },
    },
    profileImage: {
      type: String,
      required: function () {
        return this.user_type === "bankUser";
      },
    },
    reporting_to: {
      type: mongoose.Types.ObjectId,
      ref: "Bankuser",
    },
    bankId: { type: mongoose.Types.ObjectId, ref: "Bank" },
  },
  {
    timestamps: true,
  }
);

const BankUserModal = mongoose.model("BankUser", BankUserSchema);
module.exports = { BankUserModal };
