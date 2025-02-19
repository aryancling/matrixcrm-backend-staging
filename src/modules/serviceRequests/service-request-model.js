// Import necessary modules
const mongoose = require("mongoose");

require("dotenv").config();

const Status = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  REVISE: "Revise",
  UPDATED: "Updated",
  ASSIGNED: "Assigned",
  COMPLETED: "Completed",
};

const ServiceRequestSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Types.ObjectId, ref: "Client" },
    servicePartnerId: { type: mongoose.Types.ObjectId, ref: "ServicePartner" },
    title: { type: String, required: true },
    cost_code: { type: String, required: true },
    cost_name: { type: String, required: true },
    description: { type: String, required: true },
    serviceNumber: { type: String, required: true, unique: true },
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
    branch_id: {
      type: mongoose.Types.ObjectId,
      ref: "Branch",
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
