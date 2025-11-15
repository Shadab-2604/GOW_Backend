import express from "express";
import Setting from "../models/Setting.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Save WhatsApp number
router.post("/save", auth, async (req, res) => {
  let setting = await Setting.findOne();

  if (!setting) setting = new Setting();

  setting.whatsapp = req.body.whatsapp;
  await setting.save();

  res.json({ message: "Settings saved" });
});

// Get Settings
router.get("/", async (req, res) => {
  const setting = await Setting.findOne();
  res.json(setting);
});

export default router;
