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
      },
    ],
  },
  {
    timestamps: true,
  }
);

const InventoryRequestModal = mongoose.model(
  "InventoryRequestSchema",
  InventoryRequestSchema
);
module.exports = { InventoryRequestModal };
