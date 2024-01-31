import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { tokenService, userService } from "../services";
import exclude from "../utils/exclude";

const register = catchAsync(async (req, res, next) => {
  const { email, username, password } = req.body;
  const user = await userService.createUser(email, username, password);
  const userWithoutPassword = exclude(user, [
    "password",
    "createdAt",
    "updatedAt",
  ]);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user: userWithoutPassword, tokens });
});

export default {
  register,
};
