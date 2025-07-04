import Boom from "@hapi/boom";
import Joi from "joi";
import { db } from "../models/db.js";

export const userApi = {
  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.userStore.addUser(request.payload);
        return h.response(user).code(201);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    description: "Create a new user",
    notes: "Adds a new user to the database",
    tags: ["api"],
    validate: {
      payload: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        hospitals: Joi.array().items(Joi.string().length(24)).min(1).required(),
        pictureUrl: Joi.string().uri().optional().allow(""),
        role: Joi.string().valid("user", "admin").optional()
      })
    },
    payload: {
      parse: true,
      output: "data",
      multipart: false
    }
  },

  find: {
    auth: "jwt",
    handler: async function (request, h) {
      try {
        const users = await db.userStore.getAllUsers();
        return users;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    description: "Get all users",
    notes: "Returns an array of user objects",
    tags: ["api"]
  },

  findOne: {
    auth: "jwt",
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("No user with this ID");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    description: "Get a user by ID",
    notes: "Returns a single user object",
    tags: ["api"]
  },

  update: {
    auth: "jwt",
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("User not found");
        }
        const updatedUser = await db.userStore.updateUser(request.params.id, request.payload);
        return updatedUser;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    description: "Update user details",
    notes: "Updates fields of an existing user",
    tags: ["api"],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      }),
      payload: Joi.object({
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        email: Joi.string().email().optional(),
        password: Joi.string().min(6).optional(),
        hospitals: Joi.array().items(Joi.string().length(24)).min(1).required(),
        pictureUrl: Joi.string().uri().optional().allow(""),
        role: Joi.string().valid("user", "admin").optional()
      })
    }
  },

  deleteOne: {
    auth: "jwt",
    handler: async function (request, h) {
      try {
        await db.userStore.deleteUserById(request.params.id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    description: "Delete a user by ID",
    notes: "Removes the specified user",
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
      try {
        await db.userStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    description: "Delete all users",
    notes: "Removes all user records from the database",
    tags: ["api"]
  },
  me: {
    auth: "jwt",
    handler: async function (request, h) {
      try {
        const userId = request.auth.credentials._id;
        const user = await db.userStore.getUserById(userId);
        if (!user) {
          return Boom.notFound("User not found");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    description: "Get current logged-in user",
    notes: "Returns the user info from the JWT",
    tags: ["api"]
  }
  
};
