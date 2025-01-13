const {
  sendSuccessResponse,
  sendFailedResponse,
} = require("../../utils/response");

async function getAllPermissions(req, res) {
  try {
    sendSuccessResponse(res, {
      data: {
        user: ["add", "update", "delete", "get"],
        bank: ["add", "update", "delete", "get"],
        bank_user: ["add", "update", "delete", "get"],
        category: ["add", "update", "delete", "get"],
        inventory: ["add", "update", "delete", "assign", "get"],
        quotation: ["add", "update", "delete", "get"],
        role: ["add", "update", "delete", "get"],
        task: ["add", "update", "delete", "get"],
        payment: ["add", "update", "delete", "get", "raise"],
        time_log: ["add", "update", "delete", "get"],
        rcs: ["add", "update", "delete", "get"],
        service_requests: [
          "add",
          "added_by_me",
          "get_all",
          "view_details",
          "assign_to_product_manager",
          "assign_to_service_manager",
        ],
      },
    });
  } catch (error) {
    sendFailedResponse(res, {}, error);
  }
}

module.exports = {
  getAllPermissions,
};
