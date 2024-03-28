import prisma from "../client";
import { Comment, User } from "@prisma/client";

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

export default {
  createComment,
};
