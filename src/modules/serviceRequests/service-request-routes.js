const express = require("express");
const router = express.Router();
const uploadImage = require('./upload')
const {
  createRequest,
  getAllRequests,
  getRequestById,
  assignPm,
  assignSm,
  addOrUpdateQuotationForRequest,
  addAfterImagesForRequest,
} = require("./service-request-controller");

router.post("/create-Request", createRequest);
router.get("/get-all-request", getAllRequests);
router.get("/get-request-by-Id/:id", getRequestById);
router.put("/assign-pm/:id", assignPm);
router.put("/assign-sm/:id", assignSm);
router.put("/quotation/:id", addOrUpdateQuotationForRequest);
router.put("/after-images/:id", addAfterImagesForRequest);
router.post("/uploadImage", uploadImage);

module.exports = router;
