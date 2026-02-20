import { testOracleConnection } from "@/config/database";

function getTimestamp() {
  return new Date().toISOString();
}

export function getSystemStatus() {
  return {
    service: "backend",
    status: "online",
    timestamp: getTimestamp(),
  };
}

export async function getDatabaseStatus() {
  try {
    const isConnected = await testOracleConnection();

    return {
      ok: isConnected,
      database: "oracle",
      timestamp: getTimestamp(),
      ...(isConnected ? {} : { message: "Database connection failed" }),
    };
  } catch (error) {
    console.error("Health Check DB Error:", error);
    return {
      ok: false,
      database: "oracle",
      timestamp: getTimestamp(),
      message: "Database connection failed",
    };
  }
}

export const healthService = {
  getSystemStatus,
  getDatabaseStatus,
};
