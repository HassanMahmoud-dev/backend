import { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { env } from "@/config/env";

let io: Server | null = null;

function registerPingEvent(socket: Socket): void {
  socket.on("ping", () => {
    socket.emit("pong", { timestamp: new Date().toISOString() });
  });
}

function registerConnectionEvents(socket: Socket): void {
  socket.emit("connected", {
    id: socket.id,
    timestamp: new Date().toISOString(),
  });

  registerPingEvent(socket);

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${socket.id} (${reason})`);
  });
}

function registerSocketHandlers(server: Server): void {
  server.on("connection", (socket) => {
    registerConnectionEvents(socket);
  });
}

export const createSocketServer = (httpServer: HttpServer): Server => {
  if (!io) {
    io = new Server(httpServer, {
      cors: {
        origin: env.isWildcardCors ? "*" : env.corsOrigin,
        methods: ["GET", "POST"],
        credentials: !env.isWildcardCors,
      },
    });

    registerSocketHandlers(io);
  }
  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
