import Joi from "joi";
import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { HospitalSpec } from "../models/joi-schemas.js";
import { cloudinary } from "../../utils/cloudinary.js";


export const hospitalApi = {
  findAll: {
    auth: false,
    handler: async function (request, h) {
      return db.hospitalStore.getAllHospitals();
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
    payload: {
      output: "stream",
      parse: true,
      multipart: true,
      maxBytes: 10 * 1024 * 1024
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      if (!loggedInUser || !loggedInUser._id) {
        return Boom.unauthorized("User not authenticated");
      }
  
      const imageUrls = [];
  
      const uploadToCloudinary = (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "hospitals" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result.secure_url);
            }
          );
          file.pipe(stream);
        });
  
      const fileFields = ["image1", "image2", "image3"];
      for (const key of fileFields) {
        const file = request.payload[key];
        if (file && typeof file.pipe === "function") {
          const url = await uploadToCloudinary(file);
          imageUrls.push(url);
        }
      }
  
      const newHospital = {
        userId: loggedInUser._id,
        name: request.payload.name,
        type: request.payload.type,
        location: request.payload.location,
        latitude: parseFloat(request.payload.latitude),
        longitude: parseFloat(request.payload.longitude),
        staffCount: parseInt(request.payload.staffCount),
        budget: parseFloat(request.payload.budget),
        bedCount: parseInt(request.payload.bedCount),
        region: parseInt(request.payload.region),
        imageUrls
      };
  
      const hospital = await db.hospitalStore.addHospital(newHospital);
      return h.response(hospital).code(201);
    },
    description: "Create a new hospital with images",
    notes: "Accepts multipart form data and uploads images to Cloudinary",
    tags: ["api"]
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
    notes: "Updates hospital fields",
    tags: ["api"],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      }),
      payload: Joi.object({
        name: Joi.string().optional(),
        type: Joi.string().valid("National", "Regional", "Local", "Other").optional(),
        location: Joi.string().optional(),
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional(),
        userId: Joi.string().optional(),
        staffCount: Joi.number().optional(),
        budget: Joi.number().optional(),
        bedCount: Joi.number().optional(),
        region: Joi.number().min(0).max(6).optional(),
        imageUrls: Joi.array().items(Joi.string()).optional()
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
    auth: "jwt",
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
