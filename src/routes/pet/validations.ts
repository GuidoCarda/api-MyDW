import Joi from "joi";

export const createPetValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
  }),
  description: Joi.string().optional(),
  birthDate: Joi.date().required().messages({
    "date.base": "Birth date must be a valid date",
    "any.required": "Birth date is required",
  }),
  gender: Joi.string().required().valid("macho", "hembra").messages({
    "string.empty": "Gender is required",
    "any.only": "Gender must be either 'macho' or 'hembra'",
  }),
  breed: Joi.string().required().messages({
    "string.empty": "Breed is required",
  }),
  isCastrated: Joi.boolean().required().messages({
    "boolean.base": "isCastrated must be a boolean",
    "any.required": "isCastrated is required",
  }),
  ownerId: Joi.string()
    .min(20)
    .max(128)
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .required()
    .messages({
      "string.empty": "Owner ID is required",
      "string.pattern.base":
        "Owner ID must be a valid Firebase UID (alphanumeric characters, hyphens, and underscores)",
      "string.min": "Owner ID must be at least 20 characters long",
      "string.max": "Owner ID must not exceed 128 characters",
      "any.required": "Owner ID is required",
    }),
  photos: Joi.array().items(Joi.string().uri()).optional(),
  medicalInformation: Joi.string().optional(),
  temperament: Joi.string().optional(),
});

export const updatePetValidationSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  birthDate: Joi.date().optional(),
  gender: Joi.string().valid("macho", "hembra").optional(),
  breed: Joi.string().optional(),
  isCastrated: Joi.boolean().optional(),
  ownerId: Joi.string()
    .min(20)
    .max(128)
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Owner ID must be a valid Firebase UID (alphanumeric characters, hyphens, and underscores)",
      "string.min": "Owner ID must be at least 20 characters long",
      "string.max": "Owner ID must not exceed 128 characters",
    }),
  photos: Joi.array().items(Joi.string().uri()).optional(),
  medicalInformation: Joi.string().optional(),
  temperament: Joi.string().optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });
