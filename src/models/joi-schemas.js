import Joi from "joi";

export const UserSpec = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(5).required(),
  hospitals: Joi.array().items(Joi.string().length(24)).min(1).required(),
  pictureUrl: Joi.string().uri().allow("").optional()
});

export const UserCredentialsSpec = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(5).required()
});

export const StaffSpec = Joi.object({
  role: Joi.string().required(),
  name: Joi.string().trim().required(),
  vignette: Joi.string().required(),
  pictureUrl: Joi.string().uri().optional().allow("")
});

export const DepartmentSpec = Joi.object({
  title: Joi.string().required(),
  deptLocation: Joi.string().min(1).required()
});

export const HospitalSpec = Joi.object({
  name: Joi.string().min(1).trim().required(),
  type: Joi.string().valid("National", "Regional", "Local", "Other").required(),
  location: Joi.string().required(),
  latitude: Joi.number().required().min(-90).max(90),
  longitude: Joi.number().required().min(-180).max(180),
  staffCount: Joi.number().integer().min(0).optional(),
  budget: Joi.number().precision(2).min(0).optional(),
  bedCount: Joi.number().integer().min(0).optional(),
  region: Joi.number().integer().min(0).max(6).optional(),
  imageUrls: Joi.alternatives().try(
    Joi.array().items(Joi.string().uri().allow("")),
    Joi.string().uri().allow(""),
    Joi.allow(null, "")
  ).optional()
});

