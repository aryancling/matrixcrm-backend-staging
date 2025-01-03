const ItemModel = require("../item/item-model");
const { RcModal } = require("../rc/rc-modal");
const AssignServiceModel = require("./assign-service-model");

// Create a New Assignment
const createAssignment = async (req, res) => {
  try {
    const { serviceId, items } = req.body;

    // Validate required fields
    if (!serviceId || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "serviceId and items are required." });
    }

    // Check if the service ID already has an assignment
    const existingAssignment = await AssignServiceModel.findOne({ serviceId });
    if (existingAssignment) {
      return res.status(400).json({
        message: "serviceId already exists. Please update the existing assignment.",
      });
    }

    // Process items to update usedqty in the Item model
    for (const item of items) {
      const rc = await RcModal.findById(item.rcId).populate('particulars');
      if (!rc) {
        return res.status(404).json({ message: `Rc with ID ${item.rcId} not found.` });
      }

      const itemId = rc.particulars._id; 
      const itemModel = await ItemModel.findById(itemId);
      if (!itemModel) {
        return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
      }
      if ((itemModel.usedqty || 0) + item.qty > itemModel.qty) {
        return res.status(400).json({ message: 'Cannot exceed the available quantity.' });
      }
      // Update usedqty
      itemModel.usedqty = (itemModel.usedqty || 0) + item.qty;
      await itemModel.save();
    }

    // Create the assignment
    const newAssignment = new AssignServiceModel({ serviceId, items });
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


const getAllAssignments = async (req, res) => {
  try {
    const assignments = await AssignServiceModel.find()
      .populate("serviceId", "title description")
      .populate("rcId", "itemName category")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: assignments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching assignments.", error: error.message });
  }
};

const getAssignmentsByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const assignments = await AssignServiceModel.find({ serviceId })
      .populate({
        path: "items.rcId",
          populate: {
            path: 'particulars'
          }
      })
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

const updateAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const updates = req.body;

    const updatedAssignment = await AssignServiceModel.findByIdAndUpdate(
      assignmentId,
      updates,
      { new: true }
    )
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
