// Import necessary modules
const mongoose = require("mongoose");

require("dotenv").config();

// Define the OTP schema
const Status = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  REVISE: "REVISED",
  UPDATED: "Updated",
  ASSIGNED: "Assigned",
};

// Define the Service Request schema
const ServiceRequestSchema = new mongoose.Schema(
  {
    bankId: { type: mongoose.Types.ObjectId},
    title: { type: String, required: true },
    description: { type: String, required: true },
    serviceType: { type: String, required: true },
    beforeImages: { type: [String] },
    afterImages: { type: [String] },
    pmAssigned: { type: mongoose.Types.ObjectId, ref: "User" },
    pmAssignedStatus: { type: String, default: Status.PENDING },
    smAssigned: { type: mongoose.Types.ObjectId, ref: "User" },
    smAssignedStatus: { type: String, default: Status.PENDING },
    quotation: {
      type: mongoose.Types.ObjectId,
      ref: "Quotation",
    },
    quotationCreatedStatus: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
    },
    quotationUpdatedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
const ServiceRequestModal = mongoose.model(
  "ServiceRequest",
  ServiceRequestSchema
);

module.exports = { ServiceRequestModal, Status };
