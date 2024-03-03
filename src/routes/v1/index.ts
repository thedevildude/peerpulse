import express, { NextFunction, Request, Response } from "express";
import authRoute from "./auth.route";
import collegeRoute from "./college.route";
import postRoute from "./post.route";

const router = express.Router();

//Setting up the API Version
router.use(function (req: Request, res: Response, next: NextFunction) {
  res.setHeader("Api-Version", "v1");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

//Setting up the routes
router.use("/auth", authRoute);
router.use("/college", collegeRoute);
router.use("/post", postRoute);

router.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "API V1",
  });
});

//Export the router
export default router;
