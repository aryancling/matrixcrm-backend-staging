const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserAndClientUserById,
  getUserWithServicePartnerIdWithoutAdmin,
  getUsersBasedOnPermissions,
} = require("./user-controller");

router.post("/create-user", createUser);
router.get("/get-all-user", getAllUsers);
router.get("/get-user-by-id/:id", getUserById);
router.post("/update-user/:id", updateUser);
router.post("/get-users-based-on-permissions", getUsersBasedOnPermissions);
router.delete("/delete-user/:id", deleteUser);
router.get("/get-users/:id", getUserAndClientUserById);
router.get(
  "/get-users-with-service-partner-id-without-admin/:id",
  getUserWithServicePartnerIdWithoutAdmin
);

module.exports = router;
