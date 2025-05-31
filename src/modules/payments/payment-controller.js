const { PaymentModel, Status } = require("./payment-model");

// Create a new payment
async function createPayment(req, res) {
  const payment = new PaymentModel(req.body);
  try {
    const savedPayment = await payment.save();
    res.status(201).json({ message: "Payment Created Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error Creating Payment", error: error.message });
  }
}

async function getPaymentByServiceId(req, res) {
  try {
    const payments = await PaymentModel.find({
      serviceRequestId: req.params.serviceId,
    })
      .populate(["serviceRequestId", "user_id", "action_taken_by"])
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Getting Payments", error: error.message });
  }
}
async function getPaymentsByQuery(req, res) {
  try {
    const payments = await PaymentModel.find(req?.query)
      .populate(["serviceRequestId", "user_id", "action_taken_by"])
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Getting Payments", error: error.message });
  }
}

// Update payment status
async function updatePaymentStatus(req, res) {
  try {
    const { paymentStatus, action_taken_by, approved_amount, remark } =
      req.body;
    // Validate paymentStatus against Status constants
    if (!Object.values(Status).includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }
    const updatedPayment = await PaymentModel.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, action_taken_by, approved_amount, remark },
      { new: true }
    );
    if (!updatedPayment)
      return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Status Updated Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error Updating status", error: error.message });
  }
}

module.exports = {
  createPayment,
  getPaymentByServiceId,
  getPaymentsByQuery,
  updatePaymentStatus,
};
