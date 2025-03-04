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
  getServiceRequestsByServicePartnerId,
  getServiceRequestsByClientId,
  assignToUser,
} = require("./service-request-controller");

router.post("/create-Request", createRequest);
router.get("/get-all-request", getAllRequests);
router.get("/get-request-by-Id/:id", getRequestById);
router.post("/assign-pm/:id", assignPm);
router.post("/assign-sm/:id", assignSm);
router.post("/assign-to-user/:id", assignToUser);
router.post("/quotation-status/:id", updateQuotationApprovalStatus);
router.get("/get-service-details/:serviceRequestId", getServiceRequestDetails);
router.post("/quotation/:id", addOrUpdateQuotationForRequest);
router.post("/after-images/:id", addAfterImagesForRequest);
router.get(
  "/get-by-service-partner-id/:servicePartnerId",
  getServiceRequestsByServicePartnerId
);
router.get("/get-by-client-id/:clientId", getServiceRequestsByClientId);
router.post("/uploadImage", uploadImage);

module.exports = router;
