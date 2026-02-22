import { Model, Op, WhereOptions } from "sequelize";
import InventoryItemCard from "@/models/module/inventory/inventoryItemCard.model";
import { getNextId } from "@/utils/ID";
import {
  formatPaginatedResponse,
  getPaginationOptions,
  PaginationResult,
} from "@/utils/pagination.util";

export async function findAll(
  filters: {
    searchTerm?: string;
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {},
): Promise<PaginationResult<Model>> {
  const { searchTerm, category, status, page, limit } = filters;
  const where: Record<string | symbol, unknown> = {};

  if (searchTerm) {
    where[Op.or] = [
      { ITEM_CODE: { [Op.like]: `%${searchTerm}%` } },
      { ITEM_NAME: { [Op.like]: `%${searchTerm}%` } },
      { UNIT: { [Op.like]: `%${searchTerm}%` } },
    ];
  }

  if (category) {
    where.CATEGORY = { [Op.like]: `%${category}%` };
  }

  if (status) {
    where.IS_ACTIVE = status;
  }

  const paginationOptions = getPaginationOptions(page, limit);

  const { rows, count } = await InventoryItemCard.findAndCountAll({
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
  return InventoryItemCard.findByPk(id) as unknown as Promise<Model | null>;
}

export async function findOne(where: WhereOptions): Promise<Model | null> {
  return InventoryItemCard.findOne({ where }) as unknown as Promise<Model | null>;
}

export async function create(
  data: Record<string, unknown>,
  actorUsername?: string,
): Promise<Model> {
  const existing = await findOne({ ITEM_CODE: data.ITEM_CODE as string });

  if (existing) {
    throw new Error("ITEM_CODE_EXISTS");
  }

  const cardId = await getNextId(InventoryItemCard);

  const newItemCard = await InventoryItemCard.create({
    ...data,
    CARD_ID: cardId,
    CREATED_BY: actorUsername || data.CREATED_BY,
    UPDATED_BY: null,
    IS_ACTIVE: data.IS_ACTIVE || "on",
    QUANTITY: data.QUANTITY ?? 0,
    PURCHASE_PRICE: data.PURCHASE_PRICE ?? 0,
    SALE_PRICE: data.SALE_PRICE ?? 0,
  });

  return newItemCard;
}

export async function update(
  id: string | number,
  data: Record<string, unknown>,
  actorUsername?: string,
): Promise<Model | null> {
  if (data.ITEM_CODE) {
    const existing = (await findOne({ ITEM_CODE: data.ITEM_CODE as string })) as
      | (Model & { CARD_ID?: number })
      | null;

    if (existing && String(existing.getDataValue("CARD_ID")) !== String(id)) {
      throw new Error("ITEM_CODE_EXISTS");
    }
  }

  const updatePayload = {
    ...data,
    UPDATED_BY: actorUsername || data.UPDATED_BY,
  };

  const [affectedCount] = await InventoryItemCard.update(updatePayload, {
    where: {
      [InventoryItemCard.primaryKeyAttribute]: id,
    } as WhereOptions,
  });

  if (affectedCount === 0) {
    return null;
  }

  return findById(id);
}

export async function deleteItemCard(id: string | number): Promise<number> {
  return InventoryItemCard.destroy({
    where: {
      [InventoryItemCard.primaryKeyAttribute]: id,
    } as WhereOptions,
  });
}

export const itemCardService = {
  findAll,
  findById,
  findOne,
  create,
  update,
  delete: deleteItemCard,
};
