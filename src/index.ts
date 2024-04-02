import httpServer from "./socket";
import prisma from "./client";
import logger from "./config/logger";
import { Server } from "http";

let server: Server;

// Server starts when database is connected
prisma.$connect().then(() => {
  logger.info("Connected to Postgresql database");
  server = httpServer.listen(5000, () => {
    logger.info("Server running at http://localhost:5000");
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      prisma.$disconnect();
      process.exit(1);
    });
  } else {
    prisma.$disconnect();
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
