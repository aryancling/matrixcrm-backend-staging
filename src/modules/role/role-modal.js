const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    role_name: { type: String, required: true },
    permissions: [Object],
  },
  {
    timestamps: true,
  }
);

const RoleModal = mongoose.model("Role", RoleSchema);
module.exports = { RoleModal };
