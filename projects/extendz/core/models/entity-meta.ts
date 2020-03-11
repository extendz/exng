import { Property } from './property';

export class EntityMeta {
  name: string;
  displayName: string;
  url: string;
  dataUrl: string;
  title?: string;
  /***
   * The entitry whitch this data will depends on
   */
  dependsOn?: string;
  /***
   * if available then things will be filted
   */
  /**
   * Custom action
   */
  actions?: string[];

  /***
   * Sort
   */
  sorts?: string[];
  properties?: Property[];
  projections?: {
    [key: string]: Property[];
  };
}
