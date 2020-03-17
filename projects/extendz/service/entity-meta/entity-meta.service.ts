import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { EntityMetaResponse, ExtApiConfig, EXTENDZ_API_CONFIG } from 'extendz/core';
import { Observable, of } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EntityMetaService {
  private entityMetaResponse: EntityMetaResponse;

  constructor(
    private http: HttpClient,
    @Inject(EXTENDZ_API_CONFIG) private apiConfig: ExtApiConfig,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIconSetInNamespace(
      'api-root',
      this.sanitizer.bypassSecurityTrustResourceUrl(this.apiConfig.svgIconSet)
    );
  }

  public getRoot(): Observable<EntityMetaResponse> {
    if (this.entityMetaResponse) return of(this.entityMetaResponse);
    return this.http.get<EntityMetaResponse>(this.apiConfig.modelsJson).pipe(
      tap(res => (this.entityMetaResponse = res)),
      take(1)
    );
  } // getRoot()
} // class
