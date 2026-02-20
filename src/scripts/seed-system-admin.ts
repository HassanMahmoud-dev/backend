import bcrypt from "bcryptjs";
import { initializeOraclePool, closeOraclePool } from "../config/database";
import { initSystemUserModel, SystemUser } from "../models/systemUser.model";
import { getNextId } from "../utils/ID";

const seedSystemAdmin = async () => {
  try {
    const sequelize = await initializeOraclePool();
    if (!sequelize) {
      console.error("Failed to initialize database connection.");
      return;
    }

    initSystemUserModel(sequelize);

    const adminExists = await SystemUser.findOne({ where: { USERNAME: "admin" } });
    if (adminExists) {
      console.log("Admin user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const nextId = await getNextId(SystemUser, "USER_ID");

    await SystemUser.create({
      USER_ID: nextId,
      FULL_NAME: "Admin",
      USERNAME: "admin",
      PASSWORD: hashedPassword,
      ROLE: "admin",
      PHONE_NUMBER: "01000000000",
      EMAIL: "hassan@dev.com",
    });

    console.log("Admin user seeded successfully.");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    await closeOraclePool();
  }
};

seedSystemAdmin();
