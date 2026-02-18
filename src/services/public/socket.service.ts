import { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { env } from "@/config/env";

/**
 * Creates and configures the Socket.IO server.
 */
export const createSocketServer = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.isWildcardCors ? "*" : env.corsOrigin,
      methods: ["GET", "POST"],
      credentials: !env.isWildcardCors,
    },
  });

  registerSocketHandlers(io);

  return io;
};

/**
 * Registers global socket handlers.
 */
const registerSocketHandlers = (io: Server): void => {
  io.on("connection", (socket) => {
    registerConnectionEvents(socket);
  });
};

/**
 * Registers events for an individual socket connection.
 */
const registerConnectionEvents = (socket: Socket): void => {
  socket.emit("connected", {
    id: socket.id,
    timestamp: new Date().toISOString(),
  });

  registerPingEvent(socket);

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${socket.id} (${reason})`);
  });
};

/**
 * Registers ping/pong event for health checks.
 */
const registerPingEvent = (socket: Socket): void => {
  socket.on("ping", () => {
    socket.emit("pong", { timestamp: new Date().toISOString() });
  });
};
