import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { NextFunction, Request, Response } from "express";
import zod from "zod";

export const validate =
  (schema: zod.AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof zod.ZodError) {
        console.log(error.issues);
        const errorMessage = error.issues
          .map((issue) => issue.message)
          .join(", ");
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
      }
    }
  };
