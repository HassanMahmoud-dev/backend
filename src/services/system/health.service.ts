import os from "os";
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

export async function getSystemMetrics() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsage = (usedMem / totalMem) * 100;

  const cpus = os.cpus();
  const loadAvg = os.loadavg();

  return {
    cpu: {
      model: cpus[0].model,
      cores: cpus.length,
      loadAvg: loadAvg[0], // 1 minute load average
    },
    memory: {
      total: totalMem,
      used: usedMem,
      free: freeMem,
      percentage: memUsage,
    },
    uptime: os.uptime(),
    platform: os.platform(),
    timestamp: getTimestamp(),
  };
}

export async function getDatabaseStatus() {
  // ... existing code ...
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
  getSystemMetrics,
};
