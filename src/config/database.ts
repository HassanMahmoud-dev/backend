import { Sequelize } from "sequelize";
import "dotenv/config";
import oracledb from "oracledb";

// إنشاء اتصال Sequelize باستخدام Oracle
const sequelize = new Sequelize(
  process.env.ORACLE_NAME || "",
  process.env.ORACLE_USER || "",
  process.env.ORACLE_PASSWORD || "",
  {
    host: process.env.ORACLE_HOST || "localhost",
    port: parseInt(process.env.ORACLE_PORT || "1521", 10),
    dialect: "oracle",
    timezone: "+02:00",
    dialectModule: oracledb as object,
    logging: false,
    pool: {
      max: 10, // Maximum number of connections in pool
      min: 2, // Minimum number of connections in pool
      acquire: 30000, // Maximum time (ms) to acquire connection before throwing error
      idle: 10000, // Maximum time (ms) a connection can be idle before being released
      evict: 1000, // Time interval (ms) to run eviction to free idle connections
    },
  },
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to Oracle database successful.");
  } catch (error) {
    console.error("Unable to connect to the Oracle database:", error);
  }
})();

export async function testOracleConnection() {
  try {
    await sequelize.authenticate();
    return true;
  } catch {
    return false;
  }
}

export const closeOraclePool = async () => {
  try {
    await sequelize.close();
    console.log("Oracle pool closed.");
  } catch (error) {
    console.error("Error closing Oracle pool:", error);
  }
};

export default sequelize;
