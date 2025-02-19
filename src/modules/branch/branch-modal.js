const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String },
    client_address: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BranchModal = mongoose.model("Branch", BranchSchema);
module.exports = { BranchModal };
