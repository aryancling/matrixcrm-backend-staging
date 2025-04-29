const mongoose = require("mongoose");

const Status = {
  REQUESTED: "Requested",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PAID: "Paid",
};
const ExpenseSchema = new mongoose.Schema(
  {
    servicePartnerId: {
      type: mongoose.Types.ObjectId,
      ref: "ServicePartner",
    },
    serviceRequestId: {
      type: mongoose.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    approved_amount: {
      type: Number,
    },
    desc: {
      type: String,
      required: true,
    },
    expenseStatus: {
      type: String,
      required: true,
      default: Status.REQUESTED,
    },
    action_taken_by: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const ExpenseModel = mongoose.model("Expenses", ExpenseSchema);

module.exports = { ExpenseModel, Status };
