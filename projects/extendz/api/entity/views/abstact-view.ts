import { EventEmitter } from '@angular/core';
import { Params } from '@angular/router';
import { Action, EntityMeta, Property } from 'extendz/core';

export abstract class AbstractView {
  abstract entityMeta: EntityMeta;
  abstract entity: any;
  abstract action: EventEmitter<Action>;
  abstract params?: Params;
}
