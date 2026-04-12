// routes/taskRoutes.js

import express from "express";
import dynamoDB from "../config/dynamo.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// CREATE TASK
router.post("/", verifyToken, async (req, res) => {
  const { title, description, status } = req.body;

  const params = {
    TableName: "Tasks",
    Item: {
      id: uuidv4(),
      title,
      description,
      status,
      user_email: req.user.email,
    },
  };

  await dynamoDB.put(params).promise();

  res.json({ message: "Task created" });
});

// GET TASKS
router.get("/", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const data = await dynamoDB.scan({ TableName: "Tasks" }).promise();
    res.json(data.Items);
  } else {
    const data = await dynamoDB.scan({ TableName: "Tasks" }).promise();

    // filter tasks for logged-in user
    const userTasks = data.Items.filter(
      (task) => task.user_email === req.user.email
    );

    res.json(userTasks);
  }
});

// UPDATE TASK
router.put("/:id", verifyToken, async (req, res) => {
  const { status } = req.body;

  const params = {
    TableName: "Tasks",
    Key: { id: req.params.id },
    UpdateExpression: "set #s = :status",
    ExpressionAttributeNames: {
      "#s": "status",
    },
    ExpressionAttributeValues: {
      ":status": status,
    },
  };

  await dynamoDB.update(params).promise();

  res.json({ message: "Task updated" });
});

// DELETE TASK (ADMIN ONLY)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const params = {
    TableName: "Tasks",
    Key: { id: req.params.id },
  };

  await dynamoDB.delete(params).promise();

  res.json({ message: "Task deleted" });
});

export default router;