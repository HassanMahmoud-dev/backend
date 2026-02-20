import { DataTypes, Model, Sequelize } from "sequelize";
import { models } from "./index";

export interface RefreshTokenAttributes {
  TOKEN_ID?: number;
  TOKEN: string;
  USER_ID: number;
  EXPIRES_AT: Date;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

export class RefreshToken extends Model<RefreshTokenAttributes> implements RefreshTokenAttributes {
  declare TOKEN_ID: number;
  declare TOKEN: string;
  declare USER_ID: number;
  declare EXPIRES_AT: Date;
  declare readonly CREATED_AT: Date;
  declare readonly UPDATED_AT: Date;
}

export const initRefreshTokenModel = (sequelize: Sequelize) => {
  RefreshToken.init(
    {
      TOKEN_ID: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true,
      },
      TOKEN: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      USER_ID: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      EXPIRES_AT: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      CREATED_AT: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      UPDATED_AT: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "REFRESH_TOKENS",
      timestamps: true,
      createdAt: "CREATED_AT",
      updatedAt: "UPDATED_AT",
    },
  );

  models.push(RefreshToken);
};
