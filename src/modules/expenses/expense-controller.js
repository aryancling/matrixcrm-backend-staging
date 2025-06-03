const { Pay } = require("twilio/lib/twiml/VoiceResponse");
const { PaymentModel } = require("../payments/payment-model");
const { ExpenseModel, Status } = require("./expense-model");
const {
  ServiceRequestModal,
} = require("../serviceRequests/service-request-model");
const { default: mongoose } = require("mongoose");

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
// async function getLedger(req, res) {
//   try {
//     const { from_date, to_date, servicePartnerId, ...rest } = req?.query;

//     const dateFilter = {};
//     if (from_date || to_date) {
//       dateFilter.createdAt = {};
//       if (from_date) {
//         const startOfDay = new Date(from_date);
//         startOfDay.setHours(0, 0, 0, 0);
//         dateFilter.createdAt.$gte = startOfDay;
//       }
//       if (to_date) {
//         const endOfDay = new Date(to_date);
//         endOfDay.setHours(23, 59, 59, 999);
//         dateFilter.createdAt.$lte = endOfDay;
//       }
//     }

//     const payments = await PaymentModel.find({
//       ...rest,
//       ...dateFilter,
//       paymentStatus: "Paid",
//     })
//       .populate({
//         path: "serviceRequestId",
//         match: { servicePartnerId },
//       })
//       .populate({
//         path: "user_id",
//       })
//       .lean();
//     const expenses = await ExpenseModel.find({
//       ...rest,
//       ...dateFilter,
//       expenseStatus: "Approved",
//     })
//       .populate({
//         path: "serviceRequestId",
//         match: { servicePartnerId },
//       })
//       .populate({
//         path: "user_id",
//       })
//       .lean();

//     console.log(payments, expenses);

//     // Format ledger entries
//     const paymentEntries = payments
//       ?.filter((item) => item?.serviceRequestId)
//       .map((payment) => ({
//         date: payment.updatedAt,
//         type: "Credit",
//         source: "Payment",
//         status: payment.paymentStatus,
//         user_id: payment.user_id,
//         serviceRequestId: payment.serviceRequestId,
//         amount: payment.approved_amount ?? payment.amount,
//         desc: payment.desc,
//       }));

//     const expenseEntries = expenses
//       ?.filter((item) => item?.serviceRequestId)
//       .map((expense) => ({
//         date: expense.updatedAt,
//         type: "Debit",
//         source: "Expense",
//         status: expense.expenseStatus,
//         user_id: expense.user_id,
//         serviceRequestId: expense.serviceRequestId,
//         amount: expense.approved_amount ?? expense.amount,
//         desc: expense.desc,
//       }));

//     // Combine and sort all entries by date
//     const allEntries = [...paymentEntries, ...expenseEntries].sort((a, b) => {
//       const serviceRequestCompare = String(
//         a.serviceRequestId?._id || a.serviceRequestId
//       ).localeCompare(String(b.serviceRequestId?._id || b.serviceRequestId));

//       if (serviceRequestCompare !== 0) return serviceRequestCompare;

//       const userCompare = String(a.user_id?._id || a.user_id).localeCompare(
//         String(b.user_id?._id || b.user_id)
//       );

//       if (userCompare !== 0) return userCompare;

//       return new Date(a.date) - new Date(b.date);
//     });
//     // Calculate opening balance from entries BEFORE the first date
//     let openingBalance = 0;
//     const firstEntryDate = allEntries[0]?.date;

//     if (firstEntryDate) {
//       const [oldCredits, oldDebits] = await Promise.all([
//         PaymentModel.find({
//           ...rest,
//           createdAt: { $lt: firstEntryDate },
//           paymentStatus: "Paid",
//         })
//           .populate({
//             path: "serviceRequestId",
//             match: { servicePartnerId },
//           })
//           .populate({
//             path: "user_id",
//           })
//           .lean(),

//         ExpenseModel.find({
//           ...rest,
//           createdAt: { $lt: firstEntryDate },
//           expenseStatus: "Approved",
//         })
//           .populate({
//             path: "serviceRequestId",
//             match: { servicePartnerId },
//           })
//           .populate({
//             path: "user_id",
//           })
//           .lean(),
//       ]);

//       const totalCredits = oldCredits
//         ?.filter((item) => item?.serviceRequestId)
//         .reduce((sum, p) => sum + (p.approved_amount ?? p.amount), 0);
//       const totalDebits = oldDebits
//         ?.filter((item) => item?.serviceRequestId)
//         .reduce((sum, e) => sum + (e.approved_amount ?? e.amount), 0);
//       openingBalance = totalCredits - totalDebits;
//     }

