import { EntityMeta } from './entity-meta';

export class ImageMeta {
  /***
   * This will be selected as the avatar image
   */
  public avatar?: boolean;
  /***
   * Image cropper enabled?
   */
  public cropper?: boolean;
  /***
   *
   */
  public ratio?: number;
  /***
   *
   */
  public resizeToWidth?: number;
  /***
   *
   */
  public format?: string;
}

export enum RelationshipType {
  enum = 'enum',
  oneToOne = 'oneToOne',
  oneToMany = 'oneToMany',
}

export enum PropertyType {
  boolean = 'boolean',
  date = 'date',
  embedded = 'embedded',
  email = 'email',
  enum = 'enum',
  file = 'file',
  image = 'image',
  number = 'number',
  object = 'object',
  string = 'string',
  time = 'time',
}

export class Property {
  required?: boolean;
  generated?: boolean;
  reference?: string;
  type: PropertyType;
  name: string;
  relationshipType?: RelationshipType;
  entityMeta?: EntityMeta;
  /***
   * Only for the type image.
   */
  imageMeta?: ImageMeta;
}
