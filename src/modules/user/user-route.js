const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserAndBankUserById,
  getUserWithClientIdWithoutAdmin,
  getUsersBasedOnPermissions,
} = require("./user-controller");

router.post("/create-user", createUser);
router.get("/get-all-user", getAllUsers);
router.get("/get-user-by-id/:id", getUserById);
router.post("/update-user/:id", updateUser);
router.post("/get-users-based-on-permissions", getUsersBasedOnPermissions);
router.delete("/delete-user/:id", deleteUser);
router.get("/get-users/:id", getUserAndBankUserById);
router.get(
  "/get-users-with-client-id-without-admin/:id",
  getUserWithClientIdWithoutAdmin
);

module.exports = router;
