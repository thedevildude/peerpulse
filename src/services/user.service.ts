import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../client";
import { encryptPassword } from "../utils/encryption";
import { User, Role, Prisma } from "@prisma/client";

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

const createUser = async (
  email: string,
  username: string,
  password: string,
  role: Role = Role.USER
): Promise<User> => {
  if (await getUserByEmail(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Already registered");
  }
  if (await getUserByUsername(username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
  }

  return prisma.user.create({
    data: {
      email,
      username,
      password: await encryptPassword(password),
      role,
    },
  });
};

/**
 * Get user by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof User>(
  email: string,
  keys: Key[] = [
    "id",
    "email",
    "username",
    "password",
    "role",
    "isEmailVerified",
    "createdAt",
    "updatedAt",
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<User, Key> | null>;
};

/**
 * Get user by id
 * @param {string} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserById = async <Key extends keyof User>(
  id: string,
  keys: Key[] = [
    "id",
    "email",
    "username",
    "password",
    "role",
    "isEmailVerified",
    "createdAt",
    "updatedAt",
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<User, Key> | null>;
};

/**
 *  Get user by username
 * @param {string} username
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */

const getUserByUsername = async <Key extends keyof User>(
  username: string,
  keys: Key[] = [
    "id",
    "email",
    "username",
    "password",
    "role",
    "isEmailVerified",
    "createdAt",
    "updatedAt",
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { username },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<User, Key> | null>;
};

/**
 * Update user by id
 * @param {string} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async <Key extends keyof User>(
  userId: string,
  updateBody: Prisma.UserUpdateInput,
  keys: Key[] = ["id", "email", "name", "role"] as Key[]
): Promise<Pick<User, Key> | null> => {
  const user = await getUserById(userId, ["id", "email", "username"]);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await getUserByEmail(updateBody.email as string))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  });
  return updatedUser as Pick<User, Key> | null;
};

export default {
  createUser,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  updateUserById,
};
