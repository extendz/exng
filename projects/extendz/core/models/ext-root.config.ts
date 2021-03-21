import { InjectionToken } from '@angular/core';

export const EXT_ROOT_CONFIG = new InjectionToken('EXT_ROOT_CONFIG');

export interface ExtRootConfig {
  svgIconSet: string;
  modelsJson: string;
}
