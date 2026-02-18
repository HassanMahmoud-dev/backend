import { createServer } from "node:http";

import app from "./app";
import { closeOraclePool } from "./config/database";
import { env } from "./config/env";
import { checkDatabaseConnection } from "./models";
import { createSocketServer } from "./services/public/socket.service";

const httpServer = createServer(app);
createSocketServer(httpServer);

let isShuttingDown = false;

const shutdown = (signal: NodeJS.Signals) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${signal} received. Shutting down server...`);
  httpServer.close(async () => {
    await closeOraclePool();
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const startServer = async (): Promise<void> => {
  await checkDatabaseConnection();

  httpServer.listen(env.port, () => {
    console.log(`Server running on http://192.168.1.13:${env.port}`);
  });
};

void startServer();
