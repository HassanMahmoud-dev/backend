import sequelize from "@/config/database";
import type { ModelWithAssociate } from "@/types/models";
import SystemUser from "./systemUser.model";
import SystemRefreshToken from "./systemRefreshToken.model";
const models: Record<string, ModelWithAssociate> = {
  SystemUser,
  SystemRefreshToken,
};
// Initialize associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export const checkDatabaseConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

export const syncDatabase = async ({ force = false }: { force?: boolean } = {}): Promise<void> => {
  try {
    await checkDatabaseConnection();
    await sequelize.sync({ force });
    if (force) {
      console.log("Database synchronized with force: true (Tables recreated).");
    } else {
      console.log("Database synchronized without force.");
    }
  } catch (error) {
    console.error("Database sync failed:", error);
  }
};

export default { ...models, syncDatabase, checkDatabaseConnection };
