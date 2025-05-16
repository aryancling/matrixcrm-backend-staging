const { generateRequestNumber } = require("../../utils/helpers");
const AssignServiceModel = require("../assign-serivce/assign-service-model");
const { ClientModel } = require("../client/client-model");
const { ServiceRequestModal, Status } = require("./service-request-model");

// Create a new Service Request
const createRequest = async (req, res) => {
  try {
    const { clientId, ...rest } = req.body;

    const clientName = await ClientModel.findOne({ _id: clientId }).select(
      "client_name"
    );

    const newRequest = new ServiceRequestModal({
      clientId,
      ...rest,
      serviceNumber: generateRequestNumber(
        "SR",
        clientName?.client_name,
        ServiceRequestModal,
        "serviceNumber"
      ),
    });

    await newRequest.save();
    res.status(201).json({
      message: "Service Request created successfully.",
      data: newRequest,
    });
  } catch (error) {
    console.log(error, "Eroor");

    res.status(500).json({
      message: "Error creating Service Request.",
      error: error.message,
    });
  }
};
// Get all Service Requests

const getServiceRequestsByServicePartnerId = async (req, res) => {
  try {
    const servicePartnerId = req.params?.servicePartnerId;

    // Fetch all service requests by clientId and populate related fields
    const requests = await ServiceRequestModal.find({
      servicePartnerId,
      ...req?.query,
    })
      .populate("pmAssigned")
      .populate("smAssigned")
      .populate("quotation")
      .populate("branch_id")
      .populate("users")
      .populate("clientUserId")
      .sort({ createdAt: -1 });

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

const getServiceRequestsByClientId = async (req, res) => {
  try {
    const clientId = req.params?.clientId;

    // Fetch all service requests by clientId and populate related fields
    const requests = await ServiceRequestModal.find({ clientId, ...req?.query })
      .populate("pmAssigned")
      .populate("smAssigned")
      .populate("quotation")
      .populate("clientUserId")
      .populate("branch_id")
      .populate("users")
      .sort({ createdAt: -1 });

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
    const requests = await ServiceRequestModal.find(req?.query)
      .populate("pmAssigned smAssigned quotation branch_id")
      .sort({ createdAt: -1 });
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
      .populate("clientId")
      .populate("servicePartnerId")
      .populate("branch_id")
      .populate("clientUserId")
      .populate({
        path: "users",
        populate: [
          {
            path: "role",
          },
        ],
      })
      .populate({
        path: "quotation",
        populate: [
          {
            path: "rcs.rc_id",
            populate: {
              path: "inventory_id",
            },
          },
          {
            path: "non_rcs.inventory_id",
          },
        ],
      })
      .sort({ createdAt: -1 });

    if (!request) {
      return res.status(404).json({ message: "Service Request not found." });
    }
    res.status(200).json({ data: request });
  } catch (error) {
    console.log(error, "Erooor");

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
      {
        pmAssigned: pmId,
        pmAssignedStatus: Status.ASSIGNED,
        $push: { users: pmId },
      },
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
      {
        smAssigned: smId,
        smAssignedStatus: Status.ASSIGNED,
        $push: { users: smId },
      },
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

const assignToUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    const updatedRequest = await ServiceRequestModal.findByIdAndUpdate(
      id,
      { $push: { users: user_id } },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Service Request not found." });
    }

    res
      .status(200)
      .json({ message: "User assigned successfully.", data: updatedRequest });
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
    let serviceRequest;

    const assigned = await AssignServiceModel.findOne({
      serviceId: serviceRequestId,
    })
      .populate({
        path: "serviceId",
        populate: {
          path: "pmAssigned smAssigned branch_id clientUserId",
        },
      })
      .populate("inventories.inventory_id")
      .sort({ createdAt: -1 });

    console.log(assigned, "assignedassigned");

    if (assigned) {
      serviceRequest = assigned;
    } else {
      serviceRequest = await ServiceRequestModal.findById(serviceRequestId)

        .populate("pmAssigned")
        .populate("smAssigned")
        .populate("clientId")
        .populate("branch_id")
        .populate("clientUserId")
        .populate({
          path: "quotation",
          populate: [
            {
              path: "rcs.rc_id",
              populate: {
                path: "inventory_id",
              },
            },
            {
              path: "non_rcs.inventory_id",
            },
          ],
        })
        .sort({ createdAt: -1 });
    }

    console.log(serviceRequest, "serviceRequestserviceRequest");

    if (!serviceRequest) {
      return res.status(404).json({ message: "Service Request not found" });
    }

    const areAllItemsCompleted =
      serviceRequest?.inventories?.every(
        (item) => item?.completionStatus === true
      ) || false;

    const lastIncompleteItem =
      serviceRequest?.inventories?.filter(
        (item) => item.completionStatus === false
      ) || [];

    const steps = [
      {
        step: "Service Request Raised",
        status: "Completed",
        description: "Service request logged by support desk.",
        timestamp: (serviceRequest?.serviceId || serviceRequest)?.createdAt,
        isCompleted: true,
      },
      {
        step: "Task Assigned to Project Manager",
        status:
          (serviceRequest?.serviceId || serviceRequest)?.pmAssignedStatus ===
          Status.PENDING
            ? "In Progress"
            : "Completed",
        description:
          (serviceRequest?.serviceId || serviceRequest)?.pmAssignedStatus ===
          Status.ASSIGNED
            ? ""
            : `Waiting for project manager to analyze the task.`,
        assignedTo: (serviceRequest?.serviceId || serviceRequest)?.pmAssigned
          ?.name,
        timestamp: (serviceRequest?.serviceId || serviceRequest)?.updatedAt,
        isCompleted:
          (serviceRequest?.serviceId || serviceRequest)?.pmAssignedStatus !==
          Status.PENDING,
      },
      {
        step: "Quote prepared for the task",
        status:
          (serviceRequest?.serviceId || serviceRequest)
            ?.quotationCreatedStatus === Status.PENDING
            ? "In Progress"
            : (serviceRequest?.serviceId || serviceRequest)
                ?.quotationCreatedStatus === Status.ASSIGNED
            ? "Assigned"
            : "Completed",
        description:
          (serviceRequest?.serviceId || serviceRequest)
            ?.quotationCreatedStatus === Status.ASSIGNED
            ? null
            : "Waiting for service manager to prepare the quote of the task.",
        quotationId: serviceRequest.quotation,
        timestamp: (serviceRequest?.serviceId || serviceRequest)
          ?.quotationUpdatedAt,
        isCompleted:
          (serviceRequest?.serviceId || serviceRequest)
            ?.quotationCreatedStatus !== Status.PENDING,
        hasAction: true,
        actionLabel: "View Quote",
      },
      {
        step: "Task in Progress",
        status: areAllItemsCompleted ? "Completed" : "In Progress",
        description: areAllItemsCompleted
          ? `All tasks have been completed.`
          : lastIncompleteItem[0]?.inventory_id?.itemName
          ? `Working on  ${lastIncompleteItem[0]?.inventory_id?.itemName}`
          : "",
        timestamp: serviceRequest.updatedAt,
        isCompleted: areAllItemsCompleted,
        hasAction: true,
        actionLabel: "View Steps",
      },
      {
        step: "Task Completed",
        status:
          (serviceRequest?.serviceId || serviceRequest)
            ?.taskCompletionStatus === Status.COMPLETED
            ? "Completed"
            : "Waiting",
        description: areAllItemsCompleted
          ? ""
          : "Waiting for client to approve the task.",
        timestamp: (serviceRequest?.serviceId || serviceRequest)?.updatedAt,
        isCompleted: areAllItemsCompleted,
      },
    ];

    return res.status(200).json({ steps });
  } catch (error) {
    console.log(error, "Eroorrr");

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
  getServiceRequestsByServicePartnerId,
  getServiceRequestsByClientId,
  assignToUser,
};
