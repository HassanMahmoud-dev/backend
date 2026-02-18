import oracledb from "oracledb";
import { Sequelize } from "sequelize";

import { env } from "./env";

let oraclePool: Sequelize | null = null;

export const initializeOraclePool = async (): Promise<Sequelize | null> => {
  if (oraclePool) {
    return oraclePool;
  }

  if (!env.oracle.isConfigured) {
    console.warn("Oracle database is not configured. Skipping pool initialization.");
    return null;
  }

  const connectString = `${env.oracle.host}:${env.oracle.port}/${env.oracle.name}`;

  oraclePool = new Sequelize(env.oracle.name, env.oracle.user, env.oracle.password, {
    dialect: "oracle" as never,
    dialectModule: oracledb,
    logging: false,
    dialectOptions: {
      connectString,
    },
    pool: {
      min: env.oracle.poolMin,
      max: env.oracle.poolMax,
    },
  });

  return oraclePool;
};

export const testOracleConnection = async (): Promise<boolean> => {
  if (!env.oracle.isConfigured) {
    return false;
  }

  const connection = await initializeOraclePool();

  if (!connection) {
    return false;
  }

  try {
    await connection.authenticate();
    return true;
  } catch {
    return false;
  }
};

export const closeOraclePool = async (): Promise<void> => {
  if (!oraclePool) {
    return;
  }

  await oraclePool.close();
  oraclePool = null;
};
