import { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";

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

  socket.on("authenticate", (userId: number | string) => {
    socket.join(`user_${userId}`);
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
    const corsOrigin = process.env.CORS_ORIGIN || "*";
    const isWildcardCors = corsOrigin === "*";

    io = new Server(httpServer, {
      cors: {
        origin: isWildcardCors ? "*" : corsOrigin,
        methods: ["GET", "POST"],
        credentials: !isWildcardCors,
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
