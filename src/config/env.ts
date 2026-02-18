import dotenv from "dotenv";

dotenv.config();

const parsedPort = Number(process.env.PORT ?? 5000);
const parsedRateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000);
const parsedRateLimitMax = Number(process.env.RATE_LIMIT_MAX ?? 100);
const parsedOraclePoolMin = Number(process.env.ORACLE_POOL_MIN ?? 1);
const parsedOraclePoolMax = Number(process.env.ORACLE_POOL_MAX ?? 10);
const parsedOraclePoolIncrement = Number(process.env.ORACLE_POOL_INCREMENT ?? 1);
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const oracleUser = process.env.ORACLE_USER ?? "";
const oraclePassword = process.env.ORACLE_PASSWORD ?? "";
const oracleConnectString = process.env.ORACLE_CONNECT_STRING ?? "";

export const env = {
  port: Number.isNaN(parsedPort) ? 5000 : parsedPort,
  corsOrigin,
  isWildcardCors: corsOrigin === "*",
  rateLimitWindowMs: Number.isNaN(parsedRateLimitWindowMs)
    ? 15 * 60 * 1000
    : parsedRateLimitWindowMs,
  rateLimitMax: Number.isNaN(parsedRateLimitMax) ? 100 : parsedRateLimitMax,
  oracle: {
    user: oracleUser,
    password: oraclePassword,
    connectString: oracleConnectString,
    poolMin: Number.isNaN(parsedOraclePoolMin) ? 1 : parsedOraclePoolMin,
    poolMax: Number.isNaN(parsedOraclePoolMax) ? 10 : parsedOraclePoolMax,
    poolIncrement: Number.isNaN(parsedOraclePoolIncrement) ? 1 : parsedOraclePoolIncrement,
    isConfigured: Boolean(oracleUser && oraclePassword && oracleConnectString),
  },
};
