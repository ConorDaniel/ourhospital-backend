import Joi from "joi";

export const UserSpec = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(5).required()
});

export const UserCredentialsSpec = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(5).required()
});

export const StaffSpec = Joi.object({
  role: Joi.string().required(),
  name: Joi.string().trim().required(),
  vignette: Joi.string().required()
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
  longitude: Joi.number().required().min(-180).max(180)
});
