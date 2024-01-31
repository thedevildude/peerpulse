import express from "express";
import { validate } from "../../middlewares/validate";
import { authValidation } from "../../validations";
import { authController } from "../../controllers";

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

export default router;
