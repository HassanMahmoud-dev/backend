import { Server } from "socket.io";

import { registerConnectionEvents } from "./events/connection.event";

export const registerSocketHandlers = (io: Server): void => {
  io.on("connection", (socket) => {
    registerConnectionEvents(socket);
  });
};
