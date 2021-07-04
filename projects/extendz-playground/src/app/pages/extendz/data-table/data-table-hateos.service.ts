import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  clearUrl,
  EntityMeta,
  HateosPagedResponse,
  ObjectWithLinks,
  PagedData,
} from 'extendz/core';
import { forkJoin, Observable, of } from 'rxjs';
import { defaultIfEmpty, map, take, tap } from 'rxjs/operators';
import { DataTableService } from './data-table.service';

@Injectable({ providedIn: 'root' })
export class DataTableHateosService extends DataTableService {
  constructor(public http: HttpClient, public snackBar: MatSnackBar) {
    super(http, snackBar);
  }

  private static cache: any = {};

  cacheUrls(urls: string[]): Observable<unknown[]> {
    let req = [];
    if (urls)
      req = urls.map((u) =>
        this.http.get<HateosPagedResponse>(u).pipe(
          take(1),
          tap((res) => (DataTableHateosService.cache[u] = res))
        )
      );
    return forkJoin(req).pipe(defaultIfEmpty());
  }

  public getData(
    entityMeta: EntityMeta,
    params?: HttpParams,
    pageEvent?: PageEvent
  ): Observable<PagedData> {
    if (DataTableHateosService.cache[entityMeta.url])
      return of(DataTableHateosService.cache[entityMeta.url]).pipe(
        map((d: HateosPagedResponse) => this.mapToFormat(d, entityMeta.url))
      );

    if (!params) params = new HttpParams();
    if (pageEvent) {
      params = params.append('page', `${pageEvent.pageIndex}`);
      params = params.append('size', `${pageEvent.pageSize}`);
      params = params.append('projection', 'dataTable');
    }
    if (entityMeta.sorts) {
      entityMeta.sorts.forEach((s) => (params = params.append('sort', s)));
    }

    return this.http
      .get<HateosPagedResponse>(entityMeta.url, { params })
      .pipe(map((d: HateosPagedResponse) => this.mapToFormat(d, entityMeta.url)));
  } // getData()

  mapToFormat(d: HateosPagedResponse, url: string) {
    return {
      data: d._embedded[url],
      page: {
        length: d.page.totalElements,
        pageIndex: d.page.number,
        pageSize: d.page.size,
      },
    };
  }

  public delete(entityMeta: EntityMeta, objects: ObjectWithLinks[]): Observable<any> {
    let urls: string[] = objects.map((o) => clearUrl(o._links.self.href));
    return this.deleteByUrls(urls);
  }
} // class
