import express from "express";
import { collegeController } from "../../controllers";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/join-college", auth(), collegeController.joinCollege);

export default router;
