const express = require("express");
const router = express.Router();
const { createBank, getAllBanks, updateBank, deleteBank } = require("./bank-controller");

router.post("/createBank", createBank);


router.get("/getAllBank", getAllBanks);


router.put("/updateBank/:id", updateBank);

router.delete("/deleteBank/:id", deleteBank);

// ... existing code ...

module.exports = router;
