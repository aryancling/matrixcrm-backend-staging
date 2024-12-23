const express = require("express");
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("./role-controller");
const router = express.Router();

router.post("/create-role", createRole);
router.get("/get-all-role", getAllRoles);
router.post("/get-role-by-id/id", getRoleById);
router.post("/update", updateRole);
router.post("/delete", deleteRole);

module.exports = router;
