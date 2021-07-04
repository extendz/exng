import { InjectionToken } from '@angular/core';
import { Cache } from '../cache/chache';

export const EXT_ROOT_CONFIG = new InjectionToken('EXT_ROOT_CONFIG');

export interface ExtRootConfig {
  svgIconSet: string;
  modelsJson: string;
  idFeild?: string;

  /*** Location for additinal infomation on enetity meta */
  partials?: string;

  /*** Cache for models and network requests */
  cache?: Cache;
}
