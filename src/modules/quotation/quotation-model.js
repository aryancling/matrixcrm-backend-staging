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
        rcId: {
          type: mongoose.Types.ObjectId,
          ref: "Rc",
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
          default: false,
        },
        completionDate: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const QuotationModel = mongoose.model("Quotation", QuotationSchema);

module.exports = QuotationModel;
