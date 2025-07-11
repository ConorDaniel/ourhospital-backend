import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["National", "Regional", "Local", "Other"],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  staffCount: { type: Number },
  budget: { type: Number }, // in millions
  bedCount: { type: Number },
  region: { type: Number, min: 0, max: 6 },
  imageUrls: [String] // Cloudinary image URLs
});

export const Hospital = mongoose.model("Hospital", hospitalSchema);
