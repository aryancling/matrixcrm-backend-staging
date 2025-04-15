const {
  sendSuccessResponse,
  sendFailedResponse,
} = require("../../utils/response");

async function getAllPermissions(req, res) {
  try {
    sendSuccessResponse(res, {
      data: {
        client_user: ["add", "update", "delete", "view"],
        category: ["add", "update", "delete", "view"],
        inventory: [
          "add",
          "update",
          "delete",
          "assign",
          "view",
          "request",
          "manage_items",
          "view_inventory_in",
          "view_inventory_out",
          "add_inventory_in",
          "add_inventory_out",
        ],
        quotation: ["add", "update", "delete", "view", "send_via_email"],
        task: ["add", "update", "delete", "view", "change_status"],
        time_log: ["add", "update", "delete", "view"],
        rc: ["add", "update", "delete", "view"],
        supplier: ["add", "update", "delete", "view"],
        service_request: [
          "raise",
          "view_all",
          "view_details",
          "assign_to_project_manager",
          "assign_to_service_manager",
          "assign_to_technician",
        ],
        after_photo: ["add", "view"],
        payment: ["request", "update", "delete", "view", "approve", "reject"],
        expense: ["add", "update", "delete", "view", "approve", "reject"],
        ledger: ["view"],
      },
    });
  } catch (error) {
    sendFailedResponse(res, {}, error);
  }
}

module.exports = {
  getAllPermissions,
};
