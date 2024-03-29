import express from "express";
import { userController } from "../../controllers";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/current-user", auth("currentUser"), userController.getCurrentUser);

export default router;
