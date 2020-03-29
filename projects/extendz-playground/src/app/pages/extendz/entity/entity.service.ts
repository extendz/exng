import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractEntityService, EntityMeta } from 'extendz/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EntityService implements AbstractEntityService {
  constructor(private http: HttpClient) {}

  public getOne(entityMeta: EntityMeta, id: string | number): Observable<any> {
    return this.getOneByUrl(`${entityMeta.url}/${id}`);
  }

  public getOneByUrl(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
}
