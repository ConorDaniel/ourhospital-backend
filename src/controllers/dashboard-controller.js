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

      const hospitals = await db.hospitalStore.getAllHospitals();
      console.log("Hospitals for user", loggedInUser._id, "→", hospitals);
  
      const viewData = {
        title: "Hospital Dashboard",
        user: loggedInUser,
        hospitals: hospitals,
      };
      return h.view("dashboard-view", viewData);
    },
  },
};
