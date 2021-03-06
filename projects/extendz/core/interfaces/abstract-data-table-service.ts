import { HttpParams } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { EntityMeta } from '../models/entity-meta';
import { PagedData } from './paged-data.interface';

export const EXT_DATA_TABLE_SERVICE = new InjectionToken('EXT_DATA_TABLE_SERVICE');

export abstract class AbstractDataTableService {
  abstract getData(
    entityMeta: EntityMeta,
    params?: HttpParams,
    pageEvent?: PageEvent
  ): Observable<PagedData>;

  abstract deleteByUrls(urls: string[]): Observable<any>;

  abstract delete(entityMeta: EntityMeta, object: any[]): Observable<any>;
}
