const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: { type: Array, of: String, default: [] },
});

const RoleModel = mongoose.model("Role", RoleSchema);

module.exports = { RoleModel };
