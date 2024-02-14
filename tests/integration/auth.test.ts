import request from "supertest";
import app from "../../src/app";
import { faker } from "@faker-js/faker";
import setupTestDB from "../utils/setupTestDb";
import httpStatus from "http-status";
import prisma from "../../src/client";
import { Role, TokenType, User } from "@prisma/client";
import { describe, beforeEach, test, expect, jest } from "@jest/globals";

setupTestDB();

describe("Auth routes", () => {
  describe("POST /api/v1/auth/register", () => {
    let newUser: {
      email: string;
      password: string;
      username: string;
    };
    beforeEach(() => {
      newUser = {
        email: "kk@uem.edu.in",
        password: "password",
        username: faker.internet.userName(),
      };
    });

    test("should return 201 and successfully register user if request data is ok", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty("password");
      expect(res.body.user).not.toHaveProperty("password");
      expect(res.body.user).toEqual({
        id: expect.anything(),
        collegeId: null,
        username: newUser.username,
        email: newUser.email,
        role: Role.USER,
        isEmailVerified: false,
      });

      const dbUser = await prisma.user.findUnique({
        where: { id: res.body.user.id },
      });
      expect(dbUser).toBeDefined();
      expect(dbUser?.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({
        collegeId: null,
        username: newUser.username,
        email: newUser.email,
        role: Role.USER,
        isEmailVerified: false,
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });
  });
});
