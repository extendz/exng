import { EXT_ENTITY_SERVICE } from 'extendz/core';
import { EntityService } from './entity.service';

export const ENTITY_CONFIG = {
  svgIconSet: 'assets/svg/api-icons.svg',
  modelsJson: 'assets/json/models.json',
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
