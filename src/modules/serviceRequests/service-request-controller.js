const { ServiceRequestModal, Status } = require("./service-request-model");

// Create a new Service Request
const createRequest = async (req, res) => {
  try {
    const { bankId, title, description, beforeImages, serviceType } = req.body;

    if (!title || !description || !serviceType) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const newRequest = new ServiceRequestModal({
      bankId,
      title,
      description,
      beforeImages,
      serviceType,
    });

    await newRequest.save();
    res.status(201).json({
      message: "Service Request created successfully.",
      data: newRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating Service Request.",
      error: error.message,
    });
  }
};
// Get all Service Requests

const getServiceRequestsByBankId = async (req, res) => {
  try {
    const { Id: bankId } = req.params;

    // Fetch all service requests by bankId and populate related fields
    const requests = await ServiceRequestModal.find({ bankId })
      .populate("pmAssigned")
      .populate("smAssigned")
      .populate("quotation");

    // Respond with the fetched data
    res.status(200).json({ data: requests });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: "Error fetching Service Requests.",
      error: error.message,
    });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequestModal.find().populate(
      "pmAssigned smAssigned quotation"
    );
    res.status(200).json({ data: requests });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Service Requests.",
      error: error.message,
    });
  }
};

// Get Service Request by ID
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ServiceRequestModal.findById(id)
      .populate("pmAssigned")
      .populate("smAssigned")
      .populate("bankId")
      .populate({
        path: "quotation",
        populate: [
          {
            path: "items.rcId",
            select: 'rc_number rate amount unit bankId',
            populate: {
              path: "particulars",
            },
          },
        ],
      }).sort({ createdAt: -1 });;
    if (!request) {
      return res.status(404).json({ message: "Service Request not found." });
    }
    res.status(200).json({ data: request });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Service Request.",
      error: error.message,
    });
  }
};

// Assign PM to a Service Request
const assignPm = async (req, res) => {
  try {
    const { id } = req.params;
    const { pmId } = req.body;

    const updatedRequest = await ServiceRequestModal.findByIdAndUpdate(
      id,
      { pmAssigned: pmId, pmAssignedStatus: Status.ASSIGNED },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Service Request not found." });
    }

    res
      .status(200)
      .json({ message: "PM assigned successfully.", data: updatedRequest });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning PM.", error: error.message });
  }
};

// Assign SM to a Service Request
const assignSm = async (req, res) => {
  try {
    const { id } = req.params;
    const { smId } = req.body;

    const updatedRequest = await ServiceRequestModal.findByIdAndUpdate(
      id,
      { smAssigned: smId, smAssignedStatus: Status.ASSIGNED },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Service Request not found." });
    }

    res
      .status(200)
      .json({ message: "SM assigned successfully.", data: updatedRequest });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning SM.", error: error.message });
  }
};

// Add or Update Quotation for a Service Request
const addOrUpdateQuotationForRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotationId } = req.body;

    const updatedRequest = await ServiceRequestModal.findByIdAndUpdate(
      id,
      {
        quotation: quotationId,
        quotationCreatedStatus: Status.ASSIGNED,
        quotationApprovalStatus: Status.PENDING,
        quotationUpdatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Service Request not found." });
    }

    res.status(200).json({
      message: "Quotation added/updated successfully.",
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding/updating quotation.",
      error: error.message,
    });
  }
};

