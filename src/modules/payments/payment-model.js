const mongoose = require("mongoose");

const Status = {
  REQUESTED: "Requested",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PAID: "Paid",
};
const PaymentSchema = new mongoose.Schema(
  {
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
    paymentStatus: {
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

const PaymentModel = mongoose.model("Payments", PaymentSchema);

module.exports = { PaymentModel, Status };
