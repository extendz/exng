import { Property } from './property';
import { Search } from './search';
import { Config } from './config';
import { Command } from './command';


export class Validation {
  on?: string;
  value?: string;
  disable?: string[];
}

export class EntityMeta {
  /**
   * Custom action
   */
  actions?: string[];
  /***
   *
   */
  dataUrl?: string;
  /***
   *
   */
  projections?: {
    [key: string]: Property[];
  };
  /*** */
  commands?: {
    [key: string]: Command;
  };
  /***
   *
   */
  properties?: {
    [key: string]: Property;
  };
  /***
   * Display value for the entity
   */
  displayName?: string;
  /***
   * Name for the Entity meta
   */
  name?: string;
  /***
   * Sort
   */
  sorts?: string[];
  /***
   * The entitry whitch this data will depends on
   */
  dependsOn?: string;
  /***
   * This will be the main selection for the entity.
   */
  title?: string;
  /***
   * Url for the data source
   */
  url?: string;
  /***
   * html template
   * TODO: this should be defined ones
   */
  view?: string;
  /***
   *
   */
  search?: Search;
  /***
   *
   */
  config?: Config;

  /*** Validators */
  validators?: Validation[];


}
