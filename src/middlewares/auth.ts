import passport from "passport";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { roleRights } from "../config/roles";
import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";

const verifyCallback =
  (
    req: Request,
    resolve: (value?: unknown) => void,
    reject: (reason?: unknown) => void,
    requiredRights: string[],
    routesToSkipEmailVerification: string[] = []
  ) =>
  async (err: unknown, user: User | false, info: unknown) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }
    // Check if the email verification should be skipped for the current route/url
    const skipEmailVerification = routesToSkipEmailVerification.includes(
      req.url
    );
    // Check if the email is verified only if skipEmailVerification is false
    if (!skipEmailVerification && !user.isEmailVerified) {
      console.log(user);
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Email not verified")
      );
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role) ?? [];
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
    }

    resolve();
  };

const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const routesToSkipEmailVerification = [
      "/send-verification-email",
      // Add other routes where email verification should be skipped
    ];
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(
          req,
          resolve,
          reject,
          requiredRights,
          routesToSkipEmailVerification
        )
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
