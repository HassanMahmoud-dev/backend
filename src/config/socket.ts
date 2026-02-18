import { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

import { env } from "./env";
import { registerSocketHandlers } from "@/services/socket";

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
