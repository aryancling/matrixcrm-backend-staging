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
    record_type: {
      type: String,
      enum: ["inventory_in", "inventory_out"],
    },
    inventory_type: {
      type: String,
      enum: ["Purchase", "Return", "Issued"],
    },
    service_request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
    },
    received_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bill_no: String,
    bill_date: Date,
    person_name: String,
    remarks: String,
  },
  {
    timestamps: true,
  }
);

// Create the Inventory model
const InventoryModel = mongoose.model("Inventory", InventorySchema);

module.exports = InventoryModel;