const getServiceRequestDetails = async (req, res) => {
  try {
    const { serviceRequestId } = req.params;

    // Find the service request by ID
    const serviceRequest = await ServiceRequestModal.findById(serviceRequestId)
      .populate("pmAssigned", "name email")
      .populate("smAssigned", "name email")
      .populate({
        path: "quotation",
        populate: {
          path: "items.rcId",
          select: "particulars price usedQty completionStatus",
          populate: {
            path: "particulars",
          },
        },
      }).sort({ createdAt: -1 });;
console.log(serviceRequest)
    if (!serviceRequest) {
      return res.status(404).json({ message: "Service Request not found" });
    }

    const areAllItemsCompleted =
      serviceRequest.quotation?.items?.every(
        (item) => item?.completionStatus === true
      ) || false;

    const lastIncompleteItem = serviceRequest.quotation?.items?.filter(
      (item) => item.completionStatus === false
    );
    console.log(lastIncompleteItem)
    const steps = [
      {
        step: "Service Request Raised",
        status: "Completed",
        description: "Service request logged by support desk.",
        timestamp: serviceRequest.createdAt,
        isCompleted: true,
      },
      {
        step: "Task Assigned to Project Manager",
        status:
          serviceRequest.pmAssignedStatus === Status.PENDING
            ? "In Progress"
            : "Completed",
        description:
          serviceRequest.quotationCreatedStatus === Status.ASSIGNED
            ? ""
            : `Waiting for project manager to analyze the task.`,
        assignedTo: serviceRequest.pmAssigned?.name,
        timestamp: serviceRequest.updatedAt,
        isCompleted: serviceRequest.pmAssignedStatus !== Status.PENDING,
      },
      {
        step: "Quote prepared for the task",
        status:
          serviceRequest.quotationCreatedStatus === Status.PENDING
            ? "In Progress"
            : serviceRequest.quotationCreatedStatus === Status.ASSIGNED
            ? "Assigned"
            : "Completed",
        description:
          serviceRequest.quotationCreatedStatus === Status.ASSIGNED
            ? null
            : "Waiting for service manager to prepare the quote of the task.",
        quotationId: serviceRequest.quotation?._id,
        timestamp: serviceRequest.quotationUpdatedAt,
        isCompleted: serviceRequest.quotationCreatedStatus !== Status.PENDING,
        hasAction: true,
        actionLabel: "View Quote",
      },
      {
        step: "Task in Progress",
        status: areAllItemsCompleted ? "Completed" : "In Progress",
        description: areAllItemsCompleted
          ? `All tasks have been completed.`
          : `Working on  ${lastIncompleteItem[0]?.rcId?.particulars?.itemName || "N/A"}`,
        timestamp: serviceRequest.updatedAt,
        isCompleted: areAllItemsCompleted,
        hasAction: true,
        actionLabel: "View Steps",
      },
      {
        step: "Task Completed",
        status:
          serviceRequest.taskCompletionStatus === Status.COMPLETED
            ? "Completed"
            : "Waiting",
        description: areAllItemsCompleted
          ? ""
          : "Waiting for client to approve the task.",
        timestamp: serviceRequest.updatedAt,
        isCompleted: areAllItemsCompleted,
      },
    ];

    return res.status(200).json({ steps });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Fetching Details", error: error.message });
  }
};

// Add after-images for a Service Request
const addAfterImagesForRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { afterImages } = req.body;

    const updatedRequest = await ServiceRequestModal.findByIdAndUpdate(
      id,
      { $push: { afterImages: { $each: afterImages } } },
      { new: true }
    );

    if (!updatedRequest) {
      return res
        .status(404)
        .json({ message: "Service Request not found.", error: error.message });
    }

    res.status(200).json({
      message: "After-images added successfully.",
      data: updatedRequest,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding after-images.", error: error.message });
  }
};

// Function to update quotation approval status
const updateQuotationApprovalStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !Object.values(Status).includes(status)) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    const serviceRequest = await ServiceRequestModal.findByIdAndUpdate(
      id,
      { quotationApprovalStatus: status },
      { new: true }
    );

    if (!serviceRequest) {
      return res.status(404).json({ message: "Service request not found" });
    }

    return res.status(200).json({ message: "Status Updated Succesfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding after-images.", error: error.message });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  assignPm,
  assignSm,
  addOrUpdateQuotationForRequest,
  addAfterImagesForRequest,
  getServiceRequestDetails,
  updateQuotationApprovalStatus,
  getServiceRequestsByBankId,
};
