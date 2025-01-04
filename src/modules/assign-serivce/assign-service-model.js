const mongoose = require("mongoose");

// Define the AssignService schema
const AssignServiceSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,   
    },
    items: [{
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
    }],
  },
  {
    timestamps: true,
  }
);

// Create the AssignService model
const AssignServiceModel = mongoose.model("AssignService", AssignServiceSchema);

module.exports = AssignServiceModel;
