import { InjectionToken } from '@angular/core';
import { ExtRootConfig } from './ext-root.config';

export const EXT_DATA_TABLE_CONFIG = new InjectionToken('EXT_DATA_TABLE_CONFIG');

export interface ExtDatatableConfig extends ExtRootConfig {
  placeholderImage?: string;
  dataTableProjecion?: string;
  dateFormat?: 'yyyy/MM/dd';
  pageSizeOptions?: number[];
  pageSize?: number;
  showFirstLastButtons?: boolean;
  defaultPageSize?: number;
  toolbar?: {
    search?: {
      width?: number;
    };
    color?: 'primary' | 'accent' | 'danger';
  };
}
