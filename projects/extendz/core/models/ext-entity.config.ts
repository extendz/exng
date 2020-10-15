import { InjectionToken } from '@angular/core';

export const EXT_ENTITY_CONFIG = new InjectionToken('EXT_ENTITY_CONFIG');

export interface ExtEntityConfig {
  placeholderImage?: string;
}
