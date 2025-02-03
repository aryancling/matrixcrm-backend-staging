const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema(
  {
    serviceRequestId: {
      type: mongoose.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },
    quotationNumber: { type: String, required: true, unique: true },
    rcs: [
      {
        rc_id: {
          type: mongoose.Types.ObjectId,
          ref: "Rc",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        remarks: {
          type: String,
        },
      },
    ],
    non_rcs: [
      {
        inventory_id: {
          type: mongoose.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        remarks: {
          type: String,
        },
      },
    ],
    total_amount: { type: Number, required: true },
    cgst: { type: Number },
    cgst: { type: Number },
    igst: { type: Number },
  },
  {
    timestamps: true,
  }
);

const QuotationModel = mongoose.model("Quotation", QuotationSchema);

module.exports = QuotationModel;
