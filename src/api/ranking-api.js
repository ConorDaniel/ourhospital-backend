import { rankingController } from "../controllers/ranking-controller.js";

export const rankingApi = [
  {
    method: "POST",
    path: "/api/hospitals/{id}/ratings",
    config: {
      auth: false,
      handler: rankingController.add,
      description: "Submit a hospital rating",
      notes: "Accepts scores (1–5) for care, cleanliness, friendliness, and food. No authentication required.",
      tags: ["api"]
    }
  },
  {
    method: "GET",
    path: "/api/hospitals/{id}/ratings/average",
    config: {
      auth: false,
      handler: rankingController.getAverage,
      description: "Get average hospital ratings",
      notes: "Returns average scores (0–5) for care, cleanliness, friendliness, and food for the specified hospital.",
      tags: ["api"]
    }
  }
];
