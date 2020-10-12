import { HttpParams } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityMeta } from '../models/entity-meta';
import { FileProperty } from '../models/image/file-property';

export const EXT_ENTITY_SERVICE = new InjectionToken('EXT_ENTITY_SERVICE');

export abstract class AbstractEntityService {
  /***
   *
   */
  abstract getOne(entityMeta: EntityMeta, id: string | number): Observable<any>;
  /***
   *
   */
  abstract getOneByUrl(url: string, params: HttpParams): Observable<any>;
  /***
   *
   */
  abstract save(entityMeta: EntityMeta, newValue: object, original: object): Observable<any>;
  /***
   *
   */
  abstract uploadFiles(entity: any, filesMap: Map<string, FileProperty[]>): Observable<unknown[]>;
}
