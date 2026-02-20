import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { models } from "./index";

export interface SystemUserAttributes {
  USER_ID: number;
  USERNAME: string;
  PASSWORD?: string;
  FULL_NAME?: string;
  PHONE_NUMBER?: string;
  EMAIL?: string;
  AVATAR?: string | null;
  ROLE: "admin" | "employee";
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

export type SystemUserCreationAttributes = Optional<
  SystemUserAttributes,
  "USER_ID" | "CREATED_AT" | "UPDATED_AT"
>;

export class SystemUser
  extends Model<SystemUserAttributes, SystemUserCreationAttributes>
  implements SystemUserAttributes
{
  declare USER_ID: number;
  declare USERNAME: string;
  declare PASSWORD: string;
  declare FULL_NAME: string;
  declare PHONE_NUMBER: string;
  declare EMAIL: string;
  declare AVATAR: string | null;
  declare ROLE: "admin" | "employee";
  declare readonly CREATED_AT: Date;
  declare readonly UPDATED_AT: Date;
}

export const initSystemUserModel = (sequelize: Sequelize) => {
  SystemUser.init(
    {
      USER_ID: {
        type: DataTypes.NUMBER,
        primaryKey: true,
      },
      USERNAME: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      PASSWORD: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      FULL_NAME: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PHONE_NUMBER: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      EMAIL: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      AVATAR: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ROLE: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["admin", "employee"]],
        },
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
      tableName: "SYSTEM_USERS",
      timestamps: true,
      createdAt: "CREATED_AT",
      updatedAt: "UPDATED_AT",
    },
  );

  models.push(SystemUser);
};
