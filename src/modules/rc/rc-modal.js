const mongoose = require("mongoose");

const RcSchema = new mongoose.Schema(
  {
    rc_number: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const RcModal = mongoose.model("Rc", RcSchema);
module.exports = { RcModal };
