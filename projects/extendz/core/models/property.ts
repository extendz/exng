import { Command } from './command';
import { EntityMeta } from './entity-meta';

export class ImageMeta {
  /*** This will be selected as the avatar image */
  public avatar?: boolean;

  /*** Image cropper enabled */
  public cropper?: boolean;

  /*** Image crop width to height ratio */
  public ratio?: number;

  /*** Image resized to given width */
  public resizeToWidth?: number;

  /*** Image format need to be cropped */
  public format?: string;
}

export class MatrixDefinition {
  static: MatrixRow[];
  rows: MatrixRow[];
}

export class MatrixRow {
  property: Property;
  /*** If there is an unit to select,then current selected will be this */
  unit?: any;
  values: any[];
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
  embeddedList = 'embeddedList',
  email = 'email',
  enum = 'enum',
  file = 'file',
  image = 'image',
  number = 'number',
  object = 'object',
  objectList = 'objectList',
  string = 'string',
  time = 'time',
  matrix = 'matrix',
  money = 'money',
  color = 'color',
  unit = 'unit',
}

export class Property {
  /***
   *
   */
  required?: boolean;

  /***
   *
   */
  generated?: boolean;

  /***
   *
   */
  reference?: string;

  /*** */
  type: PropertyType;

  /***
   *
   */
  name: string;

  /***
   *
   */
  entityMeta?: EntityMeta;

  /***
   * Only for the type image.
   */
  imageMeta?: ImageMeta;

  /** Default seach in data table */
  defaultSearch?: boolean;

  /*** */
  command?: Command;

  /** Matrix definition */
  matrixDefinition?: MatrixDefinition;

  /** Reverse relataing property name */
  mappedBy?: string;

  /*** Properties that can be mesured with units will have options to select.
   * Ex: LKR 200
   * Ex: 200 KG
   */
  units?: string[];

  width?: {
    xs?: string;
    md?: string;
    lg?: string;
  };

  /*** Field name used on reference display */
  displayField?: string;

  /*** Before saving the parent property this property need to be saved and passed on  */
  preSave?: boolean;
}
