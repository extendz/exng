import { EventEmitter } from '@angular/core';
import { Action, EntityMeta } from 'extendz/core';

export abstract class AbstractView {
  abstract entityMeta: EntityMeta;
  abstract entity: any;
  abstract action: EventEmitter<Action>;
}
