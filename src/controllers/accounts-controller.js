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
      const user = {
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        email: request.payload.email,
        password: request.payload.password,
        hospitals: request.payload.hospitals,
        role: "user",
        pictureUrl: request.payload.pictureUrl ?? ""
      };
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

  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  apiLogin: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      failAction: function (request, h, error) {
        console.error("🛑 Validation failed:", error.details);
        console.error("📨 Payload received:", request.payload);
        return h.response({ error: "Invalid login" }).code(400).takeover();
      },
    },
    handler: async function (request, h) {
      try {
        const { email, password } = request.payload;
        console.log("Login attempt:", email);
  
        const user = await db.userStore.getUserByEmail(email);
        console.log("User lookup result:", user);
  
        if (!user) {
          console.log("No user found for email:", email);
          return h.response({ error: "Invalid email or password" }).code(401);
        }
  
        console.log("Submitted password:", password);
        console.log("Stored password:", user.password);
        console.log("Password match:", user.password === password);
  
        if (user.password !== password) {
          console.log("Password does not match.");
          return h.response({ error: "Invalid email or password" }).code(401);
        }
  
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          algorithm: "HS256",
          expiresIn: "3h",
        });
  
        console.log("✅ JWT generated:", token);
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
