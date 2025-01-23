const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema(
  {
    serviceRequestId: {
      type: mongoose.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },
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
      },
    ],
  },
  {
    timestamps: true,
  }
);

const QuotationModel = mongoose.model("Quotation", QuotationSchema);

module.exports = QuotationModel;
