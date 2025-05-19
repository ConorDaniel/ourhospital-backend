import { db } from "../models/db.js";
import Joi from "joi";
import { HospitalSpec } from "../models/joi-schemas.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      if (!loggedInUser) {
        return h.redirect("/login");
      }

      // ✅ Get the full user including populated hospitals
      const user = await db.userStore.getUserById(loggedInUser._id);
      const hospitals = user?.hospitals ?? [];

      console.log("Hospitals for user", user._id, "→", hospitals);

      const viewData = {
        title: "Hospital Dashboard",
        user: user,
        hospitals: hospitals,
      };
      return h.view("dashboard-view", viewData);
    },
  },
};
