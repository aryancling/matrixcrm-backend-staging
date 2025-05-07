const mongoose = require("mongoose");

const InventoryRequestSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    serviceRequestId: {
      type: mongoose.Types.ObjectId,
      ref: "ServiceRequest",
    },
    servicePartnerId: {
      type: mongoose.Types.ObjectId,
      ref: "ServicePartner",
    },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        itemName: { type: String },
        rate: { type: Number },
        qty: { type: Number },
        category: { type: String },
        unit: { type: String },
      },
    ],
    status: {
      type: String,
      required: true,
      default: "Pending",
      enum: ["Pending", "Fulfilled", "Rejected"],
    },
  },
  {
    timestamps: true,
  }
);

const InventoryRequestModal = mongoose.model(
  "InventoryRequest",
  InventoryRequestSchema
);
module.exports = { InventoryRequestModal };
