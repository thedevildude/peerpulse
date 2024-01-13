import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import logger from "../config/logger";

export const errorConverter: ErrorRequestHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let err = error;
  if (!(err instanceof ApiError)) {
    const statusCode =
      err.statusCode || err instanceof Prisma.PrismaClientKnownRequestError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || httpStatus[statusCode];
    err = new ApiError(statusCode, message, false, err.stack);
  }
  next(err);
};

export const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  next
) => {
  let { statusCode, message } = error;
  response.locals.errorMessage = error.message;

  const reponse = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    logger.error(error);
  }

  response.status(statusCode).send(reponse);
};
