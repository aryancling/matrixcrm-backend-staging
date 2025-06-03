const { PaymentModel } = require("../payments/payment-model");
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
      serviceRequestId: req?.params?.serviceId,
    })
      .populate(["serviceRequestId", "user_id", "action_taken_by"])
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Getting Expenses", error: error.message });
  }
}
async function getExpensesByQuery(req, res) {
  try {
    const expenses = await ExpenseModel.find(req?.query)
      .populate(["serviceRequestId", "user_id", "action_taken_by"])
      .sort({ createdAt: -1 });

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
    const { expenseStatus, action_taken_by, approved_amount } = req.body;
    // Validate expenseStatus against Status constants
    if (!Object.values(Status).includes(expenseStatus)) {
      return res.status(400).json({ message: "Invalid expense status" });
    }
    const updatedExpense = await ExpenseModel.findByIdAndUpdate(
      req.params.id,
      { expenseStatus, action_taken_by, approved_amount },
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
async function getLedger(req, res) {
  try {
    const { from_date, to_date, servicePartnerId, ...rest } = req?.query;

    const dateFilter = {};
    if (from_date || to_date) {
      dateFilter.createdAt = {};
      if (from_date) {
        const startOfDay = new Date(from_date);
        startOfDay.setHours(0, 0, 0, 0);
        dateFilter.createdAt.$gte = startOfDay;
      }
      if (to_date) {
        const endOfDay = new Date(to_date);
        endOfDay.setHours(23, 59, 59, 999);
        dateFilter.createdAt.$lte = endOfDay;
      }
    }

    const payments = await PaymentModel.find({
      ...rest,
      ...dateFilter,
      paymentStatus: "Paid",
    })
      .populate({
        path: "serviceRequestId",
        match: { servicePartnerId },
      })
      .populate({
        path: "user_id",
      })
      .lean();
    const expenses = await ExpenseModel.find({
      ...rest,
      ...dateFilter,
      expenseStatus: "Approved",
    })
      .populate({
        path: "serviceRequestId",
        match: { servicePartnerId },
      })
      .populate({
        path: "user_id",
      })
      .lean();

    console.log(payments, expenses);

    // Format ledger entries
    const paymentEntries = payments
      ?.filter((item) => item?.serviceRequestId)
      .map((payment) => ({
        date: payment.updatedAt,
        type: "Credit",
        source: "Payment",
        status: payment.paymentStatus,
        user_id: payment.user_id,
        serviceRequestId: payment.serviceRequestId,
        amount: payment.approved_amount ?? payment.amount,
        desc: payment.desc,
      }));

    const expenseEntries = expenses
      ?.filter((item) => item?.serviceRequestId)
      .map((expense) => ({
        date: expense.updatedAt,
        type: "Debit",
        source: "Expense",
        status: expense.expenseStatus,
        user_id: expense.user_id,
        serviceRequestId: expense.serviceRequestId,
        amount: expense.approved_amount ?? expense.amount,
        desc: expense.desc,
      }));

    // Combine and sort all entries by date
    const allEntries = [...paymentEntries, ...expenseEntries].sort((a, b) => {
      const serviceRequestCompare = String(
        a.serviceRequestId?._id || a.serviceRequestId
      ).localeCompare(String(b.serviceRequestId?._id || b.serviceRequestId));

      if (serviceRequestCompare !== 0) return serviceRequestCompare;

      const userCompare = String(a.user_id?._id || a.user_id).localeCompare(
        String(b.user_id?._id || b.user_id)
      );

      if (userCompare !== 0) return userCompare;

      return new Date(a.date) - new Date(b.date);
    });
    // Calculate opening balance from entries BEFORE the first date
    let openingBalance = 0;
    const firstEntryDate = allEntries[0]?.date;

    if (firstEntryDate) {
      const [oldCredits, oldDebits] = await Promise.all([
        PaymentModel.find({
          createdAt: {
            $lt: firstEntryDate,
          },
          ...rest,
          ...dateFilter,
          paymentStatus: "Paid",
        })
          .populate({
            path: "serviceRequestId",
            match: { servicePartnerId },
          })
          .populate({
            path: "user_id",
          })
          .lean(),

        ExpenseModel.find({
          createdAt: { $lt: firstEntryDate },
          ...rest,
          ...dateFilter,
          expenseStatus: "Approved",
        })
          .populate({
            path: "serviceRequestId",
            match: { servicePartnerId },
          })
          .populate({
            path: "user_id",
          })
          .lean(),
      ]);

      const totalCredits = oldCredits
        ?.filter((item) => item?.serviceRequestId)
        .reduce((sum, p) => sum + (p.approved_amount ?? p.amount), 0);
      const totalDebits = oldDebits
        ?.filter((item) => item?.serviceRequestId)
        .reduce((sum, e) => sum + (e.approved_amount ?? e.amount), 0);
      openingBalance = totalCredits - totalDebits;
    }

    // Add running balance after opening
    let balance = openingBalance;
    const ledger = allEntries.map((entry, i) => {
      if (entry.type === "Credit") {
        balance += entry.amount;
      } else if (entry.type === "Debit") {
        balance -= entry.amount;
      }

      return {
        _id: i + 1,
        ...entry,
        balanceAfter: balance,
      };
    });

    res.json({
      success: true,
      openingBalance,
      closingBalance: balance,
      ledger,
    });
  } catch (error) {
    console.error("Ledger Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

module.exports = {
  createExpense,
  getExpenseByServiceId,
  getExpensesByQuery,
  updateExpenseStatus,
  getLedger,
};
