const express = require("express");
const {
  createRc,
  getAllRcs,
  getRcById,
  updateRc,
  deleteRc,
} = require("./rc-controller");
const router = express.Router();

router.post("/create", createRc);
router.post("/get-all", getAllRcs);
router.post("/get-by-id", getRcById);
router.post("/update", updateRc);
router.post("/delete", deleteRc);

module.exports = router;
