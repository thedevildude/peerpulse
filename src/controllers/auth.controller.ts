import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { User } from "@prisma/client";
import prisma from "../client";
import userService from "../services/user.service";

const register = catchAsync(async (req, res, next) => {
  const { email, username, password } = req.body;
  const user = await userService.createUser(email, username, password);
  res.status(httpStatus.CREATED).send({ user });
});

export default {
  register,
};
