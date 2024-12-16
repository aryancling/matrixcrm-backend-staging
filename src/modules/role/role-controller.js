const {
  sendSuccessResponse,
  sendFailedResponse,
} = require("../../utils/response");
const { RoleModal } = require("./role-modal");

const createRole = async (req, res) => {
  try {
    const newRole = await RoleModal.create(req?.body);
    sendSuccessResponse(res, {
      message: "Role created successfully",
      role: newRole,
    });
  } catch (error) {
    sendFailedResponse(res, {
      message: "Error creating role",
    });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const query = req?.query;
    const roles = await RoleModal.find(query);
    sendSuccessResponse(res, {
      data: roles,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching roles" });
  }
};

const getRoleById = async (req, res) => {
  try {
    const role = await RoleModal.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.status(200).json(role);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching role" });
  }
};

const updateRole = async (req, res) => {
  try {
    const updatedRole = await RoleModal.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res
      .status(200)
      .json({ message: "Role updated successfully", role: updatedRole });
  } catch (error) {
    return res.status(500).json({ message: "Error updating role" });
  }
};

const deleteRole = async (req, res) => {
  try {
    const deletedRole = await RoleModal.findByIdAndDelete(req.params.id);
    if (!deletedRole) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting Role" });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
