const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema(
  {
    serviceRequestId: {
      type: mongoose.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },
    items: [
      {
        quantity: { type: Number, required: true },
        itemName: { type: String, required: true },
        unit: { type: String, required: true },
        rate: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const QuotationModel = mongoose.model("Quotation", QuotationSchema);

module.exports = QuotationModel;
