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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    desc: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      default: Status.REQUESTED
    },
  },
  {
    timestamps: true,
  }
);

const PaymentModel = mongoose.model("Payments", PaymentSchema);

module.exports = {PaymentModel , Status};
