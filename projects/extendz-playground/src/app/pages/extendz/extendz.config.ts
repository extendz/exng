import {
  ExtDatatableConfig,
  ExtRootConfig,
  EXT_DATA_TABLE_SERVICE,
  EXT_ENTITY_CONFIG,
  EXT_ENTITY_SERVICE,
} from 'extendz/core';
import { DataTableHateosService } from './data-table/data-table-hateos.service';
import { EntityService } from './entity/entity.service';

export const ROOT_CONFIG: ExtRootConfig = {
  svgIconSet: 'assets/svg/api-icons.svg',
  modelsJson: 'assets/json/models.json',
  partials: 'assets/json/entities',
};

export const DATA_TABLE_CONFIG: ExtDatatableConfig = {
  ...ROOT_CONFIG,
  placeholderImage: 'assets/img/placeholder.png',
  dataTableProjecion: 'dataTable',
  dateFormat: 'yyyy-MM-dd',
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

export const ENTITY_CONFIG = {
  ...ROOT_CONFIG,
  placeholderImage: 'assets/img/placeholder.png',
  unitOfMeasurement: {
    model: 'unitOfMeasure',
  },
  phone: {
    model: 'country',
    defaultPhoneCode: '+94',
  },
  currency: {
    model: 'currency',
    defaultCurrency: 'LKR',
  },
  idFeild: '_links.self.href',
};

export const ENTITY_SERVICE = {
  provide: EXT_ENTITY_SERVICE,
  useClass: EntityService,
};

export const DATA_TABLE_SERVICE = {
  provide: EXT_DATA_TABLE_SERVICE,
  useClass: DataTableHateosService,
};

export const ENTITY_CONFIG_T = {
  provide: EXT_ENTITY_CONFIG,
  useValue: ENTITY_CONFIG,
};
