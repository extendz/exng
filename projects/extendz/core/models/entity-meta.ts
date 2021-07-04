import { Command } from './command';
import { Assert, Config } from './config';
import { Property } from './property';
import { Search } from './search';

export class Validation {
  on?: string;
  value?: string;
  disable?: string[];
  assert?: Assert;
}

export class EventAction {
  action?: string;
}

export enum EntityEventType {
  LoadStarted = 'LoadStarted',
  Saved = 'Saved',
  RowAdded = 'RowAdded',
  RowRemoved = 'RowRemoved',
  RowUpdated = 'RowUpdated',
}

export interface EntityEvent {
  type: EntityEventType;
  payload?: any;
  /*** Index number in case of row related event */
  index?: number;
}

export class EntityMeta {
  /*** Custom action */
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

  /*** Configurations for different parts*/
  config?: Config;

  /*** Validators */
  validators?: Validation[];

  /*** Hide visually */
  hidden?: boolean;

  /*** Cache */
  cache: {
    model?: boolean;

    /*** Refernce models need to cache along */
    references?: string[];

    network?: boolean;

    /*** */
    endPoints?: string[];
  };
}
