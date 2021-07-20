import { Action, Hidden, InlineAction } from './config';
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
  badge = 'badge',
  checkbox = 'checkbox',
  color = 'color',
  date = 'date',
  display = 'display',
  email = 'email',
  embedded = 'embedded',
  embeddedList = 'embeddedList',
  enum = 'enum',
  file = 'file',
  image = 'image',
  imageList = 'imageList',
  index = 'index',
  matrix = 'matrix',
  money = 'money',
  number = 'number',
  object = 'object',
  objectList = 'objectList',
  phone = 'phone',
  spacer = 'spacer',
  string = 'string',
  tabs = 'tabs',
  time = 'time',
  unit = 'unit',
}

export enum MutationType {
  Update = 'Update',
  Delete = 'Delete',
  Disable = 'Disable',
  Enable = 'Enable',
}

export class Mutate {
  type?: MutationType;
  from?: string;
  /*** extract children value rather than direct one */
  deep?: boolean;
  to?: string[];
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
    value?: string;
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

  /*** Mutations on form */
  mutations?: {
    [key: string]: Mutate[];
  };

  events?: {
    [key: string]: Mutate[];
  };

  /*** Validations */
  validations?: PropertyValidation[];

  actions: Action[];

  /*** If false no floatigns */
  labelFloat: boolean;

  /*** Inline edit enable */
  inlineEdit?: {
    enabled?: boolean;
    showAlways?: boolean;
    fxLayoutAlign?: string;
    header: {
      title: {
        text?: string;
      };
      subTitle: {
        text?: string;
        url: string;
      };
    };
    action: InlineAction;
  };

  /*** config */
  config?: {
    select?: {
      search?: {
        show?: boolean;
      };
      add?: {
        show?: boolean;
      };
      more?: {
        show?: boolean;
      };
      autocomplete: boolean;
      displayFunction: {
        feilds: string[];
        delimiter: string;
      };
    };
  };

  /** Hide based on logic */
  hide?: Hidden;
}
