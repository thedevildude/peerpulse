import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../client";
import { Like, Option, Post, PostType, Prisma, User } from "@prisma/client";
import { CollegePost } from "../types/Posts";
import postService from "./post.service";
import e from "express";

/**
 * Like a post
 * @param {string} postId
 * @param {string} userId
 */

const likePost = async (postId: string, userId: string) => {
  const post = await postService.getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  const like = await prisma.like.create({
    data: {
      postId,
      userId,
    },
  });
  return { ...like, Post: await postService.getPostById(postId) };
};

export default {
  likePost,
};
