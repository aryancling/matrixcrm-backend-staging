const express = require("express");
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("./role-controller");
const router = express.Router();

router.post("/create", createRole);
router.post("/get-all", getAllRoles);
router.post("/get-by-id", getRoleById);
router.post("/update", updateRole);
router.post("/delete", deleteRole);

module.exports = router;
