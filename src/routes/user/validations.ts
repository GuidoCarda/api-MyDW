import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .min(2)
    .max(50)
    .allow("")
    .optional()
    .messages({
      "string.pattern.base": "El nombre solo puede contener letras y espacios",
      "string.min": "El nombre debe tener al menos 2 caracteres",
      "string.max": "El nombre no puede exceder 50 caracteres",
    }),
  lastname: Joi.string()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .min(2)
    .max(50)
    .allow("")
    .optional()
    .messages({
      "string.pattern.base": "El apellido solo puede contener letras y espacios",
      "string.min": "El apellido debe tener al menos 2 caracteres",
      "string.max": "El apellido no puede exceder 50 caracteres",
    }),
  phone: Joi.string()
    .pattern(/^[\d\s\-\+\(\)]+$/)
    .min(8)
    .max(20)
    .allow("")
    .optional()
    .messages({
      "string.pattern.base": "El teléfono solo puede contener números, espacios, guiones, + y paréntesis",
      "string.min": "El teléfono debe tener al menos 8 caracteres",
      "string.max": "El teléfono no puede exceder 20 caracteres",
    }),
  address: Joi.string()
    .min(5)
    .max(200)
    .allow("")
    .optional()
    .messages({
      "string.min": "La dirección debe tener al menos 5 caracteres",
      "string.max": "La dirección no puede exceder 200 caracteres",
    }),
});
