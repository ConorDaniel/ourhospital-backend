import Joi from "joi";
import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import multer from "multer";
import { cloudinary } from "../../utils/cloudinary.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage }); // export if needed for route config

export const staffApi = {
  create: {
    auth: "jwt",
    payload: {
      output: "stream",
      parse: true,
      allow: "multipart/form-data",
      multipart: true,
      maxBytes: 10 * 1024 * 1024 // 10MB
    },
    handler: async function (request, h) {
      const department = await db.departmentStore.getDepartmentById(request.params.id);
      if (!department) {
        return Boom.notFound("Department not found");
      }
  
      const { name, role, vignette } = request.payload;
      const file = request.payload.file;
  
      let pictureUrl = "";
  
      if (file && file._data && file.hapi) {
        // Upload to Cloudinary
        pictureUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "staff",
              resource_type: "image",
              allowed_formats: ["jpg", "jpeg", "png", "webp"]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          file.pipe(stream);
        });
      }
  
      const newStaff = {
        name,
        role,
        vignette,
        pictureUrl,
        departmentId: department._id
      };
  
      const staff = await db.staffStore.addStaff(newStaff);
      return h.response(staff).code(201);
    },
    description: "Add a staff member to a department (with optional picture)",
    tags: ["api"],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      })
      // Do NOT validate payload with Joi here — it's multipart
    }
  },
  
  uploadImage: {
    auth: "jwt",
    payload: {
      output: "stream",
      parse: true,
      allow: "multipart/form-data",
      maxBytes: 2 * 1024 * 1024 // 2MB max
    },
    handler: async function (request, h) {
      const { file } = request.payload;
  
      if (!picture || typeof picture.pipe !== "function") {
        return Boom.badRequest("No valid file provided");
      }
  
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "staff",
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp"]
          },
          (error, result) => {
            if (error) {
              reject(Boom.badImplementation("Upload failed"));
            } else {
              resolve(result);
            }
          }
        );
  
        file.pipe(stream);
      });
    },
    description: "Upload staff image to Cloudinary",
    tags: ["api"]
  },
  
  findOne: {
    auth: "jwt",
    handler: async function (request, h) {
      const staff = await db.staffStore.getStaffById(request.params.id);
      if (!staff) return Boom.notFound("Staff member not found");
      return staff;
    },
    tags: ["api"],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      })
    }
  },

  findByDepartment: {
    auth: false,
    handler: async function (request, h) {
      const department = await db.departmentStore.getDepartmentById(request.params.id);
      if (!department) return Boom.notFound("Department not found");
      return db.staffStore.getStaffByDepartmentId(request.params.id);
    },
    tags: ["api"],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      })
    }
  },

  update: {
    auth: "jwt",
    handler: async function (request, h) {
      return db.staffStore.updateStaff(request.params.id, request.payload);
    },
    tags: ["api"],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      }),
      payload: Joi.object({
        name: Joi.string().optional(),
        role: Joi.string().optional(),
        vignette: Joi.string().optional(),
        pictureUrl: Joi.string().uri().optional().allow("")
      })
    }
  },

  deleteOne: {
    auth: "jwt",
    handler: async function (request, h) {
      await db.staffStore.deleteStaff(request.params.id);
      return h.response().code(204);
    },
    tags: ["api"],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      })
    }
  }
};
