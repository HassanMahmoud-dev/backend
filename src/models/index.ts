import { initializeOraclePool, testOracleConnection } from "../config/database";

export type ModelClass = new (...args: unknown[]) => unknown;

export const models: ModelClass[] = [];

export const databaseConnectionMessages = {
	success: "Database connection established successfully.",
	failure: "Database connection failed.",
	error: "Error while connecting to database.",
} as const;

export const checkDatabaseConnection = async (): Promise<boolean> => {
	try {
		await initializeOraclePool();
		const isDatabaseConnected = await testOracleConnection();

		if (isDatabaseConnected) {
			console.log(databaseConnectionMessages.success);
		} else {
			console.error(databaseConnectionMessages.failure);
		}

		return isDatabaseConnected;
	} catch (error) {
		console.error(databaseConnectionMessages.error, error);
		return false;
	}
};

export default models;
