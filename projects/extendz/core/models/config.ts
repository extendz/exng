export class EntityConfig {
  /***
   * When ever a call is made to get the entity do we allow a projection
   */
  enableProjection?: boolean;
  /***
   * Projection name if allowed
   */
  projection?: string;
}

/***
 * Entity level configurations
 */
export class Config {
  entity?: EntityConfig;
}
