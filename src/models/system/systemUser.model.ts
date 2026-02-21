import { DataTypes } from "sequelize";
import sequelize from "@/config/database";
import { ModelWithAssociate } from "@/types/models";

const SYSTEM_USERS = sequelize.define(
  "SYSTEM_USERS",
  {
    USER_ID: {
      type: DataTypes.NUMBER,
      primaryKey: true,
    },
    USERNAME: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    EMAIL: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    PASSWORD: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    FULL_NAME: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    PHONE_NUMBER: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    ROLE: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "employee",
    },
    AVATAR: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    /** مفعل = "on"، غير مفعل = "off" */
    IS_ACTIVE: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "on",
    },
    LAST_LOGIN: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    CREATED_BY: {
      type: DataTypes.NUMBER,
      allowNull: true,
      references: {
        model: "SYSTEM_USERS",
        key: "USER_ID",
      },
    },
    UPDATED_BY: {
      type: DataTypes.NUMBER,
      allowNull: true,
      references: {
        model: "SYSTEM_USERS",
        key: "USER_ID",
      },
    },
  },
  {
    tableName: "SYSTEM_USERS",
    timestamps: true,
    createdAt: "CREATED_AT",
    updatedAt: "UPDATED_AT",
  },
);

(SYSTEM_USERS as ModelWithAssociate).associate = (models) => {
  SYSTEM_USERS.hasMany(models.SystemRefreshToken, {
    foreignKey: "USER_ID",
    as: "refreshTokens",
  });
};

export default SYSTEM_USERS;
