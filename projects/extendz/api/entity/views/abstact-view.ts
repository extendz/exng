import { EntityMeta } from 'extendz/core';

export abstract class AbstractView {
  abstract entityMeta: EntityMeta;
  abstract entity: any;
}
