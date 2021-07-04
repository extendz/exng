import { HttpParams } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { EntityMeta } from '../models/entity-meta';
import { Property } from '../models/property';

export const EXT_ENTITY_SERVICE = new InjectionToken('EXT_ENTITY_SERVICE');

export abstract class AbstractEntityService {
  /*** Get single entity by the id*/
  abstract getOne(entityMeta: EntityMeta, id: string | number): Observable<any>;

  /*** Get single entity by url */
  abstract getOneByUrl(url: string, params: HttpParams): Observable<any>;

  /*** */
  abstract getOneByEntity(entityMeta: EntityMeta, entity: any): Observable<any>;

  /*** Save the current entity  */
  abstract save(
    entityMeta: EntityMeta,
    newValue: any,
    navigate: boolean,
    original?: any,
    showSnackBar?: boolean
  ): Observable<any>;

  abstract post(url: string, payload: any): Observable<any>;

  /*** Navigate the given property with the id  */
  abstract navigate(property: Property, idField: string): void;

  abstract navigateExisting(property: Property, entity: any): void;

  /*** Navigate to a new entity */
  abstract navigateNew(property: Property, parentEntity: any): void;
}
