const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unigue: true },
    mobile: { type: Number, unique: true },
    supplier_code: { type: String, unique: true },
    gst_number: { type: String },
    servicePartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicePartner",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SupplierModal = mongoose.model("Supplier", SupplierSchema);
module.exports = { SupplierModal };
