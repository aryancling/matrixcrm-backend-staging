const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true , unique: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    profileImage: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const UserModal = mongoose.model("User", UserSchema);
module.exports = { UserModal };