import httpStatus from "http-status";
import ApiError from "../../../src/utils/ApiError";
import userService from "../../../src/services/user.service";
import { Role } from "@prisma/client";
import { prismaMock } from "../../../src/utils/singleton";
import { describe, jest } from "@jest/globals";

describe("User service tests", () => {
  describe("createUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const user = {
      id: "1",
      email: "test@test.edu.in",
      username: "test",
      password: "test123345",
      role: Role.USER,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      collegeId: null,
    };

    it("should create a new user", async () => {
      prismaMock.user.create.mockResolvedValue(user);
      const result = await userService.createUser(
        user.email,
        user.username,
        user.password,
        user.role
      );
      expect(result).toEqual(user);
    });

    it("should throw an error if email already exists", async () => {
      prismaMock.user.findUnique.mockResolvedValue(user);
      await expect(
        userService.createUser(
          user.email,
          user.username,
          user.password,
          user.role
        )
      ).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, "Already registered")
      );
    });

    it("should throw an error if username already exists", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      prismaMock.user.findUnique.mockResolvedValueOnce(user);
      await expect(
        userService.createUser(
          "kk@uem.edu.in",
          user.username,
          user.password,
          user.role
        )
      ).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, "Username already taken")
      );
    });
  });
});
