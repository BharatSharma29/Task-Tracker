import express from "express";
import dynamoDB from "../config/dynamo.js";
import sns from "../config/sns.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// CREATE TASK
router.post("/", verifyToken, async (req, res) => {
  const { title, description, status } = req.body;

  try {
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

    // 🔥 SNS Notification
    await sns.publish({
      Message: `New task created: ${title}`,
      TopicArn: process.env.SNS_TOPIC_ARN,
    }).promise();

    res.json({ message: "Task created" });

  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET TASKS
router.get("/", verifyToken, async (req, res) => {
  try {
    const data = await dynamoDB.scan({ TableName: "Tasks" }).promise();

    if (req.user.role === "admin") {
      return res.json(data.Items);
    }

    const userTasks = data.Items.filter(
      (task) => task.user_email === req.user.email
    );

    res.json(userTasks);

  } catch (err) {
    console.error("GET TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE TASK
router.put("/:id", verifyToken, async (req, res) => {
  const { status } = req.body;

  try {
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

  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE TASK (ADMIN ONLY)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const params = {
      TableName: "Tasks",
      Key: { id: req.params.id },
    };

    await dynamoDB.delete(params).promise();

    res.json({ message: "Task deleted" });

  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;