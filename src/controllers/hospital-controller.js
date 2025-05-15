import { db } from "../models/db.js";
import Joi from "joi";
import { HospitalSpec } from "../models/joi-schemas.js";

export const hospitalController = {
  index: {
    handler: async function (request, h) {
      const hospital = await db.hospitalStore.getHospitalById(request.params.id);
      if (!hospital) {
        return h.response("Hospital not found").code(404);
      }
      
      const departments = await db.departmentStore.getDepartmentsByHospitalId(request.params.id);
      const viewData = {
        title: "Hospital",
        hospital: hospital,
        departments: departments,
      };
      return h.view("hospital-view", viewData);
    },
  },

  addHospital: {
    validate: {
      payload: HospitalSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dashboard-view", {
          title: "Add Hospital Error",
          errors: error.details
        })
        .takeover()
        .code(400);
      }
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      if (!loggedInUser || !loggedInUser._id) {
        return h.redirect("/login");
      }
  
      const newHospital = {
        userId: loggedInUser._id,
        name: request.payload.name,
        type: request.payload.type || "",  
        location: request.payload.location,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude
      };
  
      await db.hospitalStore.addHospital(newHospital);
      return h.redirect("/dashboard");
    }
  },  

  deleteHospital: {
    handler: async function (request, h) {
      // Cleanup: Delete associated departments before deleting hospital
      await db.departmentStore.deleteDepartmentsByHospitalId(request.params.id);
      await db.hospitalStore.deleteHospitalById(request.params.id);
      return h.redirect("/dashboard");
    },
  }
};