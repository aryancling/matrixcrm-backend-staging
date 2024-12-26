const QuotationModel = require("./quotation-model");
const {ServiceRequestModal} = require("../serviceRequests/service-request-model");
const createQuotation = async (req, res) => {
  try {
    const { serviceRequestId, items } = req.body;

    // Validate required fields
    if (!serviceRequestId || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "ServiceRequestId and items are required." });
    }

    // Check if Service Request exists
    const serviceRequest = await ServiceRequestModal.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({ message: "Service Request not found." });
    }

    const quotation = new QuotationModel({ serviceRequestId, items });
    await quotation.save();

    res
      .status(201)
      .json({ message: "Quotation created successfully.", data: quotation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating quotation.", error: error.message });
  }
};

// Get all Quotations
const getAllQuotations = async (req, res) => {
  try {
    const quotations = await QuotationModel.find().populate("serviceRequestId");
    res.status(200).json({ data: quotations });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching quotations.", error: error.message });
  }
};

// Get Quotation by ID
const getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await QuotationModel.findById(id).populate(
      "serviceRequestId"
    );

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found." });
    }

    res.status(200).json({ data: quotation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching quotation.", error: error.message });
  }
};

// Update a Quotation
const updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Items are required for updating the quotation." });
    }

    const updatedQuotation = await QuotationModel.findByIdAndUpdate(
      id,
      { items },
      { new: true }
    );

    if (!updatedQuotation) {
      return res.status(404).json({ message: "Quotation not found." });
    }

    res.status(200).json({
      message: "Quotation updated successfully.",
      data: updatedQuotation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating quotation.", error: error.message });
  }
};

// Delete a Quotation
const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedQuotation = await QuotationModel.findByIdAndDelete(id);

    if (!deletedQuotation) {
      return res.status(404).json({ message: "Quotation not found." });
    }

    res.status(200).json({ message: "Quotation deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting quotation.", error: error.message });
  }
};
// Get Quotation by Service Request ID
const getQuotationByServiceId = async (req, res) => {
  try {
    const { serviceRequestId } = req.params;

    const quotation = await QuotationModel.findOne({
      serviceRequestId,
    }).populate("serviceRequestId");

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found for the provided Service Request ID.",
      });
    }

    res.status(200).json({ data: quotation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching quotation.", error: error.message });
  }
};

// Update Quotation by Service Request ID
const updateQuotationByServiceId = async (req, res) => {
  try {
    const { serviceRequestId } = req.params;
    const { items } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Items are required to update the quotation." });
    }

    const updatedQuotation = await QuotationModel.findOneAndUpdate(
      { serviceRequestId },
      { items },
      { new: true }
    );

    if (!updatedQuotation) {
      return res.status(404).json({
        message: "Quotation not found for the provided Service Request ID.",
      });
    }

    res.status(200).json({
      message: "Quotation updated successfully.",
      data: updatedQuotation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating quotation.", error: error.message });
  }
};

module.exports = {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  getQuotationByServiceId,
  updateQuotationByServiceId,
};
