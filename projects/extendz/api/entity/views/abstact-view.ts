import { EventEmitter } from '@angular/core';
import { Params } from '@angular/router';
import { Action, EntityEvent, EntityMeta } from 'extendz/core';
import { Subject } from 'rxjs';

export abstract class AbstractView {
  abstract entityMeta: EntityMeta;
  abstract entity: any;
  abstract action: EventEmitter<Action>;
  abstract params?: Params;
  abstract events?: Subject<EntityEvent>;
  abstract eventsChange?: EventEmitter<Subject<EntityEvent>>;
}
