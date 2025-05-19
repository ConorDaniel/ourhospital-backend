import { db } from "../models/db.js";

export const rankingController = {
  async add(request, h) {
    try {
      const hospitalId = request.params.id;
      const ratingData = request.payload;

      console.log("Adding rating for hospital:", hospitalId, ratingData);

      // Optional: Validate ratingData fields manually here if you want more control

      const rating = await db.rankingStore.addRating(hospitalId, ratingData);
      return h.response(rating).code(201);
    } catch (err) {
      console.error("Error adding rating:", err);
      return h.response({ error: err.message || "Internal Server Error" }).code(500);
    }
  },

  async getAverage(request, h) {
    try {
      const hospitalId = request.params.id;
      const average = await db.rankingStore.getAverageRatings(hospitalId);
      return average || { care: 0, cleanliness: 0, friendliness: 0, food: 0 };
    } catch (err) {
      console.error("Error getting average rating:", err);
      return h.response({ error: err.message || "Internal Server Error" }).code(500);
    }
  }
};
