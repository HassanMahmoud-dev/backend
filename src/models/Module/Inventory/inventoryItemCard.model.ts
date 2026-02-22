import { DataTypes } from "sequelize";
import sequelize from "@/config/database";

const inventoryItemCard = sequelize.define(
	"INVENTORY_ITEM_CARDS",
	{
		CARD_ID: {
			type: DataTypes.NUMBER,
			primaryKey: true,
		},
		ITEM_CODE: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		},
		ITEM_NAME: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		UNIT: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		CATEGORY: {
			type: DataTypes.STRING(100),
			allowNull: true,
		},
		PURCHASE_PRICE: {
			type: DataTypes.DECIMAL(18, 2),
			allowNull: true,
			defaultValue: 0,
		},
		SALE_PRICE: {
			type: DataTypes.DECIMAL(18, 2),
			allowNull: true,
			defaultValue: 0,
		},
		QUANTITY: {
			type: DataTypes.NUMBER,
			allowNull: true,
			defaultValue: 0,
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
		tableName: "INVENTORY_ITEM_CARDS",
		timestamps: true,
		createdAt: "CREATED_AT",
		updatedAt: "UPDATED_AT",
	},
);

export default inventoryItemCard;
