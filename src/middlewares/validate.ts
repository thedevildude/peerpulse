import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { NextFunction, Request, Response } from "express";
import zod from "zod";

export const validate =
  (schema: zod.Schema) =>
  (req: Request, res: Response, next: NextFunction) => {};
