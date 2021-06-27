import { InjectionToken } from '@angular/core';

export const EXT_API_CONFIG = new InjectionToken('EXT_API_CONFIG');

export class ExtApiConfig {
  constructor(public modelsJson: string, public partials: string) {}
}
