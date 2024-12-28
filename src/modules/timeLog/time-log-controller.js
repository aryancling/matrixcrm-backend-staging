const { TimeLog } = require("./time-log-model");

// Create a new TimeLog
const createTimeLog = async (req, res) => {
  try {
    const timeLog = new TimeLog(req.body);
    await timeLog.save();
    res.status(201).json({ message: 'Log Created Successfully' , });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get TimeLogs by service request ID
const getTimeLogsByServiceId = async (req, res) => {
  try {
    const timeLogs = await TimeLog.find({ serviceRequestId: req.params.serviceRequestId }).sort({ createdAt: -1 }); ;
    res.status(200).send(timeLogs);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete a TimeLog by ID
const deleteTimeLog = async (req, res) => {
  try {
    const timeLog = await TimeLog.findByIdAndDelete(req.params.id);
    if (!timeLog) {
      return res.status(404).send();
    }
    res.status(200).send(timeLog);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createTimeLog, getTimeLogsByServiceId, deleteTimeLog }; 