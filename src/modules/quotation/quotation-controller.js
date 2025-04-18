const QuotationModel = require("./quotation-model");
const {
  ServiceRequestModal,
} = require("../serviceRequests/service-request-model");
const AssignServiceModel = require("../assign-serivce/assign-service-model");
const { generateRequestNumber } = require("../../utils/helpers");
const ItemModel = require("../item/item-model");
const { RcModal } = require("../rc/rc-modal");

const createQuotation = async (req, res) => {
  try {
    const {
      serviceRequestId,
      rcs,
      non_rcs,
      non_existing_items,
      total_amount,
      cgst,
      sgst,
      igst,
    } = req.body;

    // Check if Service Request exists
    const serviceRequest = await ServiceRequestModal.findById(
      serviceRequestId
    ).populate("clientId");

    if (!serviceRequest) {
      return res.status(404).json({ message: "Service Request not found." });
    }

    let non_rcs_new = non_rcs?.length ? [...non_rcs] : [];
    if (non_existing_items?.length) {
      for (let i = 0; i < non_existing_items.length; i++) {
        const item = non_existing_items[i];
        console.log(item, "itemmm");

        const itemAdded = await ItemModel.create({
          ...item,
          servicePartnerId: serviceRequest?.servicePartnerId,
        });

        console.log(itemAdded, "itemAdded");

        if (itemAdded?._id) {
          if (item?.rc && !item?.rc_id) {
            const rcAdded = await RcModal.create({
              rc_number: item?.rc,
              inventory_id: itemAdded?._id,
              finished_goods: "",
              rate: item?.rate,
              gstPercentage: item?.gstPercentage,
              unit: item?.unit,
              clientId: serviceRequest?.clientId,
              servicePartnerId: serviceRequest?.servicePartnerId,
            });
            console.log(rcAdded, "rcAddedrcAdded");
          }

          non_rcs_new.push({
            inventory_id: itemAdded?._id?.toString(),
            qty: item.qty,
            remarks: item.remarks,
          });
        }
      }
    }

    console.log(non_rcs_new, "non_rcs_new");

    const quotation = new QuotationModel({
      serviceRequestId,
      rcs,
      non_rcs: non_rcs_new,
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
        populate: {
          path: "branch_id clientId servicePartnerId clientUserId",
        },
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

    const { non_rcs, non_existing_items, servicePartnerId, ...rest } =
      req?.body;

    let non_rcs_new = non_rcs?.length ? [...non_rcs] : [];
    if (non_existing_items?.length) {
      const items = await ItemModel.insertMany(
        non_existing_items?.map((item) => ({
          ...item,
          servicePartnerId,
        }))
      );
      non_rcs_new = [
        ...non_rcs,
        ...items.map((item) => ({
          inventory_id: item?._id?.toString(),
          qty: item.qty,
          remarks: item.remarks,
        })),
      ];
    }

    const updatedQuotation = await QuotationModel.findByIdAndUpdate(
      id,
      { ...rest, non_rcs: non_rcs_new },
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
