import mongoose from "mongoose";

const rankingSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  care: { type: Number, required: true, min: 1, max: 5 },
  cleanliness: { type: Number, required: true, min: 1, max: 5 },
  friendliness: { type: Number, required: true, min: 1, max: 5 },
  food: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

export const Ranking = mongoose.model("Ranking", rankingSchema);
