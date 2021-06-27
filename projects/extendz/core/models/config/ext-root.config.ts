import { InjectionToken } from '@angular/core';

export const EXT_ROOT_CONFIG = new InjectionToken('EXT_ROOT_CONFIG');

export interface ExtRootConfig {
  svgIconSet: string;
  modelsJson: string;
  idFeild?: string;
  /*** Location for additinal infomation on enetity meta */
  partials?: string;
}
