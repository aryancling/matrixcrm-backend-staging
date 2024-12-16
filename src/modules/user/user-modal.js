const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const UserModal = mongoose.model("User", UserSchema);
module.exports = { UserModal };
