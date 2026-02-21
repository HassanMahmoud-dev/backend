import type { Model, ModelStatic } from 'sequelize';

export type ModelsRecord = Record<string, ModelStatic<Model>>;

/** Extends ModelStatic so models can optionally define an associate function (used by models/index). */
export interface ModelWithAssociate extends ModelStatic<Model> {
  associate?: (models: Record<string, ModelStatic<Model>>) => void;
}
