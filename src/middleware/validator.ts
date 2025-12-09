import { Request, Response, NextFunction } from "express";
import { Schema, ValidationResult } from "joi";

const validationMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error }: ValidationResult = schema.validate(req.body, {
      abortEarly: true, 
    });
    if (error) {
      const firstError = error?.details[0]?.message;
      return res.status(400).json({
        error: firstError,
      });
    }
    next();
  };
};

export default validationMiddleware;
