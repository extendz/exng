import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import {
  AbstractDataTableService,
  EntityMeta,
  ExtApiConfig,
  EXT_API_CONFIG,
  PagedData,
} from 'extendz/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, filter, flatMap, take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataTableService extends AbstractDataTableService {
  constructor(
    public http: HttpClient,
    public snackBar: MatSnackBar,
    @Inject(EXT_API_CONFIG) public config: ExtApiConfig
  ) {
    super();
  }

  public getData(
    entityMeta: EntityMeta,
    params?: HttpParams,
    pageEvent?: PageEvent
  ): Observable<PagedData> {
    if (!params) params = new HttpParams();
    if (pageEvent) {
      params = params.append('pageIndex', `${pageEvent.pageIndex}`);
      params = params.append('pageSize', `${pageEvent.pageSize}`);
    }

    return this.http
      .get<PagedData>(entityMeta.url, { params })
      .pipe(take(1));
  } // getData()

  public delete(entityMeta: EntityMeta, objects: object[]): Observable<any> {
    let urls: string[] = objects.map((id) => `${entityMeta.url}/${id}`);
    return this.deleteByUrls(urls);
  }

  public deleteByUrls(urls: string[]): Observable<any> {
    let ref = this.snackBar.open('Are you sure want to delete ?', 'Yes', {
      duration: 3000,
      panelClass: ['snack-bar-info'],
    });
    let reqs: Observable<Object>[] = [];
    urls.forEach((ulr) => reqs.push(this.http.delete(ulr).pipe(take(1))));
    return ref.afterDismissed().pipe(
      filter((d: MatSnackBarDismiss) => d.dismissedByAction),
      flatMap((_) => forkJoin(reqs)),
      take(1),
      tap((_) =>
        this.snackBar.open('Deleted', null, {
          duration: 3000,
          panelClass: ['snack-bar-info'],
        })
      ),
      catchError((err: HttpErrorResponse) => {
        if (err.status == 409)
          this.snackBar.open("This is depending on another entity. Can't delete !", 'Okay', {
            panelClass: ['snack-bar-error'],
          });
        this.snackBar.open('Delete failed', 'Okay', { duration: 3000 });
        return throwError(err);
      })
    );
  } //delete()
} // class
