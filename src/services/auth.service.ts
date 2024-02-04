import httpStatus from "http-status";
import { tokenService, userService, collegeService } from "../services";
import ApiError from "../utils/ApiError";
import { TokenType, User } from "@prisma/client";
import prisma from "../client";
import { encryptPassword, comparePassword } from "../utils/encryption";
import { AuthTokensResponse } from "../types/response";
import exclude from "../utils/exclude";

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Omit<User, 'password'>>}
 */

const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<Omit<User, "password">> => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await comparePassword(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return exclude(user, ["password"]);
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */

const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenData = await prisma.token.findFirst({
    where: {
      token: refreshToken,
      type: TokenType.REFRESH,
    },
  });
  if (!refreshTokenData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await prisma.token.delete({
    where: {
      id: refreshTokenData.id,
    },
  });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<AuthTokensResponse>}
 */
const refreshAuth = async (
  refreshToken: string
): Promise<AuthTokensResponse> => {
  try {
    const refreshTokenData = await tokenService.verifyToken(
      refreshToken,
      TokenType.REFRESH
    );
    const { userId } = refreshTokenData;
    await prisma.token.delete({ where: { id: refreshTokenData.id } });
    return tokenService.generateAuthTokens({ id: userId });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<void>}
 */
const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
  try {
    const verifyEmailTokenData = await tokenService.verifyToken(
      verifyEmailToken,
      TokenType.VERIFY_EMAIL
    );
    const user = await userService.getUserById(verifyEmailTokenData.userId, [
      "id",
      "email",
    ]);
    await prisma.token.deleteMany({
      where: {
        userId: verifyEmailTokenData.userId,
        type: TokenType.VERIFY_EMAIL,
      },
    });
    await userService.updateUserById(verifyEmailTokenData.userId, {
      isEmailVerified: true,
    });
    // Join college after email verification
    if (user) {
      await collegeService.joinCollege(user.email, user.id);
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error.message);
  }
};

export default {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  verifyEmail,
};
