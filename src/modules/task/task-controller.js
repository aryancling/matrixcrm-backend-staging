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

// async function getTaskByServiceId(req, res) {
//   try {
//     const tasks = await TaskModel.find({
//       serviceRequestId: req.params.serviceId,
//       $or: req?.query?.user_id
//         ? [
//             { user_id: req?.query?.user_id },
//             { created_by: req?.query?.user_id },
//           ]
//         : undefined,
//     })
//       .populate([
//         "serviceRequestId",
//         "user_id",
//         "created_by",
//         "logs.updated_by",
//       ])
//       .sort({ createdAt: -1 });

//     res.json(tasks);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error Getting Tasks", error: error.message });
//   }
// }
// async function getTaskByQuery(req, res) {
//   try {
//     const { user_id, ...rest } = req?.query;
//     const tasks = await TaskModel.find({
//       ...rest,
//       $or: user_id
//         ? [{ user_id: user_id }, { created_by: user_id }]
//         : undefined,
//     })
//       .populate([
//         "serviceRequestId",
//         "user_id",
//         "created_by",
//         "logs.updated_by",
//       ])
//       .sort({ createdAt: -1 });

//     res.json(tasks);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error Getting Tasks", error: error.message });
//   }
// }

async function getTaskByServiceId(req, res) {
  try {
    const match = {
      serviceRequestId: req.params.serviceId,
    };

    if (req?.query?.user_id) {
      match.$or = [
        { user_id: req.query.user_id },
        { created_by: req.query.user_id },
      ];
    }

    const tasks = await TaskModel.aggregate([
      {
        $addFields: {
          serviceRequestId: {
            $toString: "$serviceRequestId",
          },
        },
      },
      { $match: match },
      {
        $lookup: {
          from: "timelogs",
          localField: "_id",
          foreignField: "task_id",
          as: "timeLogs",
        },
      },
      {
        $unwind: {
          path: "$timeLogs",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "timeLogs.user_id",
          foreignField: "_id",
          as: "timeLogs.user",
        },
      },
      {
        $unwind: {
          path: "$timeLogs.user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
          timeLogs: { $push: "$timeLogs" },
        },
      },
      {
        $addFields: {
          "doc.timeLogs": "$timeLogs",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$doc",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    // Manually populate referenced fields (since .aggregate doesn't auto-populate)
    await TaskModel.populate(tasks, [
      { path: "serviceRequestId" },
      { path: "user_id" },
      { path: "created_by" },
      { path: "logs.updated_by" },
    ]);

    res.json(tasks);
  } catch (error) {
    console.log(error, "errrrrr");

    res
      .status(500)
      .json({ message: "Error Getting Tasks", error: error.message });
  }
}

async function getTaskByQuery(req, res) {
  try {
    const { user_id, ...rest } = req.query;

    const match = { ...rest };
    if (user_id) {
      match.$or = [{ user_id: user_id }, { created_by: user_id }];
    }

    const tasks = await TaskModel.aggregate([
      {
        $addFields: {
          serviceRequestId: {
            $toString: "$serviceRequestId",
          },
          user_id: {
            $toString: "$user_id",
          },
          created_by: {
            $toString: "$created_by",
          },
        },
      },
      { $match: match },
      {
        $lookup: {
          from: "timelogs",
          localField: "_id",
          foreignField: "task_id",
          as: "timeLogs",
        },
      },
      {
        $unwind: {
          path: "$timeLogs",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "timeLogs.user_id",
          foreignField: "_id",
          as: "timeLogs.user_id",
        },
      },
      {
        $unwind: {
          path: "$timeLogs.user_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
          timeLogs: { $push: "$timeLogs" },
        },
      },
      {
        $addFields: {
          "doc.timeLogs": "$timeLogs",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$doc",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    await TaskModel.populate(tasks, [
      { path: "serviceRequestId" },
      { path: "user_id" },
      { path: "created_by" },
      { path: "logs.updated_by" },
    ]);

    res.json(tasks);
  } catch (error) {
    console.log(error, "errrrrr");

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
            updated_by: req?.body?.updated_by,
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
