import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { postService } from "../services";
import { User } from "@prisma/client";

const createPost = catchAsync(async (req, res) => {
  const user = req.user as User;
  const { content, title, media } = req.body;
  const post = await postService.createPost(
    content,
    user.id,
    title,
    media,
    user.collegeId ?? undefined
  );
  res.status(httpStatus.CREATED).send(post);
});

const createPoll = catchAsync(async (req, res) => {
  const user = req.user as User;
  const { content, title, media, options } = req.body;
  const poll = await postService.createPoll(
    content,
    user.id,
    options,
    title,
    media,
    user.collegeId ?? undefined
  );
  res.status(httpStatus.CREATED).send(poll);
});

export default {
  createPost,
  createPoll,
};
