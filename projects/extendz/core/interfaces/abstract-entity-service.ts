import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityMeta } from '../models/entity-meta';

export const EXT_ENTITY_SERVICE = new InjectionToken('EXT_ENTITY_SERVICE');

export abstract class AbstractEntityService {
  abstract getOne(entityMeta: EntityMeta, id: string | number): Observable<any>;
  abstract getOneByUrl(url: string): Observable<any>;
}
