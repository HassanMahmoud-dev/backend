import type { Attributes, CreationAttributes, Model, ModelStatic, WhereOptions } from "sequelize";

export abstract class BaseService<T extends Model> {
  constructor(protected readonly model: ModelStatic<T>) {}

  async findAll(where?: WhereOptions<Attributes<T>>): Promise<T[]> {
    return this.model.findAll({ where });
  }

  async findById(id: string | number): Promise<T | null> {
    return this.model.findByPk(id);
  }

  async findOne(where: WhereOptions<Attributes<T>>): Promise<T | null> {
    return this.model.findOne({ where });
  }

  async create(data: CreationAttributes<T>): Promise<T> {
    return this.model.create(data);
  }

  async update(id: string | number, data: Partial<Attributes<T>>): Promise<T | null> {
    const [affectedCount] = await this.model.update(data, {
      where: {
        [this.model.primaryKeyAttribute]: id,
      } as WhereOptions<Attributes<T>>,
    });

    if (affectedCount > 0) {
      return this.findById(id);
    }
    return null;
  }

  async delete(id: string | number): Promise<number> {
    return this.model.destroy({
      where: {
        [this.model.primaryKeyAttribute]: id,
      } as WhereOptions<Attributes<T>>,
    });
  }
}
