import { Property } from './property';

export class EntityMeta {
  /***
   * Name for the Entity meta
   */
  name: string;
  /***
   * Display value for the entity
   */
  displayName: string;
  /***
   * Url for the data source
   */
  url: string;
  /***
   * 
   */
  dataUrl: string;
  /***
   * This will be the main selection for the entity.
   */
  title?: string;
  /***
   * The entitry whitch this data will depends on
   */
  dependsOn?: string;
  /**
   * Custom action
   */
  actions?: string[];
  /***
   * Sort
   */
  sorts?: string[];
  /***
   * 
   */
  properties?: Property[];
  /***
   * 
   */
  projections?: {
    [key: string]: Property[];
  };
}
