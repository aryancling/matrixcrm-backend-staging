const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    address: { type: String },
  },
  {
    timestamps: true,
  }
);

const ClientModel = mongoose.model("Client", ClientSchema);
module.exports = { ClientModel };
