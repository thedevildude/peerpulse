import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { Comment, User } from "@prisma/client";
import { commentService } from "../services";
import ApiError from "../utils/ApiError";
import pick from "../utils/pick";

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

const queryCommentsForPost = catchAsync(async (req, res) => {
  const user = req.user as User;
  if (!user.collegeId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User is not associated with a college"
    );
  }
  const entityId = req.query.postId as string;
  const search = req.query.search ? String(req.query.search) : undefined;
  const filter = pick(req.query, [
    "userId",
    "content",
    "isDeleted",
    "isEdited",
  ]);
  const options = pick(req.query, ["limit", "cursor", "sortBy", "sortType"]);
  const response = await commentService.queryCommentsForPost({
    entityId,
    search,
    filter,
    options,
  });
  res.send(response);
});

export default {
  createComment,
  queryCommentsForPost,
};
