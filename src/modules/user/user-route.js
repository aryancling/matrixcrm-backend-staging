const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("./user-controller");

router.post("/create-user", createUser);
router.get("/get-all-user", getAllUsers);
router.get("/get-user-by-id/:id", getUserById);
router.post("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);

module.exports = router;
