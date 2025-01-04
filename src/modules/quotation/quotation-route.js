const express = require("express");
const router = express.Router();
const QuotationController = require("./quotation-controller");

router.get(
  "/quotations/service/:serviceRequestId",
  QuotationController.getQuotationByServiceId
);

router.put(
  "/quotations/service/:serviceRequestId",
  QuotationController.updateQuotationByServiceId
);

router.post("/create-quotations", QuotationController.createQuotation);
router.get("/quotations", QuotationController.getAllQuotations);
router.get("/get-quotations/:id", QuotationController.getQuotationById);
router.get("/get-tasks/:id", QuotationController.getTasks);
router.post("/update-quotation/:id", QuotationController.updateQuotation);
router.post("/update-items/:quotationId", QuotationController.updateItemDetails);
router.delete("/quotations/:id", QuotationController.deleteQuotation);
module.exports = router;
