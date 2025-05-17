import Joi from "joi";
import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { HospitalSpec } from "../models/joi-schemas.js";


export const hospitalApi = {
  findAll: {
    auth: false,
    handler: async function (request, h) {
      return db.hospitalStore.getAllHospitals();  // ✅ Match your store
    },
    description: "Get all hospitals",
    notes: "Returns an array of all hospital records",
    tags: ["api"]
  },  
  
  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const hospital = await db.hospitalStore.findById(request.params.id);
        if (!hospital) {
          return Boom.notFound("Hospital not found");
        }
        return hospital;
      } catch (err) {
        return Boom.badImplementation(err.message);
      }
    },
    description: "Get a single hospital by ID",
    notes: "Returns hospital details or 404 if not found",
    tags: ["api"],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      })
    }
  },

  create: {
    auth: "jwt",
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
  
      const newHospital = {
        userId: loggedInUser._id,
        name: request.payload.name,
        type: request.payload.type || "",
        location: request.payload.location,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude
      };
  
      const hospital = await db.hospitalStore.addHospital(newHospital);
      return h.response(hospital).code(201);
    },
    description: "Create a new hospital",
    notes: "Adds a hospital and returns the new object",
    tags: ["api"],
    validate: {
      payload: HospitalSpec
    }
  },  
  

  update: {
    auth: "jwt",
    handler: async function (request, h) {
      const hospital = await db.hospitalStore.findById(request.params.id);
      if (!hospital) {
        return Boom.notFound("Hospital not found");
      }
      const updatedHospital = await db.hospitalStore.updateHospital(
        request.params.id,
        request.payload
      );
      return updatedHospital;
    },
    description: "Update a hospital",
    notes: "Updates hospital fields: name, type, location, lat/lng, userId",
    tags: ["api"],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      }),
      payload: Joi.object({
        name: Joi.string().optional(),
        type: Joi.string()
          .valid("National", "Regional", "Local", "Other")
          .optional(),
        location: Joi.string().optional(),
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional(),
        userId: Joi.string().optional()
      })
    }
  },

  deleteOne: {
    auth: "jwt",
    handler: async function (request, h) {
      await db.hospitalStore.deleteHospitalById(request.params.id);
      return h.response().code(204);
    },
    description: "Delete a hospital by ID",
    notes: "Deletes a specific hospital",
    tags: ["api"],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      })
    }
  },

  deleteAll: {
    auth: "jwt",
    handler: async function (request, h) {
      await db.hospitalStore.deleteAll();
      return h.response().code(204);
    },
    description: "Delete all hospitals",
    notes: "Deletes all hospital records",
    tags: ["api"]
  },
  
  findByUser: {
    auth: "jwt",  // 🔐 requires valid JWT token
    handler: async function (request, h) {
      const userId = request.auth.credentials._id;
      const hospitals = await db.hospitalStore.getUserHospitals(userId);
      return hospitals;
    },
    description: "Get hospitals for the logged-in user",
    notes: "Returns only the hospitals associated with the current user",
    tags: ["api"]
  }
  




};
