const express = require("express");
const {
  createRc,
  getAllRcs,
  getRcById,
  updateRc,
  deleteRc,
} = require("./rc-controller");
const router = express.Router();

router.post("/create-rc", createRc);
router.get("/get-all-rc", getAllRcs);
router.get("/get-rc-by-id/:id", getRcById);
router.post("/update-rc/:id", updateRc);
router.delete("/delete-rc/:id", deleteRc);

module.exports = router;
