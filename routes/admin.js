import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// 🔐 LOGIN
router.post("/login", async (req, res) => {
  const { password } = req.body;

  if (password !== process.env.AUTH_ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  const token = jwt.sign({ admin: true }, process.env.AUTH_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
});

// 🔐 CHANGE PASSWORD
router.post("/change-password", (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (oldPassword !== process.env.AUTH_ADMIN_PASSWORD)
    return res.status(400).json({ message: "Old password incorrect" });

  process.env.AUTH_ADMIN_PASSWORD = newPassword;

  res.json({ message: "Password updated successfully" });
});

export default router;
