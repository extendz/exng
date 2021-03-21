import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, Resolve, RouterStateSnapshot } from '@angular/router';
import { EntityMeta } from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { EntityService } from './entity.service';

export interface EntityComponentResolverData {
  entityMeta: EntityMeta;
  entity: any;
  params?: Params;
}

@Injectable({ providedIn: 'any' })
export class EntityComponentResolverService implements Resolve<EntityComponentResolverData> {
  constructor(private entityMetaService: EntityMetaService, private entityService: EntityService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<EntityComponentResolverData> {
    const model = route.params['model'];
    const id = route.params['id'];
    let entityMeta: EntityMeta;

    return this.entityMetaService.getModel(model).pipe(
      tap((em) => (entityMeta = em)),
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
  } //resolve
} // class
