const express = require("express");
const router = express.Router();
const {
  createExpense,
  getExpenseByServiceId,
  updateExpenseStatus,
} = require("./expense-controller");
router.post("/create-expenses", createExpense);
router.get("/service/:serviceId", getExpenseByServiceId);
router.post("/update-by-Id/:id", updateExpenseStatus);

module.exports = router;
