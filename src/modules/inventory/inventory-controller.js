const { default: mongoose } = require("mongoose");
const AssignServiceModel = require("../assign-serivce/assign-service-model");
const InventoryModel = require("./inventory-model");

const createInventory = async (req, res) => {
  try {
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
      const firstInventory = req?.body?.inventories?.[0];
      const inventory_in_to_add = {
        servicePartnerId: firstInventory?.servicePartnerId,
        record_type: firstInventory?.record_type,
        inventory_type: firstInventory?.inventory_type,
        service_request: firstInventory?.service_request,
        received_by: firstInventory?.received_by,
        is_godown: firstInventory?.is_godown,
        bill_no: firstInventory?.bill_no,
        bill_date: firstInventory?.bill_date,
        person_name: firstInventory?.person_name,
        supplier_id: firstInventory?.supplier_id,
        items: req?.body?.inventories?.map((inventory) => ({
          inventory_id: inventory?.inventory_id,
          qty_out: 0,
          qty_in: inventory?.qty_in,
          remarks: inventory?.remarks,
        })),
      };
      await InventoryModel.create(inventory_in_to_add);

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

      const firstInventoryOut = inventoriesOut?.[0];

      const inventory_out_to_add = {
        servicePartnerId: firstInventoryOut?.servicePartnerId,
        service_request: firstInventoryOut?.service_request,
        inventory_type: firstInventoryOut?.inventory_type,
        record_type: firstInventoryOut?.record_type,
        items: inventoriesOut?.map((inventory) => ({
          inventory_id: inventory?.inventory_id,
          qty_out: inventory?.qty_out,
          qty_in: 0,
          remarks: inventory?.remarks,
        })),
      };
      await InventoryModel.create(inventory_out_to_add);
    } else {
      const firstInventory = req?.body?.inventories?.[0];
      const inventory_in_to_add = {
        servicePartnerId: firstInventory?.servicePartnerId,
        record_type: firstInventory?.record_type,
        inventory_type: firstInventory?.inventory_type,
        service_request: firstInventory?.service_request,
        received_by: firstInventory?.received_by,
        is_godown: firstInventory?.is_godown,
        bill_no: firstInventory?.bill_no,
        bill_date: firstInventory?.bill_date,
        person_name: firstInventory?.person_name,
        supplier_id: firstInventory?.supplier_id,
        items: req?.body?.inventories?.map((inventory) => ({
          inventory_id: inventory?.inventory_id,
          qty_out: inventory?.qty_out,
          qty_in: inventory?.qty_in,
          remarks: inventory?.remarks,
        })),
      };
      await InventoryModel.create(inventory_in_to_add);
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
    const query = { ...req.query };

    const objectIdFields = [
      "supplier_id",
      "received_by",
      "service_request",
      "servicePartnerId",
    ];
    objectIdFields.forEach((field) => {
      if (query[field]) {
        query[field] = new mongoose.Types.ObjectId(query[field]);
      }
    });

    const matchStage = Object.keys(query).length ? { $match: query } : {};

    const inventories = await InventoryModel.aggregate([
      matchStage,

      // Lookup Supplier
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier_id",
          foreignField: "_id",
          as: "supplier_id",
        },
      },
      { $unwind: { path: "$supplier_id", preserveNullAndEmptyArrays: true } },

      // Lookup User
      {
        $lookup: {
          from: "users",
          localField: "received_by",
          foreignField: "_id",
          as: "received_by",
        },
      },
      { $unwind: { path: "$received_by", preserveNullAndEmptyArrays: true } },

      // Lookup ServiceRequest
      {
        $lookup: {
          from: "servicerequests",
          localField: "service_request",
          foreignField: "_id",
          as: "service_request",
        },
      },
      {
        $unwind: { path: "$service_request", preserveNullAndEmptyArrays: true },
      },

      // Unwind items
      { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },

      // Lookup Item (inventory_id)
      {
        $lookup: {
          from: "items",
          localField: "items.inventory_id",
          foreignField: "_id",
          as: "items.inventory_id",
        },
      },
      {
        $unwind: {
          path: "$items.inventory_id",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Add item_total based on record_type
      {
        $addFields: {
          "items.item_total": {
            $cond: [
              { $eq: ["$record_type", "inventory_in"] },
              {
                $multiply: [
                  "$items.qty_in",
                  { $ifNull: ["$items.inventory_id.rate", 0] },
                ],
              },
              {
                $multiply: [
                  "$items.qty_out",
                  { $ifNull: ["$items.inventory_id.rate", 0] },
                ],
              },
            ],
          },
        },
      },

      // Group items and totalAmount back
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
          totalAmount: { $sum: "$items.item_total" },
          items: { $push: "$items" },
        },
      },

      // Merge doc and calculated fields
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$doc",
              { totalAmount: "$totalAmount", items: "$items" },
            ],
          },
        },
      },

      // Sort by newest
      { $sort: { createdAt: -1 } },
    ]);

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
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.inventory_id",
          total_in: { $sum: "$items.qty_in" },
          total_out: { $sum: "$items.qty_out" },
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

    const available_quantities = result.reduce(
      (acc, { inventory_id, available_qty }) => {
        acc[inventory_id] = available_qty;
        return acc;
      },
      {}
    );
    console.log(available_quantities, "available_quantities");

    res.json(available_quantities);
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
      "supplier_id",
      "items.inventory_id",
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
