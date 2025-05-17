import { db } from "../models/db.js";

export const rankingController = {
  async add(request, h) {
    const hospitalId = request.params.id;
    const ratingData = request.payload;

    const rating = await db.rankingStore.addRating(hospitalId, ratingData);
    return h.response(rating).code(201);
  },

  async getAverage(request, h) {
    const hospitalId = request.params.id;
    const average = await db.rankingStore.getAverageRatings(hospitalId);
    return average || { care: 0, cleanliness: 0, friendliness: 0, food: 0 };
  }
};
