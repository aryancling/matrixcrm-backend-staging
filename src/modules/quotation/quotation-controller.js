const QuotationModel = require("./quotation-model");
const {
  ServiceRequestModal,
} = require("../serviceRequests/service-request-model");
const AssignServiceModel = require("../assign-serivce/assign-service-model");
const { generateRequestNumber } = require("../../utils/helpers");

const createQuotation = async (req, res) => {
  try {
    const { serviceRequestId, rcs, non_rcs, total_amount, cgst, sgst, igst } =
      req.body;

    // Check if Service Request exists
    const serviceRequest = await ServiceRequestModal.findById(
      serviceRequestId
    ).populate("clientId");

    if (!serviceRequest) {
      return res.status(404).json({ message: "Service Request not found." });
    }

    const quotation = new QuotationModel({
      serviceRequestId,
      rcs,
      non_rcs,
      total_amount,
      cgst,
      sgst,
      igst,
      quotationNumber: generateRequestNumber(
        "QT",
        serviceRequest?.clientId?.client_name
      ),
    });
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
    const quotations = await QuotationModel.find()
      .populate("serviceRequestId")
      .sort({ createdAt: -1 });
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
    const quotation = await QuotationModel.findById(id)
      .populate({
        path: "serviceRequestId",
      })
      .populate([
        {
          path: "rcs.rc_id",
          populate: {
            path: "inventory_id",
          },
        },
        {
          path: "non_rcs.inventory_id",
        },
      ]);

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
const getTasks = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the tasks and populate both serviceRequestId and itemId
    const tasks = await AssignServiceModel.findOne({ serviceId: id })
      .populate("serviceId")
      .populate({
        path: "inventories.inventory_id",
      });
    if (!tasks) {
      return res.status(404).json({ message: "Tasks not found." });
    }

    res.status(200).json({ data: tasks });
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

    const updatedQuotation = await QuotationModel.findByIdAndUpdate(
      id,
      req?.body,
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
    const { rcs } = req.body;

    // Validate rcs
    if (!rcs || rcs.length === 0) {
      return res
        .status(400)
        .json({ message: "Items are required to update the quotation." });
    }

    const updatedQuotation = await QuotationModel.findOneAndUpdate(
      { serviceRequestId },
      { rcs },
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

const updateItemDetails = async (req, res) => {
  const { serviceId } = req.params;
  const { completionStatus, usedQty, inventory_id } = req.body;

  try {
    // Validate input
    if (!completionStatus && usedQty === undefined) {
      return res.status(400).json({
        error: "completionStatus or usedQty must be provided.",
      });
    }

    // Find the quotation and update the specific item
    const updatedTask = await AssignServiceModel.findOneAndUpdate(
      { serviceId: serviceId, "inventories.inventory_id": inventory_id },
      {
        $set: {
          "inventories.$.completionStatus": completionStatus,
          "inventories.$.completionDate": new Date(),
          "inventories.$.usedQty": usedQty,
        },
      },
      { new: true } // Return the updated document
    );

    // If no quotation or item is found, return an error
    if (!updatedTask) {
      return res.status(404).json({ message: "Service or item not found." });
    }

    // Return the updated quotation
    res.status(200).json({
      message: "Item updated successfully.",
      data: updatedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating the item.",
      error: error.message,
    });
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
  updateItemDetails,
  getTasks,
};
