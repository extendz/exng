import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Params, Router } from '@angular/router';
import {
  AbstractEntityService,

  EntityMeta,
  getId,
  ObjectWithLinks,
  Property
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { forkJoin, Observable, of } from 'rxjs';
import { defaultIfEmpty, finalize, map, mergeMap, take, tap } from 'rxjs/operators';

export class PropertyFile {
  name: string;
  file: File;
}

export class SavePayload {
  payload: any;
  propertyName: string;
  property?: Property;
  parentEntityMeta?: EntityMeta;
}

export class RestAndFiles {
  constructor(
    public payload: any,
    public files: PropertyFile[],
    public preSave?: SavePayload[],
    public postSave?: SavePayload[]
  ) {}
}

@Injectable({ providedIn: 'any' })
export class EntityService implements AbstractEntityService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private entityMetaService: EntityMetaService,
    public snackBar: MatSnackBar
  ) {}

  getOne(entityMeta: EntityMeta, id: string | number): Observable<ObjectWithLinks> {
    let params = new HttpParams();
    if (entityMeta?.config?.entity?.enableProjection)
      params = params.append('projection', entityMeta.config.entity.projection);
    return this.getOneByUrl(`${entityMeta.url}/${id}`, params);
  }

  getOneByUrl(url: string, params: HttpParams): Observable<ObjectWithLinks> {
    return this.http
      .get<ObjectWithLinks>(url, { params })
      .pipe(take(1));
  }

  navigate(property: Property, idField: string): void {
    this.entityMetaService
      .getModel(property.reference)
      .pipe(
        tap((em) => {
          const url = em.name;
          const id = getId(idField);
          this.router.navigate(['api', url, id]);
        }),
        take(1)
      )
      .subscribe();
  }

  navigateNew(property: Property, parentEntity: ObjectWithLinks): void {
    const id = getId(parentEntity._links.self.href);
    const queryParams: Params = {};
    queryParams[property.mappedBy] = id;
    this.entityMetaService
      .getModel(property.reference)
      .pipe(
        tap((em) => {
          const url = em.name;
          this.router.navigate(['api', url, 'new'], { queryParams });
        }),
        take(1)
      )
      .subscribe();
  }

  save(
    entityMeta: EntityMeta,
    newValue: object,
    navigate: boolean,
    original?: ObjectWithLinks
  ): Observable<any> {
    // console.log(newValue);

    let converted: RestAndFiles = this.process(newValue, entityMeta);
    let sub: Observable<any>;

    // PATCH;
    if (original && original._links)
      sub = this.http.patch<ObjectWithLinks>(original._links.self.href, converted.payload).pipe(
        take(1),
        finalize(() => this.showUpdated())
      );
    // POST
    else
      sub = this.http.post<ObjectWithLinks>(entityMeta.url, converted.payload).pipe(
        take(1),
        finalize(() => this.showCreated())
      );

    sub = sub.pipe(
      mergeMap((d) =>
        this.uploadFiles(d, converted.files).pipe(
          take(1),
          map((_) => d)
        )
      ),
      mergeMap((d) =>
        this.getPostSave(converted.postSave, d._links.self.href).pipe(
          mergeMap((_) => this.finalizeSave(d, navigate))
        )
      )
    );
    return sub;
    // return of();
  } //save()

  uploadFiles(entity: ObjectWithLinks, files: PropertyFile[]): Observable<unknown[]> {
    let reqs = [];
    files.forEach((v) => {
      const pathVar = v.name;
      const url = `${entity._links.self.href}/${pathVar}`;
      let formData = new FormData();
      formData.append(pathVar, v.file);
      reqs.push(this.http.post(url, formData).pipe(take(1)));
    });
    return forkJoin(reqs).pipe(defaultIfEmpty(null));
  } //uploadFiles()

  private showCreated() {
    this.snackBar.open('Created', null, { duration: 3000, panelClass: ['snack-bar-success'] });
  }

  private showUpdated() {
    this.snackBar.open('Updated', null, { duration: 3000, panelClass: ['snack-bar-info'] });
  }

  private getPostSave(postSaves: SavePayload[], parentRef: string) {
    // console.log('Post saving', postSaves, parentRef);
    let reqs = [];
    postSaves.forEach((ps) => {
      let savingEm = this.getEntityMetaFromParent(ps.parentEntityMeta, ps.propertyName);
      savingEm = savingEm.pipe(
        mergeMap((em) => {
          const payload = this.mapParent(ps.payload, parentRef, ps.parentEntityMeta.name);
          return this.save(em, payload, false);
        })
      );
      reqs.push(savingEm);
    });
    return forkJoin(reqs).pipe(defaultIfEmpty(null));
  }

  private getPreSave(preSave: SavePayload[]) {
    const preSaved = {};
    preSave.forEach((ps) => {
      let savingEm = this.entityMetaService.getModel(ps.property.reference);
      savingEm = savingEm.pipe(
        mergeMap((em) => {
          return this.save(em, ps.payload, false);
        })
      );
    });
  }

  private mapParent(payload: any, parentRef: string, propertyName: string) {
    payload[propertyName] = parentRef;
    return payload;
  }

  private finalizeSave(savedEntity: ObjectWithLinks, navigate: boolean = true) {
    let path = this.getRelativePath();
    if (navigate) {
      let id = getId(savedEntity._links.self.href);
      this.router.navigate([path, id], { replaceUrl: true });
    }
    return of(savedEntity);
  }

  private getRelativePath(): string {
    return this.router.url.substring(0, this.router.url.lastIndexOf('/') + 1);
  }

  private getEntityMetaFromParent(e: EntityMeta, propertyName: string): Observable<EntityMeta> {
    const p = e.properties[propertyName];
    return this.entityMetaService.getModel(p.reference);
  }

  private process(newValue: any, entityMeta: EntityMeta): RestAndFiles {
    // Detect ObjectWith links then convert them to id or id list
    const rest = {};
    const files: PropertyFile[] = [];
    const postSave: SavePayload[] = [];
    const preSave: SavePayload[] = [];

    Object.keys(newValue).forEach((key) => {
      const value = newValue[key];
      // Skip null values
      if (value == null || value == '_null') return;

      // if Pre save then push
      const property = entityMeta.properties[key];
      // if (property.preSave) {
      //   preSave.push({ payload: value, propertyName: key });
      //   return;
      // }

      // Arrays of object need to be refence as URLS.
      if (Array.isArray(value)) {
        const f = value
          .filter((x) => x != undefined)
          .map((payload) => {
            if (value instanceof Object && payload._links) return payload._links.self.href;
            else if (payload instanceof File) files.push({ file: payload, name: key });
            else postSave.push({ parentEntityMeta: entityMeta, payload, propertyName: key });
          })
          .filter((x) => x != undefined);
        if (f.length > 0) rest[key] = f;
      } else if (value instanceof File) {
        files.push({ file: value, name: key });
      } else if (value instanceof Object && value._links) {
        const linked: ObjectWithLinks = newValue[key];
        rest[key] = linked._links.self.href;
      } else rest[key] = newValue[key];
    });
    return new RestAndFiles(rest, files, preSave, postSave);
  }
} // class
