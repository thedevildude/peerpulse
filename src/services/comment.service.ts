import prisma from "../client";
import { Comment, Prisma, User } from "@prisma/client";
import { InfinitePaginatedQuery } from "../types/request";
import { InfinitePaginatedResponse } from "../types/response";

/**
 * Create a comment
 * @param {string} content
 * @param {string} userId
 * @param {string} postId
 * @returns {Promise<Comment & {User: User}>}
 */
const createComment = async (
  content: string,
  userId: string,
  postId: string
): Promise<Comment & { User: User }> => {
  return prisma.comment.create({
    data: {
      content,
      userId,
      postId,
    },
    include: {
      User: true,
    },
  });
};

/**
 * Infinite paginated query of comments for a post
 * @param {InfinitePaginatedQuery<Comment, keyof Comment>} query
 * @returns {Promise<InfinitePaginatedResponse<Comment, keyof Comment & {User: User}>>}
 */
const queryCommentsForPost = async ({
  entityId,
  search,
  filter,
  options,
  keys = [
    "id",
    "content",
    "createdAt",
    "updatedAt",
    "userId",
    "postId",
    "isDeleted",
    "isEdited",
  ] as (keyof Comment)[],
}: InfinitePaginatedQuery<Comment, keyof Comment>): Promise<
  InfinitePaginatedResponse<Comment, keyof Comment & { User: User }>
> => {
  const limit = options?.limit || 100;
  const sortBy = options?.sortBy ?? "createdAt";
  const sortType = options?.sortType ?? "desc";
  const cursor = options?.cursor ?? null;

  const where: Prisma.CommentWhereInput = {
    ...filter,
    postId: entityId,
    isDeleted: false,
    AND: search
      ? {
          OR: [
            { content: { contains: search, mode: "insensitive" } },
            { User: { username: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
  };

  const comments = (await prisma.comment.findMany({
    where,
    select: {
      ...keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
      User: true,
    },
    orderBy: { [sortBy]: sortType },
    cursor: cursor ? { id: cursor } : undefined,
    take: parseInt(limit.toString()) + 1,
  })) as (Comment & { User: User })[];

  const hasMore = comments.length > limit;
  if (hasMore) {
    comments.pop();
  }

  return {
    data: comments as Pick<Comment, keyof Comment & { User: User }>[],
    hasMore,
    cursor: comments[comments.length - 1]?.id ?? null,
  };
};

export default {
  createComment,
  queryCommentsForPost,
};
