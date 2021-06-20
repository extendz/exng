import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Params, Router } from '@angular/router';
import {
  AbstractEntityService,
  clearUrl,
  deepCopy,
  EntityMeta,
  getId,
  ObjectWithLinks,
  Property,
  PropertyType,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
import { catchError, defaultIfEmpty, delay, map, mergeMap, take, tap } from 'rxjs/operators';

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
    public postSave?: SavePayload[],
    public patchRequests?: any[]
  ) {}
}

@Injectable({ providedIn: 'any' })
export class EntityService implements AbstractEntityService {
  constructor(
    private router: Router,
    private http: HttpClient,
    public entityMetaService: EntityMetaService,
    public snackBar: MatSnackBar
  ) {}

  getOne(entityMeta: EntityMeta, id: string | number): Observable<ObjectWithLinks> {
    let params = new HttpParams();
    if (entityMeta?.config?.entity?.enableProjection)
      params = params.append('projection', entityMeta.config.entity.projection);
    return this.getOneByUrl(`${entityMeta.url}/${id}`, params);
  }

  getOneByUrl(url: string, params: HttpParams): Observable<ObjectWithLinks> {
    return this.http.get<ObjectWithLinks>(url, { params }).pipe(take(1));
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

  navigateExisting(property: Property, entity: ObjectWithLinks) {
    const id = getId(entity._links.self.href);
    this.navigate(property, id);
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
    newValue: any,
    navigate: boolean,
    original?: ObjectWithLinks,
    showSnackBar?: boolean
  ): Observable<any> {
    const entityMetaClone = deepCopy(entityMeta);

    // get tabs and merget with parent properties
    let _tabs = entityMetaClone.properties['_tabs'];
    if (_tabs) _tabs.tabs.forEach((prop) => (entityMetaClone.properties[prop.name] = prop));

    let converted: RestAndFiles = this.process(newValue, entityMetaClone);
    console.log('converted', converted);
    let payload = converted.payload;
    let sub: Observable<any>;
    let update: boolean = false;

    // PATCH;
    if (original && original._links) {
      update = true;
      sub = this.http.patch<ObjectWithLinks>(original._links.self.href, payload);
    } else sub = this.http.post<ObjectWithLinks>(entityMetaClone.url, payload);

    sub = sub.pipe(
      // after save/update take 1
      take(1),
      // Save files
      mergeMap((d) => this.uploadFiles(d, converted.files).pipe(map((_) => d))),
      // Post saves
      mergeMap((d) =>
        this.getPostSave([...converted.postSave], d._links.self.href).pipe(map((_) => d))
      ),
      // Patch requests
      mergeMap((d) =>
        forkJoin(converted.patchRequests).pipe(
          defaultIfEmpty(d),
          map((_) => d)
        )
      ),
      mergeMap((d) => this.finalizeSave(d, navigate))
    );

    return sub.pipe(
      tap((_) => {
        if (showSnackBar && !update) this.showCreated();
        else if (showSnackBar && update) this.showUpdated();
      }),
      catchError((e) => {
        if (showSnackBar) this.showError(e);
        return throwError(e);
      })
    );
  }

  uploadFiles(entity: ObjectWithLinks, files: PropertyFile[]) {
    return from(files).pipe(
      mergeMap((file) => {
        const pathVar = file.name;
        const url = `${entity._links.self.href}/${pathVar}`;
        let formData = new FormData();
        formData.append(pathVar, file.file);
        return this.http.post(url, formData).pipe(take(1), delay(1500));
      }),
      defaultIfEmpty()
    );
  }

  private showCreated() {
    this.snackBar.open('Created', null, { duration: 3000, panelClass: ['snack-bar-success'] });
  }

  private showError(res: HttpErrorResponse) {
    this.snackBar.open(`Error : ${res.error.error}`, null, {
      duration: 3000,
      panelClass: ['snack-bar-error'],
    });
  }

  private showUpdated() {
    this.snackBar.open('Updated', null, { duration: 3000, panelClass: ['snack-bar-info'] });
  }

  private getPostSave(postSaves: SavePayload[], parentRef: string) {
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

  private mapParent(payload: any, parentRef: string, propertyName: string) {
    payload[propertyName] = parentRef;
    return payload;
  }

  private finalizeSave(savedEntity: ObjectWithLinks, navigate: boolean = true) {
    console.log('saved entitty', savedEntity);

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
    console.debug('-------------------------------- ');
    console.debug('---------- ' + entityMeta.name + ' ---------- ');
    console.debug('-------------------------------- ');
    // Detect ObjectWith links then convert them to id or id list

    const rest = {};
    const files: PropertyFile[] = [];
    const postSave: SavePayload[] = [];
    const preSave: SavePayload[] = [];
    const patches: any[] = [];
    const properties: Property[] = Object.values(entityMeta.properties);

    properties.forEach((p) => {
      const key = p.name;
      const value = newValue[key];
      const type = p.type;

      if (value != null) console.debug(key, value, type);

      if (p.generated) return;
      else if (value == null) return;
      else if (type == PropertyType.objectList) {
        let savedObjectList = [];
        (value as any[]).forEach((payload) => {
          // post save only the object without id
          if (payload._links == null)
            postSave.push({ parentEntityMeta: entityMeta, payload, propertyName: key });
          else if (payload._links != null) {
            // Patch
            const url = clearUrl(payload._links.self.href);
            let entityMeta = p.entityMeta;
            if (!entityMeta) entityMeta = this.entityMetaService.getModelSync(p.reference);
            var converted = this.convertObjectToHateos(payload, entityMeta);
            const patchReq = this.http.patch(url, converted).pipe(take(1));
            patches.push(patchReq);
            // Update the current object
            savedObjectList.push(url);
          }
          if (savedObjectList.length > 0) rest[key] = savedObjectList;
        });
      } else if (type == PropertyType.matrix) {
        (value as any[]).forEach((payload) =>
          postSave.push({ parentEntityMeta: entityMeta, payload, propertyName: key })
        );
      } else if (type == PropertyType.image || type == PropertyType.file) {
        if (value instanceof File) files.push({ file: value, name: key });
        else rest[key] = value;
      } else if (type == PropertyType.object) {
        if (value && value._links) rest[key] = value._links.self.href;
        else rest[key] = value;
      } else rest[key] = value;
    });
    return new RestAndFiles(rest, files, preSave, postSave, patches);
  }

  private convertObjectToHateos(item: ObjectWithLinks, entityMeta: EntityMeta) {
    var returnObject = {};
    Object.values(entityMeta.properties).forEach((property: Property) => {
      var currentValue = item[property.name];
      if (!currentValue) return;
      switch (property.type) {
        case PropertyType.object:
          if (currentValue._links) returnObject[property.name] = currentValue._links.self.href;
          else returnObject[property.name] = currentValue;
          break;
        default:
          returnObject[property.name] = currentValue;
      }
    });
    return returnObject;
  }
}
