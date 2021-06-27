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
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DataTableService } from './data-table.service';

@Injectable({ providedIn: 'root' })
export class DataTableHateosService extends DataTableService {
  constructor(public http: HttpClient, public snackBar: MatSnackBar) {
    super(http, snackBar);
  }

  public getData(
    entityMeta: EntityMeta,
    params?: HttpParams,
    pageEvent?: PageEvent
  ): Observable<PagedData> {
    if (!params) params = new HttpParams();
    if (pageEvent) {
      params = params.append('page', `${pageEvent.pageIndex}`);
      params = params.append('size', `${pageEvent.pageSize}`);
      params = params.append('projection', 'dataTable');
    }
    if (entityMeta.sorts) {
      entityMeta.sorts.forEach((s) => (params = params.append('sort', s)));
    }

    return this.http.get<HateosPagedResponse>(entityMeta.url, { params }).pipe(
      map((d: HateosPagedResponse) => {
        return {
          data: d._embedded[entityMeta.url],
          page: {
            length: d.page.totalElements,
            pageIndex: d.page.number,
            pageSize: d.page.size,
          },
        };
      })
    );
  } // getData()

  public delete(entityMeta: EntityMeta, objects: ObjectWithLinks[]): Observable<any> {
    let urls: string[] = objects.map((o) => clearUrl(o._links.self.href));
    return this.deleteByUrls(urls);
  }
} // class
