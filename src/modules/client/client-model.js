const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    client_name: { type: String, required: true, unique: true },
    client_address: { type: String },
  },
  {
    timestamps: true,
  }
);

const ClientModel = mongoose.model("Client", ClientSchema);
module.exports = { ClientModel };
