import { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { env } from "@/config/env";

export class SocketService {
  private io: Server;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: env.isWildcardCors ? "*" : env.corsOrigin,
        methods: ["GET", "POST"],
        credentials: !env.isWildcardCors,
      },
    });

    this.registerSocketHandlers();
  }

  public getIO(): Server {
    return this.io;
  }

  private registerSocketHandlers(): void {
    this.io.on("connection", (socket) => {
      this.registerConnectionEvents(socket);
    });
  }

  private registerConnectionEvents(socket: Socket): void {
    socket.emit("connected", {
      id: socket.id,
      timestamp: new Date().toISOString(),
    });

    this.registerPingEvent(socket);

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
    });
  }

  private registerPingEvent(socket: Socket): void {
    socket.on("ping", () => {
      socket.emit("pong", { timestamp: new Date().toISOString() });
    });
  }
}

export const createSocketServer = (httpServer: HttpServer): SocketService => {
  return new SocketService(httpServer);
};
