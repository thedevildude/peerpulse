import { createServer } from "http";
import app from "./app";
import { Server } from "socket.io";
import logger from "./config/logger";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  logger.info("a user connected");
  socket.on("disconnect", () => {
    logger.info("user disconnected");
  });
});

export default httpServer;
