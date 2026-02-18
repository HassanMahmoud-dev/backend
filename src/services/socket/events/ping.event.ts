import { Socket } from "socket.io";

export const registerPingEvent = (socket: Socket): void => {
  socket.on("ping", () => {
    socket.emit("pong", { timestamp: new Date().toISOString() });
  });
};
