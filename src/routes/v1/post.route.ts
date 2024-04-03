import express from "express";
import { aiController, postController } from "../../controllers";
import auth from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { postValidation } from "../../validations";
import checkActionAccess from "../../middlewares/checkActionAccess";
import likeController from "../../controllers/like.controller";

const router = express.Router();

router
  .route("/")
  .get(auth("queryCollegePosts"), postController.queryCollegePosts);

router
  .route("/:postId")
  .get(auth("getPostById"), checkActionAccess, postController.getPostById);

router
  .route("/create-post")
  .post(
    auth("createPost"),
    validate(postValidation.createPost),
    postController.createPost
  );

router
  .route("/like")
  .post(auth("likePost"), checkActionAccess, likeController.likePost);

router
  .route("/create-poll")
  .post(
    auth("createPoll"),
    validate(postValidation.createPoll),
    postController.createPoll
  );

router
  .route("/upload-media")
  .post(auth("uploadMedia"), postController.uploadMedia);

router
  .route("/explanation")
  .post(
    auth("getExplanation"),
    checkActionAccess,
    aiController.getExplanationStream
  );

export default router;
