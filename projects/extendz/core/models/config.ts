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

export class Action {
  id: string;
  entity?: any;
  displayName: string;
  hide?: Hidden;
}

export class Toolbar {
  enabled?: boolean;
  actions?: Action[];
}

export class EntityConfig {
  /***
   * When ever a call is made to get the entity do we allow a projection
   */
  enableProjection?: boolean;
  /***
   * Projection name if allowed
   */
  projection?: string;
  toolbar?: Toolbar;
}

export class SelectConfig {
  projection?: string;
}

export class TableConfig {
  enableAdd?: boolean;
}

/***
 * Entity level configurations
 */
export class Config {
  entity?: EntityConfig;
  select?: SelectConfig;
  table?: TableConfig;
}
