const mongoose = require("mongoose");

const RcSchema = new mongoose.Schema(
  {
    rc_number: { type: String, required: true, unique: true },
    inventory_id: {
      type: mongoose.Types.ObjectId,
      ref: "Item",
    },
    finished_goods: { type: String },
    rate: { type: Number, required: true },
    unit: { type: String, required: true },
    bankId: { type: mongoose.Types.ObjectId, ref: "Bank" },
    clientId: { type: mongoose.Types.ObjectId, ref: "Client" },
  },
  {
    timestamps: true,
  }
);

const RcModal = mongoose.model("Rc", RcSchema);
module.exports = { RcModal };
