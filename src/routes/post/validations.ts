import Joi from "joi";

export const createPostValidationSchema = Joi.object({
    title: Joi.string().min(3).max(255).required().messages({
        "string.empty": "Title is required",
        "string.min": "Title must be at least 3 characters long",
        "string.max": "Title must be less than 255 characters long",
    }),
    content: Joi.string().min(3).max(255).required().messages({
        "string.empty": "Content is required",
        "string.min": "Content must be at least 3 characters long",
        "string.max": "Content must be less than 255 characters long",
    }),
    userId: Joi.string().length(24).hex().required().messages({
        "string.empty": "User ID is required",
        "string.length": "User ID must be 24 characters long",
        "string.hex": "User ID must be a valid hexadecimal string",
    }),
});
