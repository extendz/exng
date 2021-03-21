import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  EntityMeta,
  ExtApiConfig,
  EXT_API_CONFIG,
  HateosPagedResponse,
  ObjectWithLinks,
  PagedData,
} from 'extendz/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataTableService } from './data-table.service';

@Injectable({ providedIn: 'root' })
export class DataTableHateosService extends DataTableService {
  constructor(
    public http: HttpClient,
    public snackBar: MatSnackBar,
    @Inject(EXT_API_CONFIG) public config: ExtApiConfig
  ) {
    super(http, snackBar, config);
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
    return this.http
      .get<HateosPagedResponse>(entityMeta.url, { params })
      .pipe(
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
    let urls: string[] = objects.map((o) => o._links.self.href);
    return this.deleteByUrls(urls);
  }
} // class
