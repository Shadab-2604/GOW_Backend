import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  whatsapp: String,
});

export default mongoose.model("Setting", settingSchema);
