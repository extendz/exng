import { InjectionToken } from '@angular/core';

export const EXT_DATA_TABLE_CONFIG = new InjectionToken('EXT_DATA_TABLE_CONFIG');

export interface ExtDatatableConfig {
  pageSizeOptions?: number[];
  pageSize?: number;
  showFirstLastButtons?: boolean;
  defaultPageSize?: number;
}
