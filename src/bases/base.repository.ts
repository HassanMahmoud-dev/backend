import { BaseEntity } from "./base.entity";

export abstract class BaseRepository<
	TEntity extends BaseEntity<TId>,
	TId = number | string,
> {
	public abstract findAll(): Promise<TEntity[]>;

	public abstract findById(id: TId): Promise<TEntity | null>;

	public abstract create(data: Partial<TEntity>): Promise<TEntity>;

	public abstract update(id: TId, data: Partial<TEntity>): Promise<TEntity | null>;

	public abstract delete(id: TId): Promise<boolean>;
}