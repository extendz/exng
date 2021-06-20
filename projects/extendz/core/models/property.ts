import { Command } from './command';
import { EntityMeta } from './entity-meta';

export class ImageMeta {
  /*** This will be selected as the avatar image */
  avatar?: boolean;

  /*** Image cropper enabled */
  cropper?: boolean;

  /*** Image crop width to height ratio */
  ratio?: number;

  /*** Image resized to given width */
  resizeToWidth?: number;

  /*** Image format need to be cropped */
  format?: string;
}

export class MatrixDefinition {
  static: MatrixRow[];
  rows: MatrixRow[];
}

export enum Operation {
  delete = 'delete',
  remove = 'remove',
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
  checkbox = 'checkbox',
  embedded = 'embedded',
  embeddedList = 'embeddedList',
  email = 'email',
  index = 'index',
  enum = 'enum',
  file = 'file',
  image = 'image',
  imageList = 'imageList',
  number = 'number',
  object = 'object',
  objectList = 'objectList',
  string = 'string',
  time = 'time',
  matrix = 'matrix',
  money = 'money',
  color = 'color',
  unit = 'unit',
  phone = 'phone',
  tabs = 'tabs',
  spacer = 'spacer',
}

export enum MutationType {
  Update,
  Delete,
}

export class Mutate {
  from?: MutationType;
  to?: string;
}

export enum PropertyValidationType {
  Required = 'Required',
  Email = 'Email',
  MinValue = 'MinValue',
  MaxValue = 'MaxValue',
  MinLength = 'MinLength',
  MaxLength = 'MaxLength',
}

export class PropertyValidation {
  type?: PropertyValidationType;
  value?: string;
}

export class Property {
  /*** mark as mandatory for the form */
  required?: boolean;

  /*** Generated value, input will be disabled*/
  generated?: boolean;

  /*** Name of the property  */
  name: string;

  /*** Will show as propery name, if not defined the name is used */
  displayName?: boolean;

  /*** Refence for object  */
  reference?: string;

  /*** */
  type: PropertyType;

  /*** Meta data of the entity */
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

  tabs?: Property[];

  /*** Default value if not present */
  default: any;

  /*** Actions associalted with property */
  operation: Operation;

  /*** Mutations on form */
  mutations?: {
    [key: string]: Mutate[];
  };

  /*** Validations */
  validations?: PropertyValidation[];

  /*** config */
  config?: {
    select?: {
      allowSearch: boolean;
      autocomplete: boolean;
      displayFunction: {
        feilds: string[];
        delimiter: string;
      };
    };
  };
}
