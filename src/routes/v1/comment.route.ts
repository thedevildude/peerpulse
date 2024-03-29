import express from "express";
import { commentController } from "../../controllers";
import auth from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { commentValidation } from "../../validations";
import checkActionAccess from "../../middlewares/checkActionAccess";

const router = express.Router();

router
  .route("/")
  .get(auth("queryCommentsForPost"), commentController.queryCommentsForPost);

router
  .route("/create")
  .post(
    auth("createComment"),
    validate(commentValidation.createComment),
    checkActionAccess,
    commentController.createComment
  );

export default router;
