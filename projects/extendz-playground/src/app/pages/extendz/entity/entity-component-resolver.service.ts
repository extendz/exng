import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, Resolve, RouterStateSnapshot } from '@angular/router';
import { EntityMeta } from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { DataTableHateosService } from '../data-table/data-table-hateos.service';
import { EntityService } from './entity.service';

export interface EntityComponentResolverData {
  entityMeta: EntityMeta;
  entity: any;
  params?: Params;
}

@Injectable({ providedIn: 'any' })
export class EntityComponentResolverService implements Resolve<EntityComponentResolverData> {
  constructor(
    private entityMetaService: EntityMetaService,
    private entityService: EntityService,
    private dataTableService: DataTableHateosService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<EntityComponentResolverData> {
    const model = route.params['model'];
    const id = route.params['id'];
    let entityMeta: EntityMeta;

    return this.entityMetaService.getRoot().pipe(
      mergeMap((res) => this.entityMetaService.loadCache(res)),

      mergeMap((_) => this.entityMetaService.getModel(model)),
      tap((em) => (entityMeta = em)),
      mergeMap((em) => this.dataTableService.cacheUrls(em?.cache?.endPoints).pipe(map((_) => em))),
      mergeMap((m) => {
        if (id == 'new') return of(null);
        return this.entityService.getOne(m, id);
      }),
      map((entity) => ({
        entityMeta,
        entity,
        params: route.queryParams,
      }))
    );

    // this.entityMetaService.getModel(model).pipe(
    //   tap((em) => (entityMeta = em)),
    //   mergeMap((em) => {
    //     return this.entityMetaService.loadCache();
    //   }),
    //   mergeMap((m) => {
    //     if (id == 'new') return of(null);
    //     return this.entityService.getOne(m, id);
    //   }),
    //   map((entity) => ({
    //     entityMeta,
    //     entity,
    //     params: route.queryParams,
    //   }))
    // );
  } //resolve
} // class
