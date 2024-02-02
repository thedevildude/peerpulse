import express from "express";
import { validate } from "../../middlewares/validate";
import { authValidation } from "../../validations";
import { authController } from "../../controllers";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", validate(authValidation.logout), authController.logout);
router.post(
  "/refresh-tokens",
  validate(authValidation.refreshToken),
  authController.refreshTokens
);

// TODO: forgot password
// TODO: reset password

router.post(
  "/send-verification-email",
  auth(),
  authController.sendVerificationEmail
);
router.post(
  "/verify-email",
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

export default router;
