const express = require("express");
const router = express.Router();
const uploadImage = require("./upload");
const {
  createRequest,
  getAllRequests,
  getRequestById,
  assignPm,
  assignSm,
  addOrUpdateQuotationForRequest,
  addAfterImagesForRequest,
  getServiceRequestDetails,
  updateQuotationApprovalStatus,
  getServiceRequestsByClientId,
} = require("./service-request-controller");

router.post("/create-Request", createRequest);
router.get("/get-all-request", getAllRequests);
router.get("/get-request-by-Id/:id", getRequestById);
router.post("/assign-pm/:id", assignPm);
router.post("/assign-sm/:id", assignSm);
router.post("/quotation-status/:id", updateQuotationApprovalStatus);
router.get("/get-service-details/:serviceRequestId", getServiceRequestDetails);
router.post("/quotation/:id", addOrUpdateQuotationForRequest);
router.post("/after-images/:id", addAfterImagesForRequest);
router.get("/get-By-Client-Id/:Id", getServiceRequestsByClientId);
router.post("/uploadImage", uploadImage);

module.exports = router;
