import oracledb from "oracledb";

import { env } from "./env";

type OraclePoolLike = {
  close: (drainTime?: number) => Promise<void>;
};

type OracleConnectionLike = {
  execute: (statement: string) => Promise<unknown>;
  close: () => Promise<void>;
};

let oraclePool: OraclePoolLike | null = null;

export const initializeOraclePool = async (): Promise<OraclePoolLike | null> => {
  if (oraclePool) {
    return oraclePool;
  }

  if (!env.oracle.isConfigured) {
    console.warn("Oracle database is not configured. Skipping pool initialization.");
    return null;
  }

  oraclePool = await oracledb.createPool({
    user: env.oracle.user,
    password: env.oracle.password,
    connectString: env.oracle.connectString,
    poolMin: env.oracle.poolMin,
    poolMax: env.oracle.poolMax,
    poolIncrement: env.oracle.poolIncrement,
  });

  return oraclePool;
};

export const testOracleConnection = async (): Promise<boolean> => {
  if (!env.oracle.isConfigured) {
    return false;
  }

  await initializeOraclePool();

  let connection: OracleConnectionLike | undefined;

  try {
    connection = await oracledb.getConnection();

    if (!connection) {
      return false;
    }

    await connection.execute("SELECT 1 FROM DUAL");
    return true;
  } catch {
    return false;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

export const closeOraclePool = async (): Promise<void> => {
  if (!oraclePool) {
    return;
  }

  await oraclePool.close(10);
  oraclePool = null;
};
