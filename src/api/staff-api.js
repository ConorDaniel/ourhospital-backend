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

      const newStaff = {
        ...request.payload,
        departmentId: department._id
      };

      const staff = await db.staffStore.addStaff(newStaff);
      return h.response(staff).code(201);
    },
    description: "Add a staff member to a department",
    notes: "Creates a new staff member and associates them with a department",
    tags: ["api"],
    validate: {
      params: Joi.object({
        id: Joi.string().required() // department ID
      }),
      payload: Joi.object({
        name: Joi.string().required(),
        role: Joi.string().required(),
        vignette: Joi.string().required()
      })
    }
  },

  findOne: {
    auth: "jwt",
    handler: async function (request, h) {
      const staff = await db.staffStore.findById(request.params.id);
      if (!staff) {
        return Boom.notFound("Staff member not found");
      }
      return staff;
    },
    description: "Find a staff member by ID",
    notes: "Returns details of a single staff member",
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
      if (!department) {
        return Boom.notFound("Department not found");
      }
      const staffList = await db.staffStore.getStaffByDepartmentId(request.params.id);
      return staffList;
    },
    description: "Get all staff members in a department",
    notes: "Returns a list of staff associated with a department",
    tags: ["api"],
    validate: {
      params: Joi.object({
        id: Joi.string().required() // department ID
      })
    }
  },

  update: {
    auth: "jwt",
    handler: async function (request, h) {
      const updatedStaff = await db.staffStore.updateStaff(request.params.id, request.payload);
      return updatedStaff;
    },
    description: "Update a staff member's details",
    notes: "Can update name, role, or vignette",
    tags: ["api"],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      }),
      payload: Joi.object({
        name: Joi.string().optional(),
        role: Joi.string().optional(),
        vignette: Joi.string().optional()
      })
    }
  },

  deleteOne: {
    auth: "jwt",
    handler: async function (request, h) {
      await db.staffStore.deleteStaff(request.params.id);
      return h.response().code(204);
    },
    description: "Delete a staff member by ID",
    notes: "Deletes the staff member from the department",
    tags: ["api"],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      })
    }
  }
};
