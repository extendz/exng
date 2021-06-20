import { InjectionToken } from '@angular/core';
import { ExtRootConfig } from './ext-root.config';

export const EXT_ENTITY_CONFIG = new InjectionToken('EXT_ENTITY_CONFIG');

export interface ExtEntityConfig extends ExtRootConfig {
  svgIconSet: string;
  modelsJson: string;
  placeholderImage?: string;
  unitOfMeasurement?: {
    model: string;
    defaultUnit?: string;
  };
  phone?: {
    model: string;
    defaultPhoneCode?: string;
  };
  currency?: {
    model: string;
    /**
     *  ISO currency code
     * @see https://en.wikipedia.org/wiki/ISO_4217
     */
    defaultCurrency?: string;
  };
}
