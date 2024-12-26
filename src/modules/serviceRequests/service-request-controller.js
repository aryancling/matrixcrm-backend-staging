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

const getUnassignedPMServiceRequests = async (req, res) => {
  try {
    const unassignedPMRequests = await ServiceRequestModal.find({
      pmAssigned: null,
    });
    res.status(200).json(unassignedPMRequests);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving unassigned PM service requests",
        error,
      });
  }
};

// Function to get service requests not assigned to SM
const getUnassignedSMServiceRequests = async (req, res) => {
  try {
    const unassignedSMRequests = await ServiceRequestModal.find({
      smAssigned: null,
    });
    res.status(200).json(unassignedSMRequests);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving unassigned SM service requests",
        error,
      });
  }
}
// Get all Service Requests
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
    const request = await ServiceRequestModal.findById(id).populate(
      "pmAssigned smAssigned quotation"
    );

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
      .populate("pmAssigned", "name email") // Adjust the fields you need
      .populate("smAssigned", "name email")
      .populate("quotation");

    if (!serviceRequest) {
      return res.status(404).json({ message: "Service Request not found" });
    }

    // Prepare the details for the response
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
        description: `Waiting for project manager to analyze the task.`,
        assignedTo: serviceRequest.pmAssigned?.name,
        timestamp: serviceRequest.updatedAt,
        isCompleted: serviceRequest.pmAssignedStatus !== Status.PENDING,
      },
      {
        step: "Quote prepared for the task",
        status:
          serviceRequest.quotationCreatedStatus === Status.PENDING
            ? "In Progress"
            : "Completed",
        description:
          "Waiting for service manager to prepare the quote of the task.",
        quotationId: serviceRequest.quotation?._id,
        timestamp: serviceRequest.quotationUpdatedAt,
        isCompleted: serviceRequest.quotationCreatedStatus !== Status.PENDING,
        hasAction: true,
        actionLabel: "View Quote",
      },
      {
        step: "Task in Progress",
        status: "In Progress",
        description: `Working on ${serviceRequest.serviceType}`,
        timestamp: serviceRequest.updatedAt,
        isCompleted: false,
        hasAction: true,
        actionLabel: "View Steps",
      },
      {
        step: "Task Completed",
        status:
          serviceRequest.taskCompletionStatus === Status.COMPLETED
            ? "Completed"
            : "Waiting",
        description: "Waiting for client to approve the task.",
        timestamp: serviceRequest.updatedAt,
        isCompleted: serviceRequest.taskCompletionStatus === Status.COMPLETED,
      },
    ];

    return res.status(200).json({ steps });
  } catch (error) {
    console.error("Error fetching service request details:", error);
    res.status(500).json({ message: "Internal server error" });
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
      return res.status(404).json({ message: "Service Request not found." });
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

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  assignPm,
  assignSm,
  addOrUpdateQuotationForRequest,
  addAfterImagesForRequest,
  getServiceRequestDetails,
  getUnassignedPMServiceRequests,
  getUnassignedSMServiceRequests
};
