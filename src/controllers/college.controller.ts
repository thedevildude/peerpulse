import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { collegeService } from "../services";
import { User } from "@prisma/client";

const joinCollege = catchAsync(async (req, res) => {
  const user = req.user as User;
  const college = await collegeService.joinCollege(user.email, user.id);
  res.status(httpStatus.CREATED).send(college);
});

export default {
  joinCollege,
};
