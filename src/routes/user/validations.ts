import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().allow("").optional(),
  lastname: Joi.string().allow("").optional(),
  phone: Joi.string().allow("").optional(),
  address: Joi.string().allow("").optional(),
});
