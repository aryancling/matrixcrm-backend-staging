const ItemModel = require("./item-model");

// Create a New Item
const createItem = async (req, res) => {
  try {
    const { itemName, category, hsnCode, gstPercentage, unit, qty, rate } =
      req.body;

    // Validate request body
    if (
      !itemName ||
      !category ||
      !hsnCode ||
      gstPercentage === undefined ||
      !unit ||
      qty === undefined ||
      rate === undefined
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newItem = new ItemModel({
      itemName,
      category,
      hsnCode,
      gstPercentage,
      unit,
      qty,
      rate,
    });

    await newItem.save();
    res
      .status(201)
      .json({ message: "Item created successfully.", data: newItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating item.", error: error.message });
  }
};

// Get All Items
const getAllItems = async (req, res) => {
  try {
    const items = await ItemModel.find().sort({ createdAt: -1 });;
    res.status(200).json({ data: items });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching items.", error: error.message });
  }
};

// Get Item by ID
const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await ItemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    res.status(200).json({ data: item });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching item.", error: error.message });
  }
};

// Update Item by ID
const updateItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;

    const updatedItem = await ItemModel.findByIdAndUpdate(itemId, updates, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found." });
    }

    res
      .status(200)
      .json({ message: "Item updated successfully.", data: updatedItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating item.", error: error.message });
  }
};

// Delete Item by ID
const deleteItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

    const deletedItem = await ItemModel.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found." });
    }

    res.status(200).json({ message: "Item deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting item.", error: error.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItemById,
  deleteItemById,
};
