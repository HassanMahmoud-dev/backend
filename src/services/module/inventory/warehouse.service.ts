import { Model, Op, WhereOptions } from "sequelize";
import InventoryWarehouse from "@/models/module/inventory/inventoryWarehouse.model";
import { getNextId } from "@/utils/ID";
import {
  formatPaginatedResponse,
  getPaginationOptions,
  PaginationResult,
} from "@/utils/pagination.util";

export async function findAll(
  filters: {
    searchTerm?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {},
): Promise<PaginationResult<Model>> {
  const { searchTerm, status, page, limit } = filters;
  const where: Record<string | symbol, unknown> = {};

  if (searchTerm) {
    where[Op.or] = [
      { WAREHOUSE_CODE: { [Op.like]: `%${searchTerm}%` } },
      { WAREHOUSE_NAME: { [Op.like]: `%${searchTerm}%` } },
      { LOCATION: { [Op.like]: `%${searchTerm}%` } },
      { MANAGER_NAME: { [Op.like]: `%${searchTerm}%` } },
    ];
  }

  if (status) {
    where.IS_ACTIVE = status;
  }

  const paginationOptions = getPaginationOptions(page, limit);

  const { rows, count } = await InventoryWarehouse.findAndCountAll({
    where,
    order: [["CREATED_AT", "DESC"]],
    limit: paginationOptions.limit,
    offset: paginationOptions.offset,
  });

  return formatPaginatedResponse<Model>(
    rows as unknown as Model[],
    count,
    paginationOptions.page,
    paginationOptions.limit,
  );
}

export async function findById(id: string | number): Promise<Model | null> {
  return InventoryWarehouse.findByPk(id) as unknown as Promise<Model | null>;
}

export async function findOne(where: WhereOptions): Promise<Model | null> {
  return InventoryWarehouse.findOne({ where }) as unknown as Promise<Model | null>;
}

export async function create(
  data: Record<string, unknown>,
  actorUsername?: string,
): Promise<Model> {
  const existing = await findOne({ WAREHOUSE_CODE: data.WAREHOUSE_CODE as string });

  if (existing) {
    throw new Error("WAREHOUSE_CODE_EXISTS");
  }

  const warehouseId = await getNextId(InventoryWarehouse);

  const newWarehouse = await InventoryWarehouse.create({
    ...data,
    WAREHOUSE_ID: warehouseId,
    CREATED_BY: actorUsername || data.CREATED_BY,
    UPDATED_BY: null,
    IS_ACTIVE: data.IS_ACTIVE || "on",
  });

  return newWarehouse;
}

export async function update(
  id: string | number,
  data: Record<string, unknown>,
  actorUsername?: string,
): Promise<Model | null> {
  if (data.WAREHOUSE_CODE) {
    const existing = (await findOne({ WAREHOUSE_CODE: data.WAREHOUSE_CODE as string })) as
      | (Model & { WAREHOUSE_ID?: number })
      | null;

    if (existing && String(existing.getDataValue("WAREHOUSE_ID")) !== String(id)) {
      throw new Error("WAREHOUSE_CODE_EXISTS");
    }
  }

  const updatePayload = {
    ...data,
    UPDATED_BY: actorUsername || data.UPDATED_BY,
  };

  const [affectedCount] = await InventoryWarehouse.update(updatePayload, {
    where: {
      [InventoryWarehouse.primaryKeyAttribute]: id,
    } as WhereOptions,
  });

  if (affectedCount === 0) {
    return null;
  }

  return findById(id);
}

export async function deleteWarehouse(id: string | number): Promise<number> {
  return InventoryWarehouse.destroy({
    where: {
      [InventoryWarehouse.primaryKeyAttribute]: id,
    } as WhereOptions,
  });
}

export const warehouseService = {
  findAll,
  findById,
  findOne,
  create,
  update,
  delete: deleteWarehouse,
};
