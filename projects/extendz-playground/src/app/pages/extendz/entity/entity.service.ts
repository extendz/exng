import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  AbstractEntityService,
  diff,
  EntityMeta,
  FileProperty,
  getId,
  ObjectWithLinks,
} from 'extendz/core';
import { forkJoin, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EntityService implements AbstractEntityService {
  constructor(private router: Router, private http: HttpClient, public snackBar: MatSnackBar) {}

  public getOne(entityMeta: EntityMeta, id: string | number): Observable<ObjectWithLinks> {
    let params = new HttpParams();
    if (entityMeta?.config?.entity?.enableProjection)
      params = params.append('projection', entityMeta.config.entity.projection);
    return this.getOneByUrl(`${entityMeta.url}/${id}`, params);
  } //getOne()

  public getOneByUrl(url: string, params: HttpParams): Observable<ObjectWithLinks> {
    return this.http
      .get<ObjectWithLinks>(url, { params })
      .pipe(take(1));
  }

  public save(
    entityMeta: EntityMeta,
    newValue: object,
    original: ObjectWithLinks
  ): Observable<ObjectWithLinks> {
    let diffOb = diff(newValue, original);
    console.log('diff', diffOb);
    let converted = this.preSave(newValue);
    // PATCH
    if (original && original._links)
      return this.http.patch<ObjectWithLinks>(original._links.self.href, converted).pipe(
        take(1),
        tap((_) => this.showUpdated())
      );
    // POST
    return this.http.post<ObjectWithLinks>(entityMeta.url, converted).pipe(
      take(1),
      tap((_) => this.showCreated()),
      tap((d) => this.postSave(d))
    );
  } //save()

  public uploadFiles(
    entity: ObjectWithLinks,
    fileMap: Map<string, FileProperty[]>
  ): Observable<unknown[]> {
    let reqs = [];
    fileMap.forEach((v, k) => {
      const url = `${entity._links.self.href}/${k}`;
      let formData = new FormData();
      v.forEach((f) => formData.append(k, f.file));
      reqs.push(this.http.post(url, formData).pipe(take(1)));
    });
    return forkJoin(reqs);
  } //uploadFiles()

  private showCreated() {
    this.snackBar.open('Created', null, {
      duration: 3000,
      panelClass: ['snack-bar-success'],
    });
  } // showCreated

  private showUpdated() {
    this.snackBar.open('Updated', null, {
      duration: 3000,
      panelClass: ['snack-bar-info'],
    });
  } //showUpdated()

  private postSave(entity: ObjectWithLinks) {
    let path = this.getRelativePath();
    let id = getId(entity._links.self.href);
    this.router.navigate([path, id], { replaceUrl: true });
  }

  private getRelativePath(): string {
    return this.router.url.substring(0, this.router.url.lastIndexOf('/') + 1);
  }

  private preSave(newValue: object) {
    // Detect ObjectWith links then convert them to id or id list
    let finalSave = {};
    Object.keys(newValue).forEach((key) => {
      const v = newValue[key];
      // Skip null values
      if (v == null || v == '_null') return;
      let type = typeof v;
      // Arrays of object need to be refence as URLS.
      if (Array.isArray(v)) {
        finalSave[key] = v.map((x) => {
          const type = typeof x;
          // HATEOS will return url
          if (type === 'object') return x._links.self.href;
          else return x;
        });
      } else if (type === 'object') {
        const linked: ObjectWithLinks = newValue[key];
        finalSave[key] = linked._links.self.href;
      } else finalSave[key] = newValue[key];
    });
    return finalSave;
  }
} // class
