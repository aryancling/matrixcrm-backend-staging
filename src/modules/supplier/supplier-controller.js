const { checkIfNumberEmailUnique } = require("../../utils/helpers");
const { sendSuccessResponse } = require("../../utils/response");
const { SupplierModal } = require("./supplier-modal");

const createSupplier = async (req, res) => {
  try {
    if (req?.body?.mobile || req?.body?.email) {
      const is_unique = await checkIfNumberEmailUnique(
        req?.body?.mobile,
        req?.body?.email
      );

      if (!is_unique?.success && is_unique?.error) {
        return res.status(400).json({ message: is_unique?.error });
      }
    }
    const newSupplier = await SupplierModal.create(req?.body);
    sendSuccessResponse(res, {
      message: "Supplier created successfully",
      supplier: newSupplier,
    });
  } catch (error) {
    console.log(error, "errorerror");

    return res
      .status(500)
      .json({ message: "Error Creating Supplier", error: error.message });
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    const query = req?.query;
    const suppliers = await SupplierModal.find(query).sort({ createdAt: -1 });
    sendSuccessResponse(res, {
      data: suppliers,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching suppliers", error: error.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplier = await SupplierModal.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    return res.status(200).json(supplier);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching supplier", error: error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    if (req?.body?.mobile || req?.body?.email) {
      const is_unique = await checkIfNumberEmailUnique(
        req?.body?.mobile,
        req?.body?.email,
        req?.params?.id
      );

      if (!is_unique?.success && is_unique?.error) {
        return res.status(400).json({ message: is_unique?.error });
      }
    }
    const updatedSupplier = await SupplierModal.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    return res.status(200).json({
      message: "Supplier updated successfully",
      supplier: updatedSupplier,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating supplier", error: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await SupplierModal.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    return res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting Supplier", error: error.message });
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
