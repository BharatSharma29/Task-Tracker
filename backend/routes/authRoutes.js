import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dynamoDB from "../config/dynamo.js";
import sns from "../config/sns.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    console.log("Register request:", email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
      TableName: "Users",
      Item: {
        email,
        password: hashedPassword,
        role: role || "user",
      },
    };

    await dynamoDB.put(params).promise();

    // 🔥 SNS Notification
    await sns.publish({
      Message: `New user registered: ${email}`,
      TopicArn: process.env.SNS_TOPIC_ARN,
    }).promise();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const params = {
      TableName: "Users",
      Key: { email },
    };

    const result = await dynamoDB.get(params).promise();
    const user = result.Item;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ token });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;