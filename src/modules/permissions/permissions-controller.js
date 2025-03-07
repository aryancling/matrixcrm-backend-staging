const {
  sendSuccessResponse,
  sendFailedResponse,
} = require("../../utils/response");

async function getAllPermissions(req, res) {
  try {
    sendSuccessResponse(res, {
      data: {
        category: ["add", "update", "delete", "view"],
        inventory: [
          "add",
          "update",
          "delete",
          "assign",
          "view",
          "manage_items",
          "view_inventory_in",
          "view_inventory_out",
          "add_inventory_in",
          "add_inventory_out",
        ],
        quotation: ["add", "update", "delete", "view", "send_via_email"],
        task: ["add", "update", "delete", "view"],
        payment: ["request", "update", "delete", "view"],
        time_log: ["add", "update", "delete", "view"],
        rc: ["add", "update", "delete", "view"],
        supplier: ["add", "update", "delete", "view"],
        service_request: [
          "raise",
          "view_all",
          "view_details",
          "assign_to_project_manager",
          "assign_to_service_manager",
          "assign_to_user",
        ],
        after_photo: ["add", "view"],
        expense: ["add", "update", "delete", "view"],
      },
    });
  } catch (error) {
    sendFailedResponse(res, {}, error);
  }
}

module.exports = {
  getAllPermissions,
};
