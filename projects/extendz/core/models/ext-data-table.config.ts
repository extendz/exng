import { InjectionToken, Type } from '@angular/core';

export const EXT_DATA_TABLE_CONFIG = new InjectionToken('EXT_DATA_TABLE_CONFIG');

export interface ExtDatatableConfig {
  svgIconSet: string;
  modelsJson: string;
  placeholderImage?: string;
  dataTableProjecion?: string;
  dateFormat?: 'yyyy/MM/dd';
  pageSizeOptions?: number[];
  pageSize?: number;
  showFirstLastButtons?: boolean;
  defaultPageSize?: number;
}
