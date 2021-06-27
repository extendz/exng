import { Property } from '../models/property';

export enum Assert {
  NotNull = 'NotNull',
  Null = 'Null',
}
export class Hidden {
  property: string;
  value?: string;
  matchTo?: string;
  assert?: Assert;
}

export interface Action {
  id: string;
  entity?: any;
  /*** Display text for the action */
  displayName?: string;
  hide?: Hidden;
  color?: 'primary' | 'accent' | 'warn';
  icon?: string;
}

export interface TabAction extends Action {
  /*** Reference object */
  reference?: string;
  /*** Selection type */
  multiSelect?: boolean;
  /*** params */
  params?: Map<string, string>;
}

export class Toolbar {
  enabled?: boolean;
  actions?: Action[];
}

export class EntityConfig {
  /*** When ever a call is made to get the entity do we allow a projection */
  enableProjection?: boolean;

  /*** * Projection name if allowed */
  projection?: string;

  /*** Toolbar customization on entity */
  toolbar?: Toolbar;
}

export class SelectConfig {
  projection?: string;
}

export class TableConfig {
  enableAdd?: boolean;
}

export class ExpandFilter {
  key: string = 'id';
  value: string;
}

export class Expand {
  displayName: string;
  property: Property;
  filter?: ExpandFilter;
}

export class DataTableConfig {
  /*** Show a dialog to add data */
  simpleAdd?: boolean;
  expands: Expand[];
}

export class ExpandConfig {
  projection?: string;
}

export interface ToolbarConfig {
  enabled?: boolean;
  color?: 'primary' | 'accent' | 'warn';
  fab?: Action;
}

/***
 * Entity level configurations
 */
export class Config {
  dataTable?: DataTableConfig;
  entity?: EntityConfig;
  select?: SelectConfig;
  table?: TableConfig;
  expand?: ExpandConfig;
  toolbar?: ToolbarConfig;
}
