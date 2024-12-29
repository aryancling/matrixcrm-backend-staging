const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema(
  {
    serviceRequestId: {
      type: mongoose.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },
    items: [{
      itemId: {
        type: mongoose.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      qty: {
        type: Number,
        required: true,
        min: 0,
      },
      usedQty: {
        type: Number,
      },
      completionStatus: {
        type: Boolean,
        default: false
      },
    }
    ],
  },
  {
    timestamps: true,
  }
);

const QuotationModel = mongoose.model("Quotation", QuotationSchema);

module.exports = QuotationModel;
