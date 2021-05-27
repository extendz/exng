import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EntityMeta, EntityMetaResponse, ExtApiConfig, EXT_API_CONFIG } from 'extendz/core';
import { Observable, of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'any' })
export class EntityMetaService {
  private entityMetaResponse: EntityMetaResponse;

  constructor(@Inject(EXT_API_CONFIG) private apiConfig: ExtApiConfig, private http: HttpClient) {}

  getRoot(): Observable<EntityMetaResponse> {
    if (this.entityMetaResponse) return of(this.entityMetaResponse);
    return this.http.get<EntityMetaResponse>(this.apiConfig.modelsJson).pipe(
      tap((res) => (this.entityMetaResponse = res)),
      take(1)
    );
  }

  getModel(name: string): Observable<EntityMeta> {
    return this.getRoot().pipe(map((models) => models[name], take(1)));
  }
}
