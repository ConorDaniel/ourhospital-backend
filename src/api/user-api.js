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
        password: Joi.string().min(6).required()
      })
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
  }
};
