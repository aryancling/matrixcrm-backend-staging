const express = require("express");
const router = express.Router();
const {
  createExpense,
  getExpenseByServiceId,
  updateExpenseStatus,
  getLedger,
  getExpensesByQuery,
} = require("./expense-controller");
router.post("/create-expenses", createExpense);
router.get("/service/:serviceId", getExpenseByServiceId);
router.get("/get-by-query", getExpensesByQuery);
router.post("/update-by-Id/:id", updateExpenseStatus);
router.get("/get-ledger", getLedger);

module.exports = router;
