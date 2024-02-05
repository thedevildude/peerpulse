import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../client";
import { Option, Post, PostType } from "@prisma/client";

/**
 * Create a post
 * @param {string} content
 * @param {string} userId
 * @param {string} title
 * @param {string} media
 * @param {string} collegeId
 * @returns {Promise<Post>}
 */

const createPost = async (
  content: string,
  userId: string,
  title?: string,
  media?: string,
  collegeId?: string
): Promise<Post> => {
  return prisma.post.create({
    data: {
      title,
      content,
      authorId: userId,
      media,
      collegeId,
      PostType: PostType.POST,
    },
  });
};

/**
 * Create a Poll
 * @param {string} content
 * @param {string} userId
 * @param {Option[]} options
 * @param {string} title
 * @param {string} media
 * @param {string} collegeId
 * @returns {Promise<Post>}
 */

const createPoll = async (
  content: string,
  userId: string,
  options: Option[],
  title?: string,
  media?: string,
  collegeId?: string
): Promise<Post> => {
  if (options.length < 2) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please provide at least 2 options"
    );
  }
  if (options.length > 10) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please limit the number of options to 10"
    );
  }
  return prisma.post.create({
    data: {
      title,
      content,
      authorId: userId,
      media,
      PostType: PostType.POLL,
      options: {
        create: options,
      },
      collegeId,
    },
  });
};

/**
 * Get post by id
 * @param {string} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Post, Key> | null>}
 */
const getPostById = async <Key extends keyof Post>(
  id: string,
  keys: Key[] = [
    "id",
    "title",
    "content",
    "authorId",
    "media",
    "PostType",
    "createdAt",
    "updatedAt",
  ] as Key[]
): Promise<Pick<Post, Key> | null> => {
  return prisma.post.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<Post, Key> | null>;
};

/**
 * Query posts
 * @param {Partial<Post>} filter - Filter object (e.g. { authorId: "..." })
 * @param {Object} options - Query options (limit, page, sortBy, sortType)
 * @param {number} options.limit - Limit the number of results
 * @param {number} options.page - Page number
 * @param {string} options.sortBy - Sort by field
 * @param {"asc" | "desc"} options.sortType - Sort type (asc, desc)
 * @param {Array<Key>} keys - Keys to select
 * @returns {Promise<Pick<Post, Key>[]>} - A promise that resolves to an array of posts
 */
const queryPosts = async <Key extends keyof Post>(
  filter: Partial<Post>,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  },
  keys: Key[] = [
    "id",
    "title",
    "content",
    "authorId",
    "media",
    "PostType",
    "createdAt",
    "updatedAt",
  ] as Key[]
): Promise<Pick<Post, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy ?? "createdAt";
  const sortType = options.sortType ?? "desc";

  return prisma.post.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    orderBy: { [sortBy]: sortType },
    skip: (page - 1) * limit,
    take: limit,
  }) as Promise<Pick<Post, Key>[]>;
};

export default { createPost, createPoll, getPostById, queryPosts };
