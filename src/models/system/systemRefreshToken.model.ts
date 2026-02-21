import { DataTypes } from "sequelize";
import sequelize from "@/config/database";
import { ModelWithAssociate } from "@/types/models";

const SYSTEM_REFRESH_TOKENS = sequelize.define(
  "SYSTEM_REFRESH_TOKENS",
  {
    TOKEN_ID: {
      type: DataTypes.NUMBER,
      primaryKey: true,
    },
    TOKEN: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    USER_ID: {
      type: DataTypes.NUMBER,
      allowNull: false,
      references: {
        model: "SYSTEM_USERS",
        key: "USER_ID",
      },
    },
    EXPIRES_AT: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    DEVICE_INFO: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    IP_ADDRESS: {
      type: DataTypes.STRING(45),
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
    tableName: "SYSTEM_REFRESH_TOKENS",
    timestamps: true,
    createdAt: "CREATED_AT",
    updatedAt: "UPDATED_AT",
  },
);

(SYSTEM_REFRESH_TOKENS as ModelWithAssociate).associate = (models) => {
  SYSTEM_REFRESH_TOKENS.belongsTo(models.SystemUser, {
    foreignKey: "USER_ID",
    as: "user",
  });
};

export default SYSTEM_REFRESH_TOKENS;
