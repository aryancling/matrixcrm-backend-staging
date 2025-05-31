const express = require("express");
const router = express.Router();
const {
  createPayment,
  getPaymentByServiceId,
  updatePaymentStatus,
  getPaymentsByQuery,
} = require("./payment-controller");
router.post("/create-payments", createPayment);
router.get("/service/:serviceId", getPaymentByServiceId);
router.post("/update-by-Id/:id", updatePaymentStatus);
router.get("/get-by-query", getPaymentsByQuery);

module.exports = router;
