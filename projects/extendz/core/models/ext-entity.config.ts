import { InjectionToken } from '@angular/core';

export const EXT_ENTITY_CONFIG = new InjectionToken('EXT_ENTITY_CONFIG');

export interface ExtEntityConfig {
  svgIconSet: string;
  modelsJson: string;
  placeholderImage?: string;
  currency: {
    model: string;
    /**
     *  ISO currency code
     * @see https://en.wikipedia.org/wiki/ISO_4217
     */
    defaultCurrency?: string;
  };

  idFeild?: string;
}
