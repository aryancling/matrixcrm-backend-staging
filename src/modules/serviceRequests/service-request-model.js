// Import necessary modules
const mongoose = require("mongoose");

require("dotenv").config();

const Status = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  REVISE: "REVISED",
  UPDATED: "Updated",
  ASSIGNED: "Assigned",
  COMPLETED: 'Completed'
};

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
    quotationApprovalStatus: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
    },
    quotationUpdatedAt: { type: Date },
    taskCompletionStatus: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
    },
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
