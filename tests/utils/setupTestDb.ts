//import { PrismaClient } from "@prisma/client";
import prisma from "../../src/client";
import { beforeAll, beforeEach, afterAll } from "@jest/globals";

/* const prisma = new PrismaClient({
  datasourceUrl: process.env.TEST_DATABASE_URL,
}); */

const setupTestDB = () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.token.deleteMany();
    await prisma.option.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
};

export default setupTestDB;
