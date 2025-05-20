import Joi from "joi";
import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const staffApi = {
  create: {
    auth: "jwt",
    handler: async function (request, h) {
      const department = await db.departmentStore.getDepartmentById(request.params.id);
      if (!department) {
        return Boom.notFound("Department not found");
      }

      const { name, role, vignette, pictureUrl } = request.payload;

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
    description: "Add a staff member to a department (JSON only)",
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
    },
    payload: {
      parse: true,
      output: "data",
      allow: "application/json"
    }
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
