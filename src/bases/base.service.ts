import type { Attributes, CreationAttributes, Model, ModelStatic, WhereOptions } from "sequelize";

export abstract class BaseService<T extends Model> {
  constructor(protected readonly model: ModelStatic<T>) {}

  async findAll(where?: WhereOptions<Attributes<T>>): Promise<T[]> {
    return this.model.findAll({ where });
  }

  async findById(id: string | number): Promise<T | null> {
    return this.model.findByPk(id);
  }

  async create(data: CreationAttributes<T>): Promise<T> {
    // Sequelize create method expects data that matches CreationAttributes
    return this.model.create(data);
  }

  async update(id: string | number, data: Partial<Attributes<T>>): Promise<[number, T[]]> {
    const result = await this.model.update(data, {
      where: {
        [this.model.primaryKeyAttribute]: id,
      } as WhereOptions<Attributes<T>>,
      returning: true,
    });

    return result as [number, T[]];
  }

  async delete(id: string | number): Promise<number> {
    return this.model.destroy({
      where: {
        [this.model.primaryKeyAttribute]: id,
      } as WhereOptions<Attributes<T>>,
    });
  }
}
