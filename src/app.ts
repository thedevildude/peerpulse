import express, { Express, NextFunction, Request, Response } from "express";
import { router as v1 } from "./routes/v1/index";
import cors from "cors";
import { errorConverter, errorHandler } from "./middlewares/error";
import ApiError from "./utils/ApiError";
import httpStatus from "http-status";

const app: Express = express();

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// parse json request body
app.use(express.json());

// enable cors
app.use(cors());
app.options("*", cors());

// v1 api routes
app.use("/api/v1", v1);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

/* Main Route */
app.get("/", (_: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error("This is an error");
  } catch (error) {
    next(error);
  }
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle errors
app.use(errorHandler);

export default app;
