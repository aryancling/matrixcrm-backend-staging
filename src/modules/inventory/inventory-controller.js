const InventoryModel = require("./inventory-model");

// Create a New Inventory
const createInventory = async (req, res) => {
  try {
    const newInventory = new InventoryModel(req?.body);

    await newInventory.save();
    res
      .status(201)
      .json({ message: "Inventory created successfully.", data: newInventory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating inventory.", error: error.message });
  }
};

// Get All Inventories
const getAllInventories = async (req, res) => {
  try {
    const query = req?.query;

    const inventories = await InventoryModel.find(query)
      .populate(["inventory_id", "supplier_id"])
      .sort({
        createdAt: -1,
      });

    res.status(200).json({ data: inventories });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching inventories.", error: error.message });
  }
};

// Get Inventory by ID
const getInventoryById = async (req, res) => {
  try {
    const { inventoryId } = req.params;

    const inventory = await InventoryModel.findById(inventoryId).populate([
      "inventory_id",
      "supplier_id",
    ]);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found." });
    }

    res.status(200).json({ data: inventory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching inventory.", error: error.message });
  }
};

// Update Inventory by ID
const updateInventoryById = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const updates = req.body;

    const updatedInventory = await InventoryModel.findByIdAndUpdate(
      inventoryId,
      updates,
      {
        new: true,
      }
    );
    if (!updatedInventory) {
      return res.status(404).json({ message: "Inventory not found." });
    }

    res.status(200).json({
      message: "Inventory updated successfully.",
      data: updatedInventory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating inventory.", error: error.message });
  }
};

// Delete Inventory by ID
const deleteInventoryById = async (req, res) => {
  try {
    const { inventoryId } = req.params;

    const deletedInventory = await InventoryModel.findByIdAndDelete(
      inventoryId
    );
    if (!deletedInventory) {
      return res.status(404).json({ message: "Inventory not found." });
    }

    res.status(200).json({ message: "Inventory deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting inventory.", error: error.message });
  }
};

module.exports = {
  createInventory,
  getAllInventories,
  getInventoryById,
  updateInventoryById,
  deleteInventoryById,
};
