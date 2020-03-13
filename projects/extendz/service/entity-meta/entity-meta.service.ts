import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { EntityMetaResponse } from '../../core/models/entity-meta-response';
import { ExtApiConfig, EXTENDZ_API_CONFIG } from '../../core/models/ext-api-config';

@Injectable({ providedIn: 'root' })
export class EntityMetaService {
  private entityMetaResponse: EntityMetaResponse;

  constructor(
    private http: HttpClient,
    @Inject(EXTENDZ_API_CONFIG) private apiConfig: ExtApiConfig
  ) { }

  public getRoot(): Observable<EntityMetaResponse> {
    if (this.entityMetaResponse) return of(this.entityMetaResponse);
    return this.http
      .get<EntityMetaResponse>(this.apiConfig.modelsJson)
      .pipe(tap(res => this.entityMetaResponse = res), take(1));
  } // getRoot()
} // class
