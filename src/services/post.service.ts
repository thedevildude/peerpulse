import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../client";
import { Option, Post, PostType, Prisma } from "@prisma/client";
import { InfinitePaginatedQuery } from "../types/request";
import { InfinitePaginatedResponse } from "../types/response";

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
 * @returns {Promise<Post & {options: Option[]}>}
 */

const createPoll = async (
  content: string,
  userId: string,
  options: Option[],
  title?: string,
  media?: string,
  collegeId?: string
): Promise<Post & { options: Option[] }> => {
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
    include: {
      options: true,
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
 * Infinite paginated query for college posts
 * @param {InfinitePaginatedQuery<Post, keyof Post>} query
 * @returns {Promise<InfinitePaginatedResponse<Post, keyof Post>>}
 */

const queryCollegePosts = async ({
  entityId,
  search,
  filter,
  options,
  keys = [
    "id",
    "title",
    "content",
    "authorId",
    "media",
    "PostType",
    "isEdited",
    "options",
    "createdAt",
    "updatedAt",
  ] as (keyof Post)[],
}: InfinitePaginatedQuery<Post, keyof Post>): Promise<
  InfinitePaginatedResponse<Post, keyof Post>
> => {
  const limit = options?.limit || 100;
  const sortBy = options?.sortBy ?? "createdAt";
  const sortType = options?.sortType ?? "desc";
  const cursor = options?.cursor ?? null;

  const where: Prisma.PostWhereInput = {
    ...filter,
    collegeId: entityId,
    isDeleted: false,
    AND: search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
  };

  const posts = (await prisma.post.findMany({
    where,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    orderBy: { [sortBy]: sortType },
    cursor: cursor ? { id: cursor } : undefined,
    take: parseInt(limit.toString()) + 1,
  })) as Pick<Post, keyof Post>[];

  const hasMore = posts.length > limit;
  if (hasMore) {
    posts.pop();
  }

  return {
    data: posts as Pick<Post, keyof Post>[],
    hasMore,
    cursor: posts[posts.length - 1]?.id ?? null,
  };
};

export default { createPost, createPoll, getPostById, queryCollegePosts };
