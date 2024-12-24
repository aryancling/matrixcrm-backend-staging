const express = require("express");
const router = express.Router();
const { createBank, getAllBanks, updateBank, deleteBank ,getBankById} = require("./bank-controller");

router.post("/create-bank", createBank);


router.get("/get-All-bank", getAllBanks);
router.get("/get-bank-by-id/:id", getBankById);


router.post("/update-bank/:id", updateBank);

router.delete("/delete-bank/:id", deleteBank);


module.exports = router;
