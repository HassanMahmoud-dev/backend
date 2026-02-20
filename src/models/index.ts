import { Model, ModelStatic } from "sequelize";
import { initializeOraclePool } from "../config/database";
import { initSystemUserModel } from "./systemUser.model";
import { initRefreshTokenModel } from "./refreshToken.model";

export type ModelClass = ModelStatic<Model>;

export const models: ModelClass[] = [];

export const databaseConnectionMessages = {
  success: "Database connection established successfully.",
  failure: "Database connection failed.",
  error: "Error while connecting to database.",
} as const;

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const connection = await initializeOraclePool();

    if (!connection) {
      console.error(databaseConnectionMessages.failure);
      return false;
    }

    await connection.authenticate();
    console.log(databaseConnectionMessages.success);

    initSystemUserModel(connection);
    initRefreshTokenModel(connection);

    await connection.sync({ force: false });
    console.log("Database synchronized automatically.");

    return true;
  } catch (error) {
    console.error(databaseConnectionMessages.error, error);
    return false;
  }
};

export default models;
