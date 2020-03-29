import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EntityMeta } from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { Observable, of } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { EntityService } from './entity.service';

export interface EntityComponentResolverData {
  entityMeta: EntityMeta;
  entity: any;
}

@Injectable({ providedIn: 'root' })
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
      tap(em => (entityMeta = em)),
      flatMap(m => {
        let data: Observable<any>;
        if (id == 'new') data = of(null);
        else data = this.entityService.getOne(m, id);
        return data;
      }),
      map(entity => ({
        entityMeta,
        entity
      }))
    );
  } //resolve
} // class
