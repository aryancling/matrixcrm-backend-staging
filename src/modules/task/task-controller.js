const { TaskModel, Status } = require("./task-model");

// Create a new task
async function createTask(req, res) {
  const task = new TaskModel({
    ...req.body,
    logs: [
      {
        status: "Yet to start",
        remarks: `Task created by ${req?.body?.username}`,
      },
    ],
  });
  try {
    await task.save();
    res.status(201).json({ message: "Task Created Successfully" });
  } catch (error) {
    console.log(error, "errrrrr");

    res
      .status(400)
      .json({ message: "Error Creating Task", error: error.message });
  }
}

async function getTaskByServiceId(req, res) {
  try {
    const tasks = await TaskModel.find({
      serviceRequestId: req.params.serviceId,
      $or: req?.query?.user_id
        ? [
            { user_id: req?.query?.user_id },
            { created_by: req?.query?.user_id },
          ]
        : undefined,
    })
      .populate(["serviceRequestId", "user_id", "created_by"])
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Getting Tasks", error: error.message });
  }
}
async function getTaskByQuery(req, res) {
  try {
    const { user_id, ...rest } = req?.query;
    const tasks = await TaskModel.find({
      ...rest,
      $or: user_id
        ? [{ user_id: user_id }, { created_by: user_id }]
        : undefined,
    })
      .populate(["serviceRequestId", "user_id", "created_by"])
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Getting Tasks", error: error.message });
  }
}

// Update task status
async function updateTaskStatus(req, res) {
  try {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req?.body,
        $push: {
          logs: {
            status: req?.body?.status,
            remarks: req?.body?.remarks,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );
    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task Updated Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error Updating status", error: error.message });
  }
}

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await TaskModel.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting Task", error: error.message });
  }
};

module.exports = {
  createTask,
  getTaskByServiceId,
  getTaskByQuery,
  updateTaskStatus,
  deleteTask,
};
