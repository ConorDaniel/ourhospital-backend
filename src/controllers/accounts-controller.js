/* eslint-disable func-names */
import { db } from "../models/db.js";
import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";
import jwt from "jsonwebtoken";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Department" });
    },
  },

  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Department" });
    },
  },

  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h
          .view("signup-view", { title: "Sign up error", errors: error.details })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      await db.userStore.addUser(user);
      return h.redirect("/");
    },
  },

  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Department" });
    },
  },

  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h
          .view("login-view", { title: "Log in error", errors: error.details })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },

  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  // ✅ API Login route for JWT auth
  apiLogin: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      failAction: function (request, h, error) {
        return h.response({ error: "Invalid login" }).code(400).takeover();
      },
    },
    handler: async function (request, h) {
      try {
        const { email, password } = request.payload;
        console.log("Login attempt:", email);

        const user = await db.userStore.getUserByEmail(email);
        console.log("User found:", !!user);

        if (!user || user.password !== password) {
          console.log("Login failed: invalid credentials");
          return h.response({ error: "Invalid email or password" }).code(401);
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          algorithm: "HS256",
          expiresIn: "3h",
        });

        console.log("JWT generated:", token);
        return h.response({ token }).code(200);
      } catch (err) {
        console.error("Login error:", err);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
