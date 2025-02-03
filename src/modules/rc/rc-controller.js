const {
  sendSuccessResponse,
  sendFailedResponse,
} = require("../../utils/response");
const ItemModel = require("../item/item-model");
const { RcModal } = require("./rc-modal");

const createRc = async (req, res) => {
  try {
    const newRc = await RcModal.create(req?.body);
    sendSuccessResponse(res, {
      message: "Rc created successfully",
      rc: newRc,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error Creating rcs", error: error.message });
  }
};

const searchRCs = async (req, res) => {
  try {
    const { search, ...rest } = req?.query;

    if (!search) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Search RCs by `finished_goods` and `itemName` from Inventory
    const rcs = await RcModal.find({
      $or: [
        { finished_goods: { $regex: search, $options: "i" } }, // Search finished_goods
        { inventory_id: { $exists: true } }, // Ensure inventory exists
      ],
      ...rest,
    }).populate({
      path: "inventory_id",
      match: { itemName: { $regex: search, $options: "i" } }, // Search in Inventory name
    });

    // Filter out RCs where inventory_id does not match
    let filteredRcs = rcs.filter((rc) => rc.inventory_id !== null);

    // If no RCs are found, search directly in Inventory
    if (filteredRcs.length === 0) {
      const inventoryItems = await ItemModel.find({
        itemName: { $regex: search, $options: "i" },
      });

      if (inventoryItems.length > 0) {
        return res
          .status(200)
          .json({ source: "inventory", data: inventoryItems });
      }
    }

    res.status(200).json({ source: "rcs", data: filteredRcs });
  } catch (error) {
    console.error("Error in search API:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllRcs = async (req, res) => {
  try {
    const query = req?.query;
    const rcs = await RcModal.find(query)
      .populate("inventory_id")
      .populate("clientId")
      .populate("servicePartnerId")
      .sort({ createdAt: -1 });
    sendSuccessResponse(res, {
      data: rcs,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching rcs", error: error.message });
  }
};

const getRcById = async (req, res) => {
  try {
    const rc = await RcModal.findById(req.params.id).populate([
      "inventory_id",
      "clientId",
    ]);
    if (!rc) {
      return res.status(404).json({ message: "Rc not found" });
    }
    return res.status(200).json(rc);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching rc", error: error.message });
  }
};

const updateRc = async (req, res) => {
  try {
    const updatedRc = await RcModal.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedRc) {
      return res.status(404).json({ message: "Rc not found" });
    }
    return res
      .status(200)
      .json({ message: "Rc updated successfully", rc: updatedRc });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating rc", error: error.message });
  }
};

const deleteRc = async (req, res) => {
  try {
    const deletedRc = await RcModal.findByIdAndDelete(req.params.id);
    if (!deletedRc) {
      return res.status(404).json({ message: "Rc not found" });
    }
    return res.status(200).json({ message: "Rc deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting Rc", error: error.message });
  }
};

module.exports = {
  createRc,
  getAllRcs,
  getRcById,
  updateRc,
  deleteRc,
  searchRCs,
};
