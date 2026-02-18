import { BaseEntity } from "./base.entity";
import { BaseRepository } from "./base.repository";

export abstract class BaseService<
	TEntity extends BaseEntity<TId>,
	TId = number | string,
	TRepository extends BaseRepository<TEntity, TId> = BaseRepository<TEntity, TId>,
> {
	protected readonly repository: TRepository;

	constructor(repository: TRepository) {
		this.repository = repository;
	}

	public async findAll(): Promise<TEntity[]> {
		return this.repository.findAll();
	}

	public async findById(id: TId): Promise<TEntity | null> {
		return this.repository.findById(id);
	}

	public async create(data: Partial<TEntity>): Promise<TEntity> {
		return this.repository.create(data);
	}

	public async update(id: TId, data: Partial<TEntity>): Promise<TEntity | null> {
		return this.repository.update(id, data);
	}

	public async delete(id: TId): Promise<boolean> {
		return this.repository.delete(id);
	}
}