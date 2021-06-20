import { ExtDatatableConfig, EXT_DATA_TABLE_SERVICE, EXT_ENTITY_CONFIG } from 'extendz/core';
import { ENTITY_CONFIG } from '../entity/entity.config';
import { DataTableHateosService } from './data-table-hateos.service';

export const DATA_TABLE_SERVICE = {
  provide: EXT_DATA_TABLE_SERVICE,
  useClass: DataTableHateosService,
};

export const ENTITY_CONFIG_T = {
  provide: EXT_ENTITY_CONFIG,
  useValue: ENTITY_CONFIG,
};

export const DATA_TABLE_CONFIG: ExtDatatableConfig = {
  svgIconSet: 'assets/svg/api-icons.svg',
  modelsJson: 'assets/json/models.json',
  placeholderImage: 'assets/img/placeholder.png',
  dataTableProjecion: 'dataTable',
  pageSizeOptions: [10, 20, 100, 500],
  showFirstLastButtons: true,
  defaultPageSize: 20,
  toolbar: {
    search: {
      width: 20,
    },
    // color: 'primary',
  },
};
