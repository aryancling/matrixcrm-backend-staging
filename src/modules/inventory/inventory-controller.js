const AssignServiceModel = require("../assign-serivce/assign-service-model");
const InventoryModel = require("./inventory-model");

// Create a New Inventory
const createInventory = async (req, res) => {
  try {
    let newInventories = [];
    let inventoriesOut = [];
    const is_not_godown = req?.body?.inventories?.some(
      (inventory) => !inventory?.is_godown && inventory?.service_request
    );

    if (
      is_not_godown &&
      !req?.body?.inventories?.find(
        (inventory) => inventory?.record_type === "inventory_out"
      )
    ) {
      const newInventoriesIn = await InventoryModel.insertMany(
        req?.body?.inventories
      );
      inventoriesOut = req?.body?.inventories?.map((inventory) => ({
        servicePartnerId: inventory?.servicePartnerId,
        inventory_id: inventory?.inventory_id,
        qty_in: 0,
        qty_out: inventory?.qty_in,
        service_request: inventory?.service_request,
        remarks: inventory?.remarks,
        inventory_type: "Issued",
        record_type: "inventory_out",
      }));
      const newInventoriesOut = await InventoryModel.insertMany(inventoriesOut);

      newInventories = [...newInventoriesIn, ...newInventoriesOut];
    } else {
      newInventories = await InventoryModel.insertMany(req?.body?.inventories);
    }

    const inventory_out_to_issue = is_not_godown
      ? inventoriesOut?.filter(
          (inventory) =>
            inventory?.record_type === "inventory_out" &&
            inventory?.inventory_type === "Issued"
        )
      : req?.body?.inventories?.filter(
          (inventory) =>
            inventory?.record_type === "inventory_out" &&
            inventory?.inventory_type === "Issued"
        );

    let service_id_mapped_inventories = {};

    inventory_out_to_issue?.forEach((inventory) => {
      if (service_id_mapped_inventories?.[inventory?.service_request]) {
        service_id_mapped_inventories?.[inventory?.service_request]?.push({
          inventory_id: inventory?.inventory_id,
          qty: inventory?.qty_out,
        });
      } else {
        service_id_mapped_inventories[inventory?.service_request] = [
          { inventory_id: inventory?.inventory_id, qty: inventory?.qty_out },
        ];
      }
    });

    for (
      let i = 0;
      i < Object.keys(service_id_mapped_inventories)?.length;
      i++
    ) {
      const service_id = Object.keys(service_id_mapped_inventories)?.[i];

      const inventories = service_id_mapped_inventories?.[service_id];

      await AssignServiceModel.insertMany({
        serviceId: service_id,
        inventories,
      });
    }

    res.status(201).json({
      message: "Inventories created successfully.",
      data: newInventories,
    });
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
      .populate([
        "inventory_id",
        "supplier_id",
        "received_by",
        "service_request",
      ])
      .sort({
        createdAt: -1,
      });

    res.status(200).json({ data: inventories });
  } catch (error) {
    console.log(error, "errorerror");

    res
      .status(500)
      .json({ message: "Error fetching inventories.", error: error.message });
  }
};

const getAvailableQuantity = async (req, res) => {
  try {
    const result = await InventoryModel.aggregate([
      {
        $group: {
          _id: "$inventory_id",
          total_in: { $sum: "$qty_in" },
          total_out: { $sum: "$qty_out" },
        },
      },
      {
        $project: {
          _id: 0,
          inventory_id: "$_id",
          available_qty: { $subtract: ["$total_in", "$total_out"] },
        },
      },
    ]);

    // Convert array to object
    const available_quantities = result.reduce(
      (acc, { inventory_id, available_qty }) => {
        acc[inventory_id] = available_qty;
        return acc;
      },
      {}
    );

    res.json(available_quantities);
  } catch (error) {
    console.log(error, "errorerror");

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
  getAvailableQuantity,
};
