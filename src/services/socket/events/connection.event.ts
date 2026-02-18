import { Socket } from "socket.io";

import { registerPingEvent } from "./ping.event";

export const registerConnectionEvents = (socket: Socket): void => {
  socket.emit("connected", {
    id: socket.id,
    timestamp: new Date().toISOString(),
  });

  registerPingEvent(socket);

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${socket.id} (${reason})`);
  });
};
