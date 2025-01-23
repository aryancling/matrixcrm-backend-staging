const {
  sendSuccessResponse,
  sendFailedResponse,
} = require("../../utils/response");
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

const getAllRcs = async (req, res) => {
  try {
    const query = req?.query;
    const rcs = await RcModal.find(query)
      .populate("inventory_id")
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
    const rc = await RcModal.findById(req.params.id);
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
};
