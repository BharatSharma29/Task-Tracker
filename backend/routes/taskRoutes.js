import express from "express";
import dynamoDB from "../config/dynamo.js";
import sns from "../config/sns.js";
import sqs from "../config/sqs.js";
import s3 from "../config/s3.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { createTaskObject, formatTaskForSQS, formatTaskForS3 } from "../utils/taskUtils.js";

const router = express.Router();

// CREATE TASK
router.post("/", verifyToken, async (req, res) => {
  const { title, description, status } = req.body;

  try {
    console.log("Create task request:", title);

    // 🔹 Use taskUtil to create task object
    const task = createTaskObject(title, description, status, req.user.email);

    // 🔹 Save to DynamoDB
    await dynamoDB.put({
      TableName: "Tasks",
      Item: task,
    }).promise();

    // 🔹 SNS Notification
    try {
      const result = await sns.publish({
        Message: `Task Created: ${task.title}`,
        Subject: "New Task Created",
        TopicArn: process.env.SNS_TOPIC_ARN,
      }).promise();

      console.log("SNS SUCCESS (TASK):", result);
    } catch (snsErr) {
      console.error("SNS ERROR (TASK):", snsErr.message);
    }

    // 🔹 SQS Message using taskUtil
    try {
      const sqsResult = await sqs.sendMessage({
        QueueUrl: process.env.SQS_QUEUE_URL,
        MessageBody: formatTaskForSQS(task),
      }).promise();

      console.log("SQS SUCCESS:", sqsResult);
    } catch (sqsErr) {
      console.error("SQS ERROR:", sqsErr.message);
    }

    // 🔹 S3 Upload using taskUtil
    try {
      const fileContent = formatTaskForS3(task);

      await s3.putObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `tasks/${task.title}-${Date.now()}.txt`,
        Body: fileContent,
      }).promise();

      console.log("S3 UPLOAD SUCCESS");
    } catch (s3Err) {
      console.error("S3 ERROR:", s3Err.message);
    }

    res.json({ message: "Task created successfully" });

  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET TASKS
router.get("/", verifyToken, async (req, res) => {
  try {
    const data = await dynamoDB.scan({ TableName: "Tasks" }).promise();

    if (req.user.role === "admin") return res.json(data.Items);

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
    await dynamoDB.update({
      TableName: "Tasks",
      Key: { id: req.params.id },
      UpdateExpression: "set #s = :status",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":status": status },
    }).promise();

    res.json({ message: "Task updated successfully" });

  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE TASK (ADMIN)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await dynamoDB.delete({
      TableName: "Tasks",
      Key: { id: req.params.id },
    }).promise();

    res.json({ message: "Task deleted successfully" });

  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;