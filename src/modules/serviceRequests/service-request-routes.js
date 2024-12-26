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
  getServiceRequestDetails,
  getUnassignedPMServiceRequests,
  getUnassignedSMServiceRequests
} = require("./service-request-controller");

router.post("/create-Request", createRequest);
router.get("/get-all-request", getAllRequests);
router.get("/get-request-by-Id/:id", getRequestById);
router.post("/assign-pm/:id", assignPm);
router.post("/assign-sm/:id", assignSm);
router.get("/get-service-details/:serviceRequestId", getServiceRequestDetails);
router.post("/quotation/:id", addOrUpdateQuotationForRequest);
router.post("/after-images/:id", addAfterImagesForRequest);
router.post("/uploadImage", uploadImage);
router.get("/get-unassigned-pm", getUnassignedPMServiceRequests);
router.post("/get-unassigned-sm", getUnassignedSMServiceRequests);

module.exports = router;
