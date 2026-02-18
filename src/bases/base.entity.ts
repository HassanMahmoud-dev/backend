export abstract class BaseEntity<TId = number | string> {
	public id?: TId;
	public createdAt?: Date;
	public updatedAt?: Date;

	constructor(payload: Partial<BaseEntity<TId>> = {}) {
		Object.assign(this, payload);
	}

	public toJSON(): Record<string, unknown> {
		return Object.assign({}, this) as Record<string, unknown>;
	}
}