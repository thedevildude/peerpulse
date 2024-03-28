import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { Comment, User } from "@prisma/client";
import { commentService } from "../services";

const createComment = catchAsync(async (req, res) => {
  const user = req.user as User;
  const { content, postId } = req.body;
  const comment: Comment & { User: User } = await commentService.createComment(
    content,
    user.id,
    postId
  );
  res.status(httpStatus.CREATED).send(comment);
});

export default {
  createComment,
};
