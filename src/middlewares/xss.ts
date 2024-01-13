import inHTMLData from "xss-filters";
import { Request, Response, NextFunction } from "express";

export const clean = <T>(data: T | string = ""): T => {
  let isObject = false;
  if (typeof data === "object") {
    isObject = true;
    data = JSON.stringify(data);
  }

  data = inHTMLData(data as string).trim();
  if (isObject) {
    data = JSON.parse(data as string);
  }
  return data as T;
};

const middleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body) req.body = clean(req.body);
    if (req.params) req.params = clean(req.params);
    if (req.query) req.query = clean(req.query);
    next();
  };
};

export default middleware;
