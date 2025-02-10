const {
  sendSuccessResponse,
  sendFailedResponse,
} = require("../../utils/response");

async function getAllPermissions(req, res) {
  try {
    sendSuccessResponse(res, {
      data: {
        category: ["add", "update", "delete", "get"],
        inventory: ["add", "update", "delete", "assign", "get"],
        quotation: ["add", "update", "delete", "get"],
        task: ["add", "update", "delete", "get"],
        payment: ["request", "update", "delete", "get"],
        time_log: ["add", "update", "delete", "get"],
        rc: ["add", "update", "delete", "get"],
        service_request: [
          "add",
          "get_all",
          "view_details",
          "assign_to_product_manager",
          "assign_to_service_manager",
        ],
        after_photo: ["add", "view"],
        expense: ["add", "update", "delete", "get"],
      },
    });
  } catch (error) {
    sendFailedResponse(res, {}, error);
  }
}

module.exports = {
  getAllPermissions,
};
