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
    }],
  },
  {
    timestamps: true,
  }
);

// Create the AssignService model
const AssignServiceModel = mongoose.model("AssignService", AssignServiceSchema);

module.exports = AssignServiceModel;
