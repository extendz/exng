import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EntityMeta, EntityMetaResponse, ExtApiConfig, EXT_API_CONFIG } from 'extendz/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, defaultIfEmpty, map, mergeMap, take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'any' })
export class EntityMetaService {
  private entityMetaResponse: EntityMetaResponse;
  private cache: EntityMetaResponse = {};

  constructor(
    @Inject(EXT_API_CONFIG) private apiConfig: ExtApiConfig,
    private http: HttpClient,
    private matSnackBar: MatSnackBar
  ) {}

  getRoot(): Observable<EntityMetaResponse> {
    if (this.entityMetaResponse) return of(this.entityMetaResponse);
    return this.http.get<EntityMetaResponse>(this.apiConfig.modelsJson).pipe(
      take(1),
      tap((res) => (this.entityMetaResponse = res))
    );
  }

  loadCache(res: EntityMetaResponse): Observable<unknown[]> {
    // console.log(res);

    const reques = [];
    Object.entries(res).filter((valueArray) => {
      const key = valueArray[0];
      const value = valueArray[1];

      if (value.cache?.model) {
        reques.push(this.getModel(key));
      }
      if (value?.cache?.references) {
        value?.cache.references.forEach((ref) => reques.push(this.getModel(ref)));
      }
    });

    return forkJoin(reques).pipe(defaultIfEmpty(), take(1));
  }

  getModel(name: string): Observable<EntityMeta> {
    if (this.cache[name]) return of(this.cache[name]).pipe(take(1));
    else {
      return this.http.get(`${this.apiConfig.partials}/${name}.json`).pipe(
        take(1),
        catchError((e: HttpErrorResponse) => {
          this.matSnackBar.open(`${name}.json not found`, 'ok');
          return of(null);
        }),
        mergeMap((res: EntityMeta) => {
          return this.getRoot().pipe(
            map((models) => {
              const resModel = models[name];
              return { ...resModel, ...res };
            })
          );
        }),
        tap((em) => (this.cache[name] = em)),
        take(1)
        // tap((res) => this.loadCache(this.entityMetaResponse))
      );
    }
  }
}
