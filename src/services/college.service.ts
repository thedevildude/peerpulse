import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../client";
import { College } from "@prisma/client";

/**
 * Create a college
 * @param {string} email
 * @returns {Promise<College>}
 */

const createCollege = async (email: string): Promise<College> => {
  const match = email.match(/@([^.]+)\./);
  if (match && match[1]) {
    const domain = match[1];
    const college = await getCollegeByName(domain);
    if (college) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "College already exists with this domain"
      );
    } else {
      return prisma.college.create({
        data: {
          name: domain,
        },
      });
    }
  }
  throw new ApiError(httpStatus.BAD_REQUEST, "Invalid email");
};

/**
 * Get college by name
 * @param {string} name
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<College, Key> | null>}
 */
const getCollegeByName = async <Key extends keyof College>(
  name: string,
  keys: Key[] = ["id", "name", "createdAt", "updatedAt"] as Key[]
): Promise<Pick<College, Key> | null> => {
  return prisma.college.findUnique({
    where: { name },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<College, Key> | null>;
};

/**
 * Assign a college to a user
 * @param {string} userId
 * @returns {Promise<College>}
 */

const joinCollege = async (email: string, userId: string): Promise<College> => {
  const match = email.match(/@([^.]+)\./);
  if (match && match[1]) {
    const domain = match[1];
    const college = await getCollegeByName(domain);
    if (college) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          collegeId: college.id,
        },
      });
      return college;
    } else {
      const college = await createCollege(email);
      await prisma.user.update({
        where: { id: userId },
        data: {
          collegeId: college.id,
        },
      });
      return college;
    }
  }
  throw new ApiError(
    httpStatus.BAD_REQUEST,
    "Something went wrong while assigning college to user"
  );
};

export default {
  createCollege,
  getCollegeByName,
  joinCollege,
};
