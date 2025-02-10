const mongoose = require("mongoose");

const Status = {
  REQUESTED: "Requested",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PAID: "Paid",
};
const ExpenseSchema = new mongoose.Schema(
  {
    serviceRequestId: {
      type: mongoose.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
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
  },
  {
    timestamps: true,
  }
);

const ExpenseModel = mongoose.model("Expenses", ExpenseSchema);

module.exports = { ExpenseModel, Status };