//     // Add running balance after opening
//     let balance = openingBalance;
//     const ledger = allEntries.map((entry, i) => {
//       if (entry.type === "Credit") {
//         balance += entry.amount;
//       } else if (entry.type === "Debit") {
//         balance -= entry.amount;
//       }

//       return {
//         _id: i + 1,
//         ...entry,
//         balanceAfter: balance,
//       };
//     });

//     res.json({
//       success: true,
//       openingBalance,
//       closingBalance: balance,
//       ledger,
//     });
//   } catch (error) {
//     console.error("Ledger Error:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// }

// const Status = {
//   REQUESTED: "Requested",
//   APPROVED: "Approved",
//   REJECTED: "Rejected",
//   PAID: "Paid",
// };

const getLedger = async (req, res) => {
  try {
    const { from_date, to_date, serviceRequestId, servicePartnerId } =
      req.query;

    const dateFilter = {};
    if (from_date) dateFilter.$gte = new Date(from_date);
    if (to_date) dateFilter.$lte = new Date(to_date);

    let serviceRequestIds = [];

    if (servicePartnerId) {
      const serviceRequests = await ServiceRequestModal.find({
        servicePartnerId,
      }).select("_id");
      serviceRequestIds = serviceRequests.map((sr) => sr._id.toString());
    }

    if (serviceRequestId) {
      if (
        serviceRequestIds.length > 0 &&
        !serviceRequestIds.includes(serviceRequestId)
      ) {
        return res.json({
          success: true,
          openingBalance: 0,
          closingBalance: 0,
          ledger: [],
        });
      }
      serviceRequestIds = [serviceRequestId];
    }

    const commonFilter = {};
    if (Object.keys(dateFilter).length > 0) {
      commonFilter.updatedAt = dateFilter;
    }
    if (serviceRequestIds.length > 0) {
      commonFilter.serviceRequestId = { $in: serviceRequestIds };
    }

    // 🔢 Calculate openingBalance before from_date
    let openingBalance = 0;

    if (from_date && serviceRequestIds.length > 0) {
      const creditBefore = await PaymentModel.aggregate([
        {
          $match: {
            paymentStatus: Status.PAID,
            serviceRequestId: {
              $in: serviceRequestIds.map(
                (id) => new mongoose.Types.ObjectId(id)
              ),
            },
            updatedAt: { $lt: new Date(from_date) },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const debitBefore = await ExpenseModel.aggregate([
        {
          $match: {
            expenseStatus: Status.APPROVED,
            serviceRequestId: {
              $in: serviceRequestIds.map(
                (id) => new mongoose.Types.ObjectId(id)
              ),
            },
            updatedAt: { $lt: new Date(from_date) },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const creditTotal = creditBefore[0]?.total || 0;
      const debitTotal = debitBefore[0]?.total || 0;
      openingBalance = creditTotal - debitTotal;
    }

    // 🧾 Fetch Paid Payments (Credits)
    const credits = await PaymentModel.find({
      ...commonFilter,
      paymentStatus: Status.PAID,
    })
      .populate("user_id")
      .populate("action_taken_by")
      .populate("serviceRequestId")
      .lean();

    // 🧾 Fetch Approved Expenses (Debits)
    const debits = await ExpenseModel.find({
      ...commonFilter,
      expenseStatus: Status.APPROVED,
    })
      .populate("user_id")
      .populate("action_taken_by")
      .populate("serviceRequestId")
      .lean();

    // 🧮 Combine ledger
    const rawLedger = [
      ...credits.map((item) => ({
        ...item,
        type: "Credit",
        date: item.updatedAt,
        status: item.paymentStatus,
      })),
      ...debits.map((item) => ({
        ...item,
        type: "Debit",
        date: item.updatedAt,
        status: item.expenseStatus,
      })),
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    let balanceAfter = openingBalance;

    const ledger = rawLedger.map((entry) => {
      const amount = entry.amount || 0;
      balanceAfter += entry.type === "Credit" ? amount : -amount;
      return {
        ...entry,
        balanceAfter,
      };
    });

    const closingBalance = balanceAfter;

    return res.json({
      success: true,
      openingBalance,
      closingBalance,
      ledger,
    });
  } catch (err) {
    console.error("Ledger API error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  createExpense,
  getExpenseByServiceId,
  getExpensesByQuery,
  updateExpenseStatus,
  getLedger,
};
