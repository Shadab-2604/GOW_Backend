import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { auth } from "../middleware/auth.js";
import Car from "../models/Car.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ====== CORRECT CLOUDINARY STREAM UPLOAD FUNCTION ======
function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "hotwheels" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
}

// ========= ADD CAR ==========
router.post("/add", auth, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const car = await Car.create({
      ...req.body,
      imageUrl,
      inStock: req.body.inStock === "true",
    });

    res.json({ message: "Car added successfully", car });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========= EDIT CAR ==========
router.put("/edit/:id", auth, upload.single("image"), async (req, res) => {
  try {
    let updateData = {
      ...req.body,
      inStock: req.body.inStock === "true",
    };

    if (req.file) {
      updateData.imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const updated = await Car.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json({ message: "Car updated successfully", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========= DELETE CAR ==========
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========= GET ALL CARS (filters + search + sort) ==========
router.get("/", async (req, res) => {
  try {
    const { search, category, rarity, sort } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (rarity && rarity !== "all") {
      query.rarity = rarity;
    }

    let sortOption = { createdAt: -1 };
    if (sort === "old") sortOption = { createdAt: 1 };
    if (sort === "low") sortOption = { price: 1 };
    if (sort === "high") sortOption = { price: -1 };

    const cars = await Car.find(query).sort(sortOption);

    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
