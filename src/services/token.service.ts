import jwt from "jsonwebtoken";
import dayjs, { Dayjs } from "dayjs";
import httpStatus from "http-status";
import userService from "./user.service";
import ApiError from "../utils/ApiError";
import { Token, TokenType, User } from "@prisma/client";
import prisma from "../client";
import { AuthTokensResponse } from "../types/response";

/**
 * Generate token
 * @param {string} userId
 * @param {Dayjs} expires
 * @param {TokenType} type
 * @param {string} secret
 * @returns {string}
 */

const generateToken = (
  userId: string,
  expires: Dayjs,
  type: TokenType,
  secret = process.env.JWT_SECRET
): string => {
  const payload = {
    sub: userId,
    iat: dayjs().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret!);
};

/**
 * Save a token
 * @param {string} token
 * @param {string} userId
 * @param {Moment} expires
 * @param {string} type
 * @returns {Promise<Token>}
 */
const saveToken = async (
  token: string,
  userId: string,
  expires: Dayjs,
  type: TokenType
): Promise<Token> => {
  const createdToken = prisma.token.create({
    data: {
      token,
      userId: userId,
      expiresAt: expires.toDate(),
      type,
    },
  });
  return createdToken;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: TokenType): Promise<Token> => {
  const payload = jwt.verify(token, process.env.JWT_SECRET!);
  const userId = payload.sub?.toString();
  const tokenData = await prisma.token.findFirst({
    where: {
      userId,
      token,
      type,
    },
  });
  if (!tokenData) {
    throw new Error("Token not found");
  }
  return tokenData;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<AuthTokensResponse>}
 */

const generateAuthTokens = async (user: User): Promise<AuthTokensResponse> => {
  const accessTokenExpires = dayjs().add(5, "minutes");
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    TokenType.ACCESS
  );

  const refreshTokenExpires = dayjs().add(10, "days");
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    TokenType.REFRESH
  );
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    TokenType.REFRESH
  );
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user: User): Promise<string> => {
  const expires = dayjs().add(5, "minutes");
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    TokenType.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, user.id, expires, TokenType.VERIFY_EMAIL);
  return verifyEmailToken;
};

export default {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateVerifyEmailToken,
};
