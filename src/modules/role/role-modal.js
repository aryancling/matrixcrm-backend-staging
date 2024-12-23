const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: { type: Map, of: Boolean, default: {} },
});

const RoleModel = mongoose.model("Role", RoleSchema);

module.exports ={RoleModel}

