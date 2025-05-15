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
  }
});

export const Hospital = mongoose.model("Hospital", hospitalSchema);
