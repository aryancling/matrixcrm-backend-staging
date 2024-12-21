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

router.post("/quotations", QuotationController.createQuotation);
router.get("/quotations", QuotationController.getAllQuotations);
router.get("/quotations/:id", QuotationController.getQuotationById);
router.put("/quotations/:id", QuotationController.updateQuotation);
router.delete("/quotations/:id", QuotationController.deleteQuotation);
module.exports = router;
