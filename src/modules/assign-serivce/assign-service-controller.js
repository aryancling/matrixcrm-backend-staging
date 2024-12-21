const AssignServiceModel = require("./assign-service-model");

// Create a New Assignment
const createAssignment = async (req, res) => {
  try {
    const { serviceId, itemId, qty } = req.body;

    // Validate required fields
    if (!serviceId || !itemId || qty === undefined) {
      return res
        .status(400)
        .json({ message: "serviceId, itemId, and qty are required." });
    }

    const newAssignment = new AssignServiceModel({ serviceId, itemId, qty });

    await newAssignment.save();
    res.status(201).json({
      message: "Assignment created successfully.",
      data: newAssignment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating assignment.", error: error.message });
  }
};

// Get All Assignments
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await AssignServiceModel.find()
      .populate("serviceId", "title description")
      .populate("itemId", "itemName category");
    res.status(200).json({ data: assignments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching assignments.", error: error.message });
  }
};

// Get Assignments by Service ID
const getAssignmentsByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const assignments = await AssignServiceModel.find({ serviceId })
      .populate("itemId", "itemName category hsnCode gstPercentage unit rate")
      .exec();

    if (!assignments.length) {
      return res
        .status(404)
        .json({ message: "No assignments found for the given service ID." });
    }

    res.status(200).json({ data: assignments });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching assignments by service ID.",
      error: error.message,
    });
  }
};

// Update Assignment by ID
const updateAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const updates = req.body;

    const updatedAssignment = await AssignServiceModel.findByIdAndUpdate(
      assignmentId,
      updates,
      { new: true }
    )
      .populate("serviceId", "title description")
      .populate("itemId", "itemName category");

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    res.status(200).json({
      message: "Assignment updated successfully.",
      data: updatedAssignment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating assignment.", error: error.message });
  }
};

// Delete Assignment by ID
const deleteAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const deletedAssignment = await AssignServiceModel.findByIdAndDelete(
      assignmentId
    );

    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    res.status(200).json({ message: "Assignment deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting assignment.", error: error.message });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentsByServiceId,
  updateAssignmentById,
  deleteAssignmentById,
};
