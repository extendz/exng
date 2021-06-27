import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EntityMeta, EntityMetaResponse, ExtApiConfig, EXT_API_CONFIG } from 'extendz/core';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';

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
      tap((res) => (this.entityMetaResponse = res)),
      take(1)
    );
  }

  /*** This will find the rest of the configs */
  loadModel(name: string) {}

  getModel(name: string): Observable<EntityMeta> {
    if (this.cache[name]) return of(this.cache[name]).pipe(take(1));
    else
      return this.http.get(`${this.apiConfig.partials}/${name}.json`).pipe(
        take(1),
        catchError((e: HttpErrorResponse) => {
          this.matSnackBar.open(`${name}.json not found`, 'ok');
          return of(null);
        }),
        mergeMap((res) => {
          return this.getRoot().pipe(
            map((models) => {
              const resModel = models[name];
              return { ...resModel, ...res };
            })
          );
        })
      );
  }
}
