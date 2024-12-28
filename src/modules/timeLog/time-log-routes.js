const express = require("express");
const { createTimeLog, getTimeLogsByServiceId, deleteTimeLog } = require("./time-log-controller");

const router = express.Router();

// Route to create a new TimeLog
router.post("/create-log", createTimeLog);

// Route to get TimeLogs by service request ID
router.get("/service/:serviceRequestId", getTimeLogsByServiceId);

// Route to delete a TimeLog by ID
router.delete("delete-log/:id", deleteTimeLog);

module.exports = router; 