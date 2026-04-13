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

    await dynamoDB.put({
      TableName: "Users",
      Item: {
        email,
        password: hashedPassword,
        role: role || "user",
      },
    }).promise();

    // 🔥 SNS NOTIFICATION (SAFE + DEBUG)
    try {
      console.log("Sending SNS for register...");

      const result = await sns.publish({
        Message: `User Registered: ${email} (${role})`,
        Subject: "New User Registration",
        TopicArn: process.env.SNS_TOPIC_ARN,
      }).promise();

      console.log("SNS SUCCESS (REGISTER):", result);

    } catch (snsErr) {
      console.error("SNS ERROR (REGISTER):", snsErr.message);
    }

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
    const result = await dynamoDB.get({
      TableName: "Users",
      Key: { email },
    }).promise();

    const user = result.Item;

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ message: "Invalid credentials" });

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