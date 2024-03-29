import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { User } from "@prisma/client";
import prisma from "../client";

const checkActionAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userCollegeId: any = (req.user as User)?.collegeId;
    const postId = req.params.postId || req.body.postId;
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    // Check if the user's collegeId matches the post's collegeId
    if (post && post.collegeId === userCollegeId) {
      next();
    } else {
      throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
    }
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export default checkActionAccess;
