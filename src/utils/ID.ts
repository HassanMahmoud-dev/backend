import { Attributes, Model, ModelStatic } from "sequelize";

/**
 * Generates the next numeric ID for a given Sequelize model.
 * It finds the maximum value in the specified column and increments it by 1.
 * If no records exist, it starts from 1.
 *
 * @param model - The Sequelize model class
 * @param idColumn - The name of the ID column (defaults to the model's primary key attribute)
 * @returns The next numeric ID
 */
export const getNextId = async <T extends Model>(
  model: ModelStatic<T>,
  idColumn?: string,
): Promise<number> => {
  const column = (idColumn || model.primaryKeyAttribute) as keyof Attributes<T>;

  // Use model.max to find the highest current value in the specified column
  const maxId = await model.max(column);

  // If no records exist, start with 1, otherwise increment max value by 1
  if (maxId === null || maxId === undefined) {
    return 1;
  }

  return (maxId as number) + 1;
};
