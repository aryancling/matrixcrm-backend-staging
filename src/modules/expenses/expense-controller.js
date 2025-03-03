const { ExpenseModel, Status } = require("./expense-model");

// Create a new expense
async function createExpense(req, res) {
  const expense = new ExpenseModel(req.body);
  try {
    await expense.save();
    res.status(201).json({ message: "Expense Created Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error Creating Expense", error: error.message });
  }
}

async function getExpenseByServiceId(req, res) {
  try {
    const expenses = await ExpenseModel.find({
      serviceRequestId: req.params.serviceId,
    }).sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Getting Expenses", error: error.message });
  }
}

// Update expense status
async function updateExpenseStatus(req, res) {
  try {
    const expenseStatus = req.body.expenseStatus;
    // Validate expenseStatus against Status constants
    if (!Object.values(Status).includes(expenseStatus)) {
      return res.status(400).json({ message: "Invalid expense status" });
    }
    const updatedExpense = await ExpenseModel.findByIdAndUpdate(
      req.params.id,
      { expenseStatus: expenseStatus },
      { new: true }
    );
    if (!updatedExpense)
      return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Status Updated Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error Updating status", error: error.message });
  }
}

module.exports = {
  createExpense,
  getExpenseByServiceId,
  updateExpenseStatus,
};
