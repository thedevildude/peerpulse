import { NextFunction, Request, Response, Router } from "express";

const _router: Router = Router({
  mergeParams: true,
});

//Setting up the API Version
_router.use(function (req: Request, res: Response, next: NextFunction) {
  res.setHeader("Api-Version", "v1");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

_router.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "You are on the route for api v1",
  });
});

//Export the router
export const router = _router;
