const {
  sendSuccessResponse,
  sendFailedResponse,
} = require("../../utils/response");
const { RoleModal } = require("./role-modal");

const createRole = async (req, res) => {
  try {
    const { role_name, permissions = [] } = req.body;
    if (!role_name || !permissions?.length) {
      sendFailedResponse(res, {
        message: "Role name and permissions are required",
      });
    }
    const newRole = await RoleModal.create({
      role_name,
      permissions,
    });
    sendSuccessResponse(res, {
      message: "Role created successfully",
      role: newRole,
    });
  } catch (error) {
    sendFailedResponse(res, {
      message: "Error creating role",
      error: error.message,
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
    return res
      .status(500)
      .json({ message: "Error fetching roles", error: error.message });
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
    return res
      .status(500)
      .json({ message: "Error fetching role", error: error.message });
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
    return res
      .status(500)
      .json({ message: "Error updating role", error: error.message });
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
    return res
      .status(500)
      .json({ message: "Error deleting Role", error: error.message });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
