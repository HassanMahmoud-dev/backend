import { DataTypes } from "sequelize";
import sequelize from "@/config/database";

const inventoryWarehouse = sequelize.define(
  "INVENTORY_WAREHOUSES",
  {
    WAREHOUSE_ID: {
      type: DataTypes.NUMBER,
      primaryKey: true,
    },
    WAREHOUSE_CODE: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    WAREHOUSE_NAME: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    LOCATION: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    MANAGER_NAME: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    PHONE: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    IS_ACTIVE: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "on",
    },
    NOTES: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    CREATED_BY: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    UPDATED_BY: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "INVENTORY_WAREHOUSES",
    timestamps: true,
    createdAt: "CREATED_AT",
    updatedAt: "UPDATED_AT",
  },
);

export default inventoryWarehouse;
