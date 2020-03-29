import { EntityMeta } from './entity-meta';

export enum RelationshipType {
  enum = 'enum',
  oneToOne = 'oneToOne',
  oneToMany = 'oneToMany'
}

export enum PropertyType {
  string = 'string',
  image = 'image',
  enum = 'enum',
  boolean = 'boolean',
  number = 'number',
  embedded = 'embedded',
  email = 'email',
  object = 'object',
  date = 'date',
  time = 'time'
}

export class Property {
  name: string;
  type: PropertyType;
  required?: boolean;
  generated?: boolean;
  entityMeta?: EntityMeta;
  reference?: string;
  relationshipType?: RelationshipType;
}
