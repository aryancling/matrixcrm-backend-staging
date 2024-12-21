const express = require("express");
const router = express.Router();

const {
  createRequest,
  getAllRequests,
  getRequestById,
  assignPm,
  assignSm,
  addOrUpdateQuotationForRequest,
  addAfterImagesForRequest,
} = require("./service-request-controller");

router.post("/createRequest", createRequest);

router.get("/all", getAllRequests);

router.get("/:id", getRequestById);

router.put("/:id/assign-pm", assignPm);

router.put("/:id/assign-sm", assignSm);

router.put("/:id/quotation", addOrUpdateQuotationForRequest);

router.put("/:id/after-images", addAfterImagesForRequest);

module.exports = router;
