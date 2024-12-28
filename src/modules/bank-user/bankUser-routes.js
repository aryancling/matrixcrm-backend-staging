const express = require("express");
const router = express.Router();

const {
  createBankUser,
  getAllBankUsers,
  getBankUserById,
  updateBankUser,
  deleteBankUser,
  getBankUserByBankId
} = require("./bankUser-controller");

router.post("/create-bank-user", createBankUser);
router.get("/get-all-bank-user", getAllBankUsers);
router.get("/get-bank-user-by-id/:id", getBankUserById);
router.get("/get-bank-user-by-bankid/:id", getBankUserByBankId);

router.post("/update-bank-user/:id", updateBankUser);
router.delete("/delete-bank-user/:id", deleteBankUser);


module.exports = router;
