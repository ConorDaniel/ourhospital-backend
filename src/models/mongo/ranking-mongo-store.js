import mongoose from "mongoose";
import { Ranking } from "./ranking.js";

export const rankingMongoStore = {
  async addRating(hospitalId, rating) {
    const newRating = new Ranking({
      ...rating,
      hospitalId,
    });
    return newRating.save();
  },

  async getRatingsByHospitalId(hospitalId) {
    return Ranking.find({ hospitalId: new mongoose.Types.ObjectId(hospitalId) }).lean();
  },

  async getAverageRatings(hospitalId) {
    const result = await Ranking.aggregate([
      { $match: { hospitalId: new mongoose.Types.ObjectId(hospitalId) } },
      {
        $group: {
          _id: null,
          care: { $avg: "$care" },
          cleanliness: { $avg: "$cleanliness" },
          friendliness: { $avg: "$friendliness" },
          food: { $avg: "$food" },
        },
      },
    ]);
    return result[0]; // returns undefined if no ratings
  },

  async deleteRatingsByHospitalId(hospitalId) {
    return Ranking.deleteMany({ hospitalId: new mongoose.Types.ObjectId(hospitalId) });
  },
};
