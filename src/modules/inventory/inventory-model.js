const mongoose = require("mongoose");

// Define the Inventory schema
const InventorySchema = new mongoose.Schema(
  {
    servicePartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicePartner",
      required: true,
    },
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    inventory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    qty_in: {
      type: Number,
      required: true,
      min: 0,
    },
    qty_out: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["inventory_in", "inventory_out"],
    },
  },
  {
    timestamps: true,
  }
);

// Create the Inventory model
const InventoryModel = mongoose.model("Inventory", InventorySchema);

module.exports = InventoryModel;
