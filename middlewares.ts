import { ValidationError } from "@error/validation.error";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
export const createValidationMiddleware = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body, query, and params
      if (req.body && Object.keys(req.body).length > 0) {
        req.body = schema.parse(req.body);
      }
      if (req.query && Object.keys(req.query).length > 0) {
        req.query = schema.parse(req.query);
      }
      if (req.params && Object.keys(req.params).length > 0) {
        req.params = schema.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: "Validation failed",
          message: error.errors.map((issue) => issue.message).join(", "),
        });
        throw new ValidationError(
          error.errors.map((issue) => issue.message).join(", ")
        );
      }
      next(error);
    }
  };
};
