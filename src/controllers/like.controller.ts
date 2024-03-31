import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { likeService } from "../services";
import { User } from "@prisma/client";

const likePost = catchAsync(async (req, res) => {
  const user = req.user as User;
  const { postId } = req.body;
  const like = await likeService.likePost(postId, user.id);
  res.status(httpStatus.CREATED).send(like);
});

export default {
  likePost,
};
