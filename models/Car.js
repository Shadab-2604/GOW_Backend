import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  name: String,
  model: String,
  color: String,
  year: Number,
  price: Number,
  category: String,
  rarity: String,
  inStock: Boolean,
  description: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Car", carSchema);
