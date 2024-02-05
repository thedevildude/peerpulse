import express from "express";
import { postController } from "../../controllers";
import auth from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { postValidation } from "../../validations";

const router = express.Router();

router
  .route("/")
  .get(auth("queryCollegePosts"), postController.queryCollegePosts);

router
  .route("/create-post")
  .post(
    auth("createPost"),
    validate(postValidation.createPost),
    postController.createPost
  );

router
  .route("/create-poll")
  .post(
    auth("createPoll"),
    validate(postValidation.createPoll),
    postController.createPoll
  );

export default router;
