import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityService, diff, EntityMeta, ObjectWithLinks } from 'extendz/core';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EntityService implements AbstractEntityService {
  constructor(private http: HttpClient, public snackBar: MatSnackBar) {}

  public getOne(entityMeta: EntityMeta, id: string | number): Observable<any> {
    let params = new HttpParams();
    params = params.append('projection', 'entity');
    return this.getOneByUrl(`${entityMeta.url}/${id}`, params);
  }

  public getOneByUrl(url: string, params: HttpParams): Observable<any> {
    return this.http.get<any>(url, { params });
  }

  public save(
    entityMeta: EntityMeta,
    newValue: object,
    original: ObjectWithLinks
  ): Observable<any> {
    let diffOb = diff(newValue, original);
    console.log('diff', diffOb);
    let converted = this.preSave(newValue);
    if (original && original._links)
      return this.http.patch(original._links.self.href, converted).pipe(
        take(1),
        tap((_) =>
          this.snackBar.open('Updated', null, {
            duration: 3000,
            panelClass: ['snack-bar-info'],
          })
        )
      );
    return this.http.post(entityMeta.url, converted).pipe(
      take(1),
      tap((_) =>
        this.snackBar.open('Created', null, {
          duration: 3000,
          panelClass: ['snack-bar-success'],
        })
      )
    );
  }

  private preSave(newValue: object) {
    // Detect ObjectWith links then convert them to id or id list
    let finalSave = {};
    Object.keys(newValue).forEach((key) => {
      const v = newValue[key];
      // Skip null values
      if (v == null || v == '_null') return;
      let type = typeof v;
      if (Array.isArray(v)) {
        finalSave[key] = v.map((x) => x._links.self.href);
      } else if (type === 'object') {
        const linked: ObjectWithLinks = newValue[key];
        console.log('gettting id from ', linked);
        finalSave[key] = linked._links.self.href;
      } else finalSave[key] = newValue[key];
    });
    return finalSave;
  }

  // public save(url: string, object: object) {
  //   return this.http.post(url, object).pipe(take(1));
  // }
}
